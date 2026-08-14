package cmd

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-contrib/cache"
	"github.com/gin-contrib/cache/persistence"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/urfave/cli/v3"

	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/api"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/cron"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/errs"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/log"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/middlewares"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/requestid"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/settings"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/utils"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/validators"
)

// WebServer represents the server command
var WebServer = &cli.Command{
	Name:  "server",
	Usage: "Spendly web server operation",
	Commands: []*cli.Command{
		{
			Name:   "run",
			Usage:  "Run Spendly web server",
			Action: bindAction(startWebServer),
		},
	},
}

func startWebServer(c *core.CliContext) error {
	config, err := initializeSystem(c)

	if err != nil {
		return err
	}

	log.BootInfof(c, "[webserver.startWebServer] static root path is %s", config.StaticRootPath)

	if config.AutoUpdateDatabase {
		err = updateAllDatabaseTablesStructure(c)

		if err != nil {
			log.BootErrorf(c, "[webserver.startWebServer] update database table structure failed, because %s", err.Error())
			return err
		}
	}

	err = requestid.InitializeRequestIdGenerator(c, config)

	if err != nil {
		log.BootErrorf(c, "[webserver.startWebServer] initializes requestid generator failed, because %s", err.Error())
		return err
	}

	err = cron.InitializeCronJobSchedulerContainer(c, config, true)

	if err != nil {
		log.BootErrorf(c, "[webserver.startWebServer] initializes cron job scheduler failed, because %s", err.Error())
		return err
	}

	serverInfo := fmt.Sprintf("current server id is %d, current instance id is %d", requestid.Container.GetCurrentServerUniqId(), requestid.Container.GetCurrentInstanceUniqId())
	uuidServerInfo := ""
	if config.UuidGeneratorType == settings.InternalUuidGeneratorType {
		uuidServerInfo = fmt.Sprintf(", current uuid server id is %d", config.UuidServerId)
	}

	log.BootInfof(c, "[webserver.startWebServer] %s%s", serverInfo, uuidServerInfo)

	if config.Mode == settings.MODE_PRODUCTION {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(bindMiddleware(middlewares.Recovery, config))

	err = router.SetTrustedProxies(config.TrustedProxyTextualIPs)

	if err != nil {
		log.BootErrorf(c, "[webserver.startWebServer] set trusted proxy failed, because %s", err.Error())
		return err
	}

	if config.EnableGZip {
		router.Use(gzip.Gzip(gzip.DefaultCompression))
	}

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		_ = v.RegisterValidation("notBlank", validators.NotBlank)
		_ = v.RegisterValidation("validUsername", validators.ValidUsername)
		_ = v.RegisterValidation("validEmail", validators.ValidEmail)
		_ = v.RegisterValidation("validNickname", validators.ValidNickname)
		_ = v.RegisterValidation("validCurrency", validators.ValidCurrency)
		_ = v.RegisterValidation("validHexRGBColor", validators.ValidHexRGBColor)
		_ = v.RegisterValidation("validAmountFilter", validators.ValidAmountFilter)
		_ = v.RegisterValidation("validTransactionAmount", validators.ValidTransactionAmount)
		_ = v.RegisterValidation("validTagFilter", validators.ValidTagFilter)
		_ = v.RegisterValidation("validFiscalYearStart", validators.ValidateFiscalYearStart)
	}

	router.NoRoute(bindApi(api.Default.ApiNotFound, config))
	router.NoMethod(bindApi(api.Default.MethodNotAllowed, config))

	serverSettingsCacheStore := persistence.NewInMemoryStore(time.Minute)
	router.GET("/server_settings.js", bindCachedJs(api.ServerSettings.ServerSettingsJavascriptHandler, config, serverSettingsCacheStore))

	if _, err = os.Stat(config.StaticRootPath); err == nil {
		workboxFileNames := utils.ListFileNamesWithPrefixAndSuffix(config.StaticRootPath, "workbox-", ".js")

		router.StaticFile("/", filepath.Join(config.StaticRootPath, "index.html"))
		router.Static("/js", filepath.Join(config.StaticRootPath, "js"))
		router.Static("/css", filepath.Join(config.StaticRootPath, "css"))
		router.Static("/img", filepath.Join(config.StaticRootPath, "img"))
		router.Static("/fonts", filepath.Join(config.StaticRootPath, "fonts"))

		router.StaticFile("robots.txt", filepath.Join(config.StaticRootPath, "robots.txt"))
		router.StaticFile("favicon.ico", filepath.Join(config.StaticRootPath, "favicon.ico"))
		router.StaticFile("favicon.png", filepath.Join(config.StaticRootPath, "favicon.png"))
		router.StaticFile("touchicon.png", filepath.Join(config.StaticRootPath, "touchicon.png"))
		router.StaticFile("manifest.json", filepath.Join(config.StaticRootPath, "manifest.json"))
		router.StaticFile("sw.js", filepath.Join(config.StaticRootPath, "sw.js"))

		for i := 0; i < len(workboxFileNames); i++ {
			router.StaticFile("/"+workboxFileNames[i], filepath.Join(config.StaticRootPath, workboxFileNames[i]))
		}

		router.StaticFile("/mobile", filepath.Join(config.StaticRootPath, "mobile.html"))
		router.Match([]string{http.MethodHead, http.MethodGet}, "/mobile#/*fragment", bindLocalFile(filepath.Join(config.StaticRootPath, "mobile.html")))  // add compatibility for browsers that send the full URL with the fragment to the server
		router.Match([]string{http.MethodHead, http.MethodGet}, "/mobile#!/*fragment", bindLocalFile(filepath.Join(config.StaticRootPath, "mobile.html"))) // add compatibility for browsers that send the full URL with the fragment to the server
		router.Static("/mobile/js", filepath.Join(config.StaticRootPath, "js"))
		router.Static("/mobile/css", filepath.Join(config.StaticRootPath, "css"))
		router.Static("/mobile/img", filepath.Join(config.StaticRootPath, "img"))
		router.Static("/mobile/fonts", filepath.Join(config.StaticRootPath, "fonts"))
		router.StaticFile("/mobile/favicon.ico", filepath.Join(config.StaticRootPath, "favicon.ico"))
		router.StaticFile("/mobile/favicon.png", filepath.Join(config.StaticRootPath, "favicon.png"))
		router.StaticFile("/mobile/touchicon.png", filepath.Join(config.StaticRootPath, "touchicon.png"))
		router.StaticFile("/mobile/manifest.json", filepath.Join(config.StaticRootPath, "manifest.json"))
		router.StaticFile("/mobile/sw.js", filepath.Join(config.StaticRootPath, "sw.js"))
		router.GET("/mobile/server_settings.js", bindCachedJs(api.ServerSettings.ServerSettingsJavascriptHandler, config, serverSettingsCacheStore))

		for i := 0; i < len(workboxFileNames); i++ {
			router.StaticFile("/mobile/"+workboxFileNames[i], filepath.Join(config.StaticRootPath, workboxFileNames[i]))
		}

		router.StaticFile("/desktop", filepath.Join(config.StaticRootPath, "desktop.html"))
		router.Match([]string{http.MethodHead, http.MethodGet}, "/desktop#/*fragment", bindLocalFile(filepath.Join(config.StaticRootPath, "desktop.html"))) // add compatibility for browsers that send the full URL with the fragment to the server
		router.Static("/desktop/js", filepath.Join(config.StaticRootPath, "js"))
		router.Static("/desktop/css", filepath.Join(config.StaticRootPath, "css"))
		router.Static("/desktop/img", filepath.Join(config.StaticRootPath, "img"))
		router.Static("/desktop/fonts", filepath.Join(config.StaticRootPath, "fonts"))
		router.StaticFile("/desktop/favicon.ico", filepath.Join(config.StaticRootPath, "favicon.ico"))
		router.StaticFile("/desktop/favicon.png", filepath.Join(config.StaticRootPath, "favicon.png"))
		router.StaticFile("/desktop/touchicon.png", filepath.Join(config.StaticRootPath, "touchicon.png"))
		router.StaticFile("/desktop/manifest.json", filepath.Join(config.StaticRootPath, "manifest.json"))
		router.StaticFile("/desktop/sw.js", filepath.Join(config.StaticRootPath, "sw.js"))
		router.GET("/desktop/server_settings.js", bindCachedJs(api.ServerSettings.ServerSettingsJavascriptHandler, config, serverSettingsCacheStore))

		for i := 0; i < len(workboxFileNames); i++ {
			router.StaticFile("/desktop/"+workboxFileNames[i], filepath.Join(config.StaticRootPath, workboxFileNames[i]))
		}
	}

	router.GET("/healthz.json", bindApi(api.Healths.HealthStatusHandler, config))

	apiRoute := router.Group("/api")

	apiRoute.Use(bindMiddleware(middlewares.RequestId(config), config))
	apiRoute.Use(bindMiddleware(middlewares.RequestLog, config))
	{
		authRoute := apiRoute.Group("/auth")
		{
			authRoute.POST("/register", bindApiWithTokenUpdate(api.SmartFinance.RegisterHandler, config))
			authRoute.POST("/login", bindApiWithTokenUpdate(api.SmartFinance.LoginHandler, config))
		}

		protectedRoute := apiRoute.Group("")
		protectedRoute.Use(bindMiddleware(middlewares.JWTAuthorizationByCookie(config), config))
		{
			protectedRoute.GET("/auth/me", bindApi(api.SmartFinance.CurrentUserHandler, config))
			protectedRoute.POST("/auth/logout", bindApi(api.SmartFinance.LogoutHandler, config))
			protectedRoute.GET("/transactions", bindApi(api.SmartFinance.ListTransactionsHandler, config))
			protectedRoute.POST("/transactions", bindApi(api.SmartFinance.CreateTransactionHandler, config))
			protectedRoute.GET("/transactions/import", bindApi(api.SmartFinance.ListImportedTransactionsHandler, config))
			protectedRoute.POST("/transactions/import", bindApi(api.SmartFinance.ImportTransactionsHandler, config))
			protectedRoute.PUT("/transactions/:id", bindApi(api.SmartFinance.UpdateTransactionHandler, config))
			protectedRoute.DELETE("/transactions/:id", bindApi(api.SmartFinance.DeleteTransactionHandler, config))
			protectedRoute.GET("/analytics/summary", bindApi(api.SmartFinance.AnalyticsSummaryHandler, config))
			protectedRoute.GET("/analytics/recurring", bindApi(api.SmartFinance.RecurringTransactionsHandler, config))
			protectedRoute.GET("/analytics/anomalies", bindApi(api.SmartFinance.AnomaliesHandler, config))
			protectedRoute.GET("/health-score", bindApi(api.SmartFinance.HealthScoreHandler, config))
			protectedRoute.GET("/recommendations", bindApi(api.SmartFinance.RecommendationsHandler, config))
			protectedRoute.GET("/budgets", bindApi(api.SmartFinance.ListBudgetsHandler, config))
			protectedRoute.POST("/budgets", bindApi(api.SmartFinance.CreateBudgetHandler, config))
			protectedRoute.PUT("/budgets/:id", bindApi(api.SmartFinance.UpdateBudgetHandler, config))
			protectedRoute.DELETE("/budgets/:id", bindApi(api.SmartFinance.DeleteBudgetHandler, config))
			protectedRoute.GET("/goals", bindApi(api.SmartFinance.ListGoalsHandler, config))
			protectedRoute.POST("/goals", bindApi(api.SmartFinance.CreateGoalHandler, config))
			protectedRoute.PUT("/goals/:id", bindApi(api.SmartFinance.UpdateGoalHandler, config))
			protectedRoute.DELETE("/goals/:id", bindApi(api.SmartFinance.DeleteGoalHandler, config))
			protectedRoute.GET("/category-rules", bindApi(api.SmartFinance.ListCategoryRulesHandler, config))
			protectedRoute.POST("/category-rules", bindApi(api.SmartFinance.CreateCategoryRuleHandler, config))
			protectedRoute.PUT("/category-rules/:id", bindApi(api.SmartFinance.UpdateCategoryRuleHandler, config))
			protectedRoute.DELETE("/category-rules/:id", bindApi(api.SmartFinance.DeleteCategoryRuleHandler, config))
			protectedRoute.GET("/planned-addons", bindApi(api.SmartFinance.ListPlannedAddOnsHandler, config))
			protectedRoute.POST("/planned-addons", bindApi(api.SmartFinance.CreatePlannedAddOnHandler, config))
			protectedRoute.GET("/system/version", bindApi(api.Systems.VersionHandler, config))
		}
	}

	listenAddr := fmt.Sprintf("%s:%d", config.HttpAddr, config.HttpPort)

	if config.Protocol == settings.SCHEME_SOCKET {
		log.BootInfof(c, "[webserver.startWebServer] will run at socks:%s", config.UnixSocketPath)
		err = router.RunUnix(config.UnixSocketPath)
	} else if config.Protocol == settings.SCHEME_HTTP {
		log.BootInfof(c, "[webserver.startWebServer] will run at http://%s", listenAddr)
		err = router.Run(listenAddr)
	} else if config.Protocol == settings.SCHEME_HTTPS {
		log.BootInfof(c, "[webserver.startWebServer] will run at https://%s", listenAddr)
		err = router.RunTLS(listenAddr, config.CertFile, config.CertKeyFile)
	} else {
		err = errs.ErrInvalidProtocol
	}

	if err != nil {
		log.BootErrorf(c, "[webserver.startWebServer] cannot start, because %s", err)
		return err
	}

	return nil
}

func bindMiddleware(fn core.MiddlewareHandlerFunc, config *settings.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		fn(core.WrapWebContext(c, config.TrustedProxyIPs))
	}
}

func bindLocalFile(filePath string) gin.HandlerFunc {
	return func(ginCtx *gin.Context) {
		ginCtx.File(filePath)
	}
}

func bindApi(fn core.ApiHandlerFunc, config *settings.Config) gin.HandlerFunc {
	return func(ginCtx *gin.Context) {
		c := core.WrapWebContext(ginCtx, config.TrustedProxyIPs)
		result, err := fn(c)

		if err != nil {
			utils.PrintJsonErrorResult(c, err)
		} else {
			utils.PrintJsonSuccessResult(c, result)
		}
	}
}

func bindApiWithTokenUpdate(fn core.ApiHandlerFunc, config *settings.Config) gin.HandlerFunc {
	return func(ginCtx *gin.Context) {
		c := core.WrapWebContext(ginCtx, config.TrustedProxyIPs)
		result, err := fn(c)

		if err == nil {
			c.SetTokenStringToCookie(c.GetTextualToken(), int(config.TokenExpiredTime), "/", config.IsHTTPS())
		}

		if err == nil && config.MapProvider == settings.AmapProvider && config.AmapSecurityVerificationMethod == settings.AmapSecurityVerificationInternalProxyMethod {
			middlewares.AmapApiProxyAuthCookie(c, config)
		}

		if err != nil {
			utils.PrintJsonErrorResult(c, err)
		} else {
			utils.PrintJsonSuccessResult(c, result)
		}
	}
}

func bindCachedJs(fn core.DataHandlerFunc, config *settings.Config, store persistence.CacheStore) gin.HandlerFunc {
	return cache.CachePage(store, time.Minute, func(ginCtx *gin.Context) {
		c := core.WrapWebContext(ginCtx, config.TrustedProxyIPs)
		result, _, err := fn(c)

		if err != nil {
			utils.PrintDataErrorResult(c, "text/javascript", err)
		} else {
			utils.PrintDataSuccessResult(c, "text/javascript; charset=utf-8", "", result)
		}
	})
}
