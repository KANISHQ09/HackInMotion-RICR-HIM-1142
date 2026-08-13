package api

import (
	"encoding/csv"
	"fmt"
	"math"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/datastore"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/errs"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/log"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/models"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/services"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/utils"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/uuid"
)

const smartFinanceDefaultCurrency = "INR"
const smartFinanceDefaultAccountName = "Primary Account"
const smartFinanceMaxCSVImportSize = 5 * 1024 * 1024

type smartFinanceTransactionType string

const (
	smartFinanceDebit  smartFinanceTransactionType = "debit"
	smartFinanceCredit smartFinanceTransactionType = "credit"
)

type SmartFinanceApi struct {
	users  *services.UserService
	tokens *services.TokenService
}

var SmartFinance = &SmartFinanceApi{
	users:  services.Users,
	tokens: services.Tokens,
}

type smartFinanceRegisterRequest struct {
	Name     string `json:"name" binding:"omitempty,max=64,validNickname"`
	Email    string `json:"email" binding:"required,max=100,validEmail"`
	Password string `json:"password" binding:"required,min=6,max=128"`
}

type smartFinanceLoginRequest struct {
	Email    string `json:"email" binding:"required,max=100,validEmail"`
	Password string `json:"password" binding:"required,min=6,max=128"`
}

type smartFinanceTransactionRequest struct {
	Date        string `json:"date" binding:"required"`
	Description string `json:"description" binding:"required,max=255"`
	Merchant    string `json:"merchant" binding:"omitempty,max=96"`
	Amount      string `json:"amount" binding:"required"`
	Type        string `json:"type" binding:"required"`
	Category    string `json:"category"`
}

type smartFinanceTransactionListRequest struct {
	StartDate string `form:"startDate"`
	EndDate   string `form:"endDate"`
	Type      string `form:"type"`
	Category  string `form:"category"`
	Search    string `form:"search"`
}

type smartFinanceAnalyticsRequest struct {
	Period    string `form:"period"`
	StartDate string `form:"startDate"`
	EndDate   string `form:"endDate"`
}

type smartFinanceBudgetRequest struct {
	Category    string `json:"category" binding:"required,max=64"`
	LimitAmount string `json:"limitAmount" binding:"required"`
	Period      string `json:"period"`
}

type smartFinanceBudgetUpdateRequest struct {
	Category    string `json:"category" binding:"omitempty,max=64"`
	LimitAmount string `json:"limitAmount"`
	Period      string `json:"period"`
}

type smartFinanceGoalRequest struct {
	Name         string `json:"name" binding:"required,max=64"`
	TargetAmount string `json:"targetAmount" binding:"required"`
	TargetDate   string `json:"targetDate" binding:"required"`
}

type smartFinanceGoalUpdateRequest struct {
	Name         string `json:"name" binding:"omitempty,max=64"`
	TargetAmount string `json:"targetAmount"`
	TargetDate   string `json:"targetDate"`
}

type smartFinanceCategoryRuleRequest struct {
	MerchantPattern string `json:"merchantPattern" binding:"omitempty,max=128"`
	Merchant        string `json:"merchant" binding:"omitempty,max=128"`
	Category        string `json:"category" binding:"required,max=64"`
	Type            string `json:"type"`
}

type smartFinanceCategoryRuleUpdateRequest struct {
	MerchantPattern string `json:"merchantPattern" binding:"omitempty,max=128"`
	Merchant        string `json:"merchant" binding:"omitempty,max=128"`
	Category        string `json:"category" binding:"omitempty,max=64"`
	Type            string `json:"type"`
}

type smartFinancePlannedAddOnRequest struct {
	ExpectedDate string `json:"expectedDate" binding:"required"`
	Description  string `json:"description" binding:"required,max=255"`
	Merchant     string `json:"merchant" binding:"omitempty,max=96"`
	Amount       string `json:"amount" binding:"required"`
	Type         string `json:"type" binding:"required"`
	Category     string `json:"category" binding:"omitempty,max=64"`
	Note         string `json:"note" binding:"omitempty,max=255"`
}

type smartFinanceTransactionResponse struct {
	Id          string `json:"id"`
	Date        string `json:"date"`
	Description string `json:"description"`
	Merchant    string `json:"merchant"`
	Amount      string `json:"amount"`
	Type        string `json:"type"`
	Category    string `json:"category"`
	Source      string `json:"source"`
	CreatedAt   int64  `json:"createdAt"`
}

type smartFinanceBudgetResponse struct {
	Id          string `json:"id"`
	Category    string `json:"category"`
	LimitAmount string `json:"limitAmount"`
	Period      string `json:"period"`
	Spent       string `json:"spent"`
	Remaining   string `json:"remaining"`
	Progress    string `json:"progress"`
}

type smartFinanceGoalResponse struct {
	Id              string `json:"id"`
	Name            string `json:"name"`
	TargetAmount    string `json:"targetAmount"`
	TargetDate      string `json:"targetDate"`
	CurrentProgress string `json:"currentProgress"`
	Progress        string `json:"progress"`
}

type smartFinanceCategoryRuleResponse struct {
	Id              string `json:"id"`
	MerchantPattern string `json:"merchantPattern"`
	Category        string `json:"category"`
	Type            string `json:"type"`
	CreatedAt       int64  `json:"createdAt"`
	UpdatedAt       int64  `json:"updatedAt"`
}

type smartFinancePlannedAddOnResponse struct {
	Id           string `json:"id"`
	ExpectedDate string `json:"expectedDate"`
	Description  string `json:"description"`
	Merchant     string `json:"merchant"`
	Amount       string `json:"amount"`
	Type         string `json:"type"`
	Category     string `json:"category"`
	Note         string `json:"note"`
	Status       string `json:"status"`
	CreatedAt    int64  `json:"createdAt"`
}

type smartFinanceImportRowResult struct {
	Row     int    `json:"row"`
	Status  string `json:"status"`
	Reason  string `json:"reason,omitempty"`
	TraceId string `json:"traceId,omitempty"`
}

type smartFinanceImportSummary struct {
	RowsProcessed     int                            `json:"rowsProcessed"`
	RowsImported      int                            `json:"rowsImported"`
	RowsFailed        int                            `json:"rowsFailed"`
	DuplicatesSkipped int                            `json:"duplicatesSkipped"`
	Results           []*smartFinanceImportRowResult `json:"results"`
}

type smartFinanceCategoryRule struct {
	Name    string
	Pattern *regexp.Regexp
}

var smartFinanceCategoryRules = []smartFinanceCategoryRule{
	newSmartFinanceCategoryRule("Food", "zomato", "swiggy", "restaurant", "cafe", "food", "dining", "blinkit", "grofers"),
	newSmartFinanceCategoryRule("Transport", "uber", "ola", "metro", "fuel", "petrol", "diesel", "rapido", "taxi"),
	newSmartFinanceCategoryRule("Bills/Utilities", "electricity", "water", "broadband", "wifi", "mobile", "recharge", "utility", "gas"),
	newSmartFinanceCategoryRule("Shopping", "amazon", "flipkart", "myntra", "shopping", "store", "mall"),
	newSmartFinanceCategoryRule("Entertainment", "netflix", "spotify", "prime", "movie", "cinema", "hotstar", "entertainment"),
	newSmartFinanceCategoryRule("Health", "pharmacy", "medical", "doctor", "hospital", "health", "apollo"),
	newSmartFinanceCategoryRule("Rent", "rent", "landlord", "housing"),
	newSmartFinanceCategoryRule("Salary/Income", "salary", "payroll", "income", "interest", "bonus"),
	newSmartFinanceCategoryRule("Subscriptions", "subscription", "membership", "saas", "cloud"),
}

func newSmartFinanceCategoryRule(name string, keywords ...string) smartFinanceCategoryRule {
	parts := make([]string, len(keywords))
	for i, keyword := range keywords {
		parts[i] = regexp.QuoteMeta(keyword)
	}

	return smartFinanceCategoryRule{
		Name:    name,
		Pattern: regexp.MustCompile("(?i)(" + strings.Join(parts, "|") + ")"),
	}
}

func (a *SmartFinanceApi) RegisterHandler(c *core.WebContext) (any, *errs.Error) {
	var req smartFinanceRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.Name = strings.TrimSpace(req.Name)
	username := smartFinanceUsernameFromEmail(req.Email)
	nickname := strings.Split(req.Email, "@")[0]
	if req.Name != "" {
		nickname = req.Name
	}

	user := &models.User{
		Username:             username,
		Email:                req.Email,
		Nickname:             nickname,
		Password:             req.Password,
		Language:             "en",
		DefaultCurrency:      smartFinanceDefaultCurrency,
		FirstDayOfWeek:       1,
		FiscalYearStart:      core.FISCAL_YEAR_START_DEFAULT,
		TransactionEditScope: models.TRANSACTION_EDIT_SCOPE_ALL,
		EmailVerified:        true,
	}

	if err := a.users.CreateUser(c, user, false); err != nil {
		log.Warnf(c, "[smart_finance.RegisterHandler] failed to create user, because %s", err.Error())
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	if _, err := a.ensureDefaultAccount(c, user.Uid); err != nil {
		log.Warnf(c, "[smart_finance.RegisterHandler] failed to create default account, because %s", err.Error())
	}

	token, claims, err := a.tokens.CreateToken(c, user)
	if err != nil {
		return nil, errs.ErrTokenGenerating
	}

	c.SetTextualToken(token)
	c.SetTokenClaims(claims)
	c.SetTokenContext("")

	return core.O{
		"token": token,
		"user":  smartFinanceUserResponse(user),
	}, nil
}

func (a *SmartFinanceApi) LoginHandler(c *core.WebContext) (any, *errs.Error) {
	var req smartFinanceLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.ErrLoginNameOrPasswordWrong
	}

	user, _, err := a.users.GetUserByUsernameOrEmailAndPassword(c, strings.TrimSpace(strings.ToLower(req.Email)), req.Password)
	if err != nil {
		return nil, errs.ErrLoginNameOrPasswordWrong
	}

	token, claims, err := a.tokens.CreateToken(c, user)
	if err != nil {
		return nil, errs.ErrTokenGenerating
	}

	c.SetTextualToken(token)
	c.SetTokenClaims(claims)
	c.SetTokenContext("")

	return core.O{
		"token": token,
		"user":  smartFinanceUserResponse(user),
	}, nil
}

func (a *SmartFinanceApi) CurrentUserHandler(c *core.WebContext) (any, *errs.Error) {
	user, err := a.users.GetUserById(c, c.GetCurrentUid())
	if err != nil {
		return nil, errs.ErrUserNotFound
	}

	return smartFinanceUserResponse(user), nil
}

func (a *SmartFinanceApi) CreateTransactionHandler(c *core.WebContext) (any, *errs.Error) {
	var req smartFinanceTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	tx, err := a.buildTransactionFromRequest(c, c.GetCurrentUid(), &req, "manual")
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).Insert(tx); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.transactionResponse(c, tx), nil
}

func (a *SmartFinanceApi) ListTransactionsHandler(c *core.WebContext) (any, *errs.Error) {
	var req smartFinanceTransactionListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	transactions, err := a.findTransactions(c, c.GetCurrentUid(), req.StartDate, req.EndDate, req.Type, req.Category, req.Search)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	responses := make([]*smartFinanceTransactionResponse, len(transactions))
	for i, tx := range transactions {
		responses[i] = a.transactionResponse(c, tx)
	}

	return responses, nil
}

func (a *SmartFinanceApi) UpdateTransactionHandler(c *core.WebContext) (any, *errs.Error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return nil, errs.ErrTransactionIdInvalid
	}

	var req smartFinanceTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	tx, err := a.getTransaction(c, c.GetCurrentUid(), id)
	if err != nil {
		return nil, errs.ErrTransactionNotFound
	}

	updated, err := a.buildTransactionFromRequest(c, c.GetCurrentUid(), &req, smartFinanceSourceFromComment(tx.Comment))
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	tx.Type = updated.Type
	tx.CategoryId = updated.CategoryId
	tx.TransactionTime = updated.TransactionTime
	tx.Amount = updated.Amount
	tx.Comment = updated.Comment
	tx.UpdatedUnixTime = time.Now().Unix()

	_, err = datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).ID(tx.TransactionId).Cols("type", "category_id", "transaction_time", "amount", "comment", "updated_unix_time").Update(tx)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.transactionResponse(c, tx), nil
}

func (a *SmartFinanceApi) DeleteTransactionHandler(c *core.WebContext) (any, *errs.Error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return nil, errs.ErrTransactionIdInvalid
	}

	tx, err := a.getTransaction(c, c.GetCurrentUid(), id)
	if err != nil {
		return nil, errs.ErrTransactionNotFound
	}

	now := time.Now().Unix()
	tx.Deleted = true
	tx.DeletedUnixTime = now
	tx.UpdatedUnixTime = now

	_, err = datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).ID(tx.TransactionId).Cols("deleted", "deleted_unix_time", "updated_unix_time").Update(tx)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return core.O{"deleted": true}, nil
}

func (a *SmartFinanceApi) ImportTransactionsHandler(c *core.WebContext) (any, *errs.Error) {
	file, err := c.FormFile("file")
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	if file.Size > smartFinanceMaxCSVImportSize || strings.ToLower(filepath.Ext(file.Filename)) != ".csv" {
		return nil, errs.ErrParameterInvalid
	}

	opened, err := file.Open()
	if err != nil {
		return nil, errs.ErrOperationFailed
	}
	defer opened.Close()

	reader := csv.NewReader(opened)
	reader.TrimLeadingSpace = true
	reader.FieldsPerRecord = -1
	rows, err := reader.ReadAll()
	if err != nil || len(rows) == 0 {
		return &smartFinanceImportSummary{
			RowsFailed: 1,
			Results: []*smartFinanceImportRowResult{
				{Row: 1, Status: "failed", Reason: "CSV could not be parsed. Check quotes, commas, and line breaks."},
			},
		}, nil
	}

	summary := &smartFinanceImportSummary{Results: make([]*smartFinanceImportRowResult, 0)}
	header := smartFinanceCSVHeaderMap(rows[0])
	if !smartFinanceCSVHasAny(header, "date", "transactiondate", "transaction_date", "txn_date") ||
		!smartFinanceCSVHasAny(header, "description", "details", "narration", "particulars", "merchant", "payee") ||
		!smartFinanceCSVHasAny(header, "amount", "debit", "withdrawal", "credit", "deposit") {
		return &smartFinanceImportSummary{
			RowsFailed: 1,
			Results: []*smartFinanceImportRowResult{
				{Row: 1, Status: "failed", Reason: "CSV needs date, description, and amount columns. Type is optional and defaults to debit."},
			},
		}, nil
	}

	seen := map[string]bool{}
	existing, _ := a.findTransactions(c, c.GetCurrentUid(), "", "", "", "", "")
	for _, tx := range existing {
		seen[smartFinanceDuplicateKey(a.transactionResponse(c, tx))] = true
	}

	accountId, err := a.ensureDefaultAccount(c, c.GetCurrentUid())
	if err != nil || accountId <= 0 {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	for i, row := range rows[1:] {
		rowNumber := i + 2
		summary.RowsProcessed++

		req := &smartFinanceTransactionRequest{
			Date:        smartFinanceCSVValueAny(row, header, "date", "transactiondate", "transaction_date", "txn_date"),
			Description: smartFinanceCSVValueAny(row, header, "description", "details", "narration", "particulars"),
			Merchant:    smartFinanceCSVValueAny(row, header, "merchant", "payee", "vendor"),
			Amount:      smartFinanceCSVImportAmount(row, header),
			Type:        smartFinanceCSVImportType(row, header),
		}
		if req.Description == "" {
			req.Description = req.Merchant
		}
		if req.Merchant == "" {
			req.Merchant = smartFinanceMerchantFromDescription(req.Description)
		}

		tx, buildErr := a.buildTransactionFromRequest(c, c.GetCurrentUid(), req, "csv")
		if buildErr != nil {
			summary.RowsFailed++
			summary.Results = append(summary.Results, &smartFinanceImportRowResult{Row: rowNumber, Status: "failed", Reason: buildErr.Error()})
			continue
		}
		tx.AccountId = accountId

		key := smartFinanceDuplicateKey(a.transactionResponse(c, tx))
		if seen[key] {
			summary.DuplicatesSkipped++
			summary.Results = append(summary.Results, &smartFinanceImportRowResult{Row: rowNumber, Status: "duplicate"})
			continue
		}
		seen[key] = true

		_, insertErr := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).Insert(tx)
		if insertErr != nil {
			summary.RowsFailed++
			summary.Results = append(summary.Results, &smartFinanceImportRowResult{Row: rowNumber, Status: "failed", Reason: insertErr.Error()})
			continue
		}

		summary.RowsImported++
		summary.Results = append(summary.Results, &smartFinanceImportRowResult{Row: rowNumber, Status: "imported", TraceId: utils.Int64ToString(tx.TransactionId)})
	}

	return summary, nil
}

func (a *SmartFinanceApi) AnalyticsSummaryHandler(c *core.WebContext) (any, *errs.Error) {
	req, transactions, err := a.analyticsTransactions(c)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	totalIncome, totalExpenses := smartFinanceIncomeExpense(transactions)
	breakdown := smartFinanceCategoryBreakdown(c, transactions, totalExpenses)
	trends := smartFinanceMonthlyTrends(transactions)

	return core.O{
		"period":        smartFinancePeriodResponse(req),
		"totalIncome":   smartFinanceAmountToString(totalIncome),
		"totalExpenses": smartFinanceAmountToString(totalExpenses),
		"netSavings":    smartFinanceAmountToString(totalIncome - totalExpenses),
		"breakdown":     breakdown,
		"trends":        trends,
	}, nil
}

func (a *SmartFinanceApi) RecurringTransactionsHandler(c *core.WebContext) (any, *errs.Error) {
	_, transactions, err := a.analyticsTransactions(c)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	groups := map[string][]*models.Transaction{}
	for _, tx := range transactions {
		resp := a.transactionResponse(c, tx)
		key := strings.ToLower(resp.Description) + "|" + resp.Type + "|" + resp.Category
		groups[key] = append(groups[key], tx)
	}

	result := make([]core.O, 0)
	for key, items := range groups {
		if len(items) < 2 {
			continue
		}

		sort.Slice(items, func(i, j int) bool { return items[i].TransactionTime < items[j].TransactionTime })
		parts := strings.Split(key, "|")
		result = append(result, core.O{
			"description": parts[0],
			"type":        parts[1],
			"category":    parts[2],
			"count":       len(items),
			"firstDate":   smartFinanceDateFromUnix(items[0].TransactionTime),
			"lastDate":    smartFinanceDateFromUnix(items[len(items)-1].TransactionTime),
			"amount":      smartFinanceAmountToString(absInt64(items[len(items)-1].Amount)),
		})
	}

	return result, nil
}

func (a *SmartFinanceApi) AnomaliesHandler(c *core.WebContext) (any, *errs.Error) {
	_, transactions, err := a.analyticsTransactions(c)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	byCategory := map[string][]int64{}
	for _, tx := range transactions {
		if tx.Type != models.TRANSACTION_DB_TYPE_EXPENSE {
			continue
		}
		category := a.categoryName(c, c.GetCurrentUid(), tx.CategoryId)
		byCategory[category] = append(byCategory[category], absInt64(tx.Amount))
	}

	result := make([]core.O, 0)
	for category, amounts := range byCategory {
		if len(amounts) < 2 {
			continue
		}
		var total int64
		for _, amount := range amounts {
			total += amount
		}
		average := float64(total) / float64(len(amounts))
		for _, amount := range amounts {
			if float64(amount) > average*1.5 {
				result = append(result, core.O{
					"category": category,
					"amount":   smartFinanceAmountToString(amount),
					"average":  smartFinanceFloatAmountToString(average),
					"reason":   "above 1.5x category average",
				})
			}
		}
	}

	return result, nil
}

func (a *SmartFinanceApi) HealthScoreHandler(c *core.WebContext) (any, *errs.Error) {
	_, transactions, err := a.analyticsTransactions(c)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	totalIncome, totalExpenses := smartFinanceIncomeExpense(transactions)
	netSavings := totalIncome - totalExpenses
	savingsRate := 0.0
	if totalIncome > 0 {
		savingsRate = float64(netSavings) / float64(totalIncome)
	}

	budgetScore, _ := a.budgetAdherenceScore(c, c.GetCurrentUid())
	volatilityScore := smartFinanceVolatilityScore(transactions)
	score := int(math.Round(clampFloat(savingsRate*100, 0, 40) + budgetScore*0.35 + volatilityScore*0.25))
	if score < 0 {
		score = 0
	} else if score > 100 {
		score = 100
	}

	insights := []string{
		fmt.Sprintf("Savings rate is %s%% for the selected period.", smartFinanceFloatToString(savingsRate*100)),
		fmt.Sprintf("Net savings are %s from actual income and expenses.", smartFinanceAmountToString(netSavings)),
		fmt.Sprintf("Budget adherence contributes %s points to the score.", smartFinanceFloatToString(budgetScore*0.35)),
	}

	return core.O{
		"score": score,
		"signals": core.O{
			"savingsRate":     smartFinanceFloatToString(savingsRate * 100),
			"budgetAdherence": smartFinanceFloatToString(budgetScore),
			"volatilityScore": smartFinanceFloatToString(volatilityScore),
		},
		"insights": insights,
	}, nil
}

func (a *SmartFinanceApi) RecommendationsHandler(c *core.WebContext) (any, *errs.Error) {
	_, transactions, err := a.analyticsTransactions(c)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	totalIncome, totalExpenses := smartFinanceIncomeExpense(transactions)
	recommendations := make([]core.O, 0)
	if totalIncome > 0 && float64(totalExpenses)/float64(totalIncome) > 0.8 {
		reduceBy := totalExpenses - int64(float64(totalIncome)*0.8)
		recommendations = append(recommendations, core.O{
			"title":  "Reduce discretionary spend",
			"action": fmt.Sprintf("Reduce expenses by %s to keep spending below 80%% of income.", smartFinanceAmountToString(reduceBy)),
		})
	}

	breakdown := smartFinanceCategoryBreakdown(c, transactions, totalExpenses)
	if len(breakdown) > 0 {
		top := breakdown[0]
		recommendations = append(recommendations, core.O{
			"title":  "Review top category",
			"action": fmt.Sprintf("%s is your largest spend category at %s%% of expenses.", top["category"], top["percentage"]),
		})
	}

	if len(recommendations) == 0 {
		recommendations = append(recommendations, core.O{
			"title":  "Maintain current savings pattern",
			"action": fmt.Sprintf("You saved %s in this period based on stored transactions.", smartFinanceAmountToString(totalIncome-totalExpenses)),
		})
	}

	return recommendations, nil
}

func (a *SmartFinanceApi) CreateBudgetHandler(c *core.WebContext) (any, *errs.Error) {
	var req smartFinanceBudgetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	limit, err := smartFinanceParseAmount(req.LimitAmount)
	if err != nil || limit <= 0 {
		return nil, errs.ErrParameterInvalid
	}

	period := strings.TrimSpace(strings.ToLower(req.Period))
	if period == "" {
		period = "monthly"
	}
	period = smartFinanceNormalizeBudgetPeriod(period)

	categoryId, err := a.ensureCategory(c, c.GetCurrentUid(), strings.TrimSpace(req.Category), smartFinanceDebit)
	if err != nil {
		categoryId = 0
	}

	now := time.Now().Unix()
	budget := &models.Budget{
		Uid:             c.GetCurrentUid(),
		CategoryId:      categoryId,
		CategoryName:    strings.TrimSpace(req.Category),
		LimitAmount:     limit,
		Period:          period,
		CreatedUnixTime: now,
		UpdatedUnixTime: now,
	}

	_, err = datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).Insert(budget)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.budgetResponse(c, budget), nil
}

func (a *SmartFinanceApi) ListBudgetsHandler(c *core.WebContext) (any, *errs.Error) {
	budgets := make([]*models.Budget, 0)
	err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).Where("uid=? AND deleted=?", c.GetCurrentUid(), false).Find(&budgets)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	responses := make([]*smartFinanceBudgetResponse, len(budgets))
	for i, budget := range budgets {
		responses[i] = a.budgetResponse(c, budget)
	}

	return responses, nil
}

func (a *SmartFinanceApi) UpdateBudgetHandler(c *core.WebContext) (any, *errs.Error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return nil, errs.ErrParameterInvalid
	}

	var req smartFinanceBudgetUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	budget, err := a.getBudget(c, c.GetCurrentUid(), id)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	cols := []string{"updated_unix_time"}
	if strings.TrimSpace(req.Category) != "" {
		category := strings.TrimSpace(req.Category)
		categoryId, err := a.ensureCategory(c, c.GetCurrentUid(), category, smartFinanceDebit)
		if err != nil {
			return nil, errs.Or(err, errs.ErrOperationFailed)
		}
		budget.CategoryId = categoryId
		budget.CategoryName = category
		cols = append(cols, "category_id", "category_name")
	}

	if strings.TrimSpace(req.LimitAmount) != "" {
		limit, err := smartFinanceParseAmount(req.LimitAmount)
		if err != nil || limit <= 0 {
			return nil, errs.ErrParameterInvalid
		}
		budget.LimitAmount = limit
		cols = append(cols, "limit_amount")
	}

	if strings.TrimSpace(req.Period) != "" {
		budget.Period = smartFinanceNormalizeBudgetPeriod(req.Period)
		cols = append(cols, "period")
	}

	budget.UpdatedUnixTime = time.Now().Unix()
	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).ID(budget.BudgetId).Cols(cols...).Update(budget); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.budgetResponse(c, budget), nil
}

func (a *SmartFinanceApi) DeleteBudgetHandler(c *core.WebContext) (any, *errs.Error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return nil, errs.ErrParameterInvalid
	}

	budget, err := a.getBudget(c, c.GetCurrentUid(), id)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	now := time.Now().Unix()
	budget.Deleted = true
	budget.DeletedUnixTime = now
	budget.UpdatedUnixTime = now
	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).ID(budget.BudgetId).Cols("deleted", "deleted_unix_time", "updated_unix_time").Update(budget); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return core.O{"deleted": true}, nil
}

func (a *SmartFinanceApi) CreateGoalHandler(c *core.WebContext) (any, *errs.Error) {
	var req smartFinanceGoalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	target, err := smartFinanceParseAmount(req.TargetAmount)
	if err != nil || target <= 0 {
		return nil, errs.ErrParameterInvalid
	}

	targetDate, err := smartFinanceParseDate(req.TargetDate)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	now := time.Now().Unix()
	goal := &models.SavingsGoal{
		Uid:             c.GetCurrentUid(),
		Name:            strings.TrimSpace(req.Name),
		TargetAmount:    target,
		TargetDate:      targetDate.Format("2006-01-02"),
		CreatedUnixTime: now,
		UpdatedUnixTime: now,
	}

	_, err = datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).Insert(goal)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.goalResponse(c, goal), nil
}

func (a *SmartFinanceApi) ListGoalsHandler(c *core.WebContext) (any, *errs.Error) {
	goals := make([]*models.SavingsGoal, 0)
	err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).Where("uid=? AND deleted=?", c.GetCurrentUid(), false).Find(&goals)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	responses := make([]*smartFinanceGoalResponse, len(goals))
	for i, goal := range goals {
		responses[i] = a.goalResponse(c, goal)
	}

	return responses, nil
}

func (a *SmartFinanceApi) UpdateGoalHandler(c *core.WebContext) (any, *errs.Error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return nil, errs.ErrParameterInvalid
	}

	var req smartFinanceGoalUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	goal, err := a.getGoal(c, c.GetCurrentUid(), id)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	cols := []string{"updated_unix_time"}
	if strings.TrimSpace(req.Name) != "" {
		goal.Name = strings.TrimSpace(req.Name)
		cols = append(cols, "name")
	}

	if strings.TrimSpace(req.TargetAmount) != "" {
		target, err := smartFinanceParseAmount(req.TargetAmount)
		if err != nil || target <= 0 {
			return nil, errs.ErrParameterInvalid
		}
		goal.TargetAmount = target
		cols = append(cols, "target_amount")
	}

	if strings.TrimSpace(req.TargetDate) != "" {
		targetDate, err := smartFinanceParseDate(req.TargetDate)
		if err != nil {
			return nil, errs.ErrParameterInvalid
		}
		goal.TargetDate = targetDate.Format("2006-01-02")
		cols = append(cols, "target_date")
	}

	goal.UpdatedUnixTime = time.Now().Unix()
	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).ID(goal.GoalId).Cols(cols...).Update(goal); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.goalResponse(c, goal), nil
}

func (a *SmartFinanceApi) DeleteGoalHandler(c *core.WebContext) (any, *errs.Error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return nil, errs.ErrParameterInvalid
	}

	goal, err := a.getGoal(c, c.GetCurrentUid(), id)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	now := time.Now().Unix()
	goal.Deleted = true
	goal.DeletedUnixTime = now
	goal.UpdatedUnixTime = now
	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).ID(goal.GoalId).Cols("deleted", "deleted_unix_time", "updated_unix_time").Update(goal); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return core.O{"deleted": true}, nil
}

func (a *SmartFinanceApi) ListCategoryRulesHandler(c *core.WebContext) (any, *errs.Error) {
	rules := make([]*models.CategoryRule, 0)
	err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).
		Where("uid=? AND deleted=?", c.GetCurrentUid(), false).
		Asc("merchant_pattern").
		Find(&rules)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	responses := make([]*smartFinanceCategoryRuleResponse, len(rules))
	for i, rule := range rules {
		responses[i] = a.categoryRuleResponse(rule)
	}

	return responses, nil
}

func (a *SmartFinanceApi) CreateCategoryRuleHandler(c *core.WebContext) (any, *errs.Error) {
	var req smartFinanceCategoryRuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	rule, err := a.buildCategoryRuleFromRequest(c, c.GetCurrentUid(), &req)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).Insert(rule); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.categoryRuleResponse(rule), nil
}

func (a *SmartFinanceApi) UpdateCategoryRuleHandler(c *core.WebContext) (any, *errs.Error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return nil, errs.ErrParameterInvalid
	}

	var req smartFinanceCategoryRuleUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	rule, err := a.getCategoryRule(c, c.GetCurrentUid(), id)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	cols := []string{"updated_unix_time"}
	if pattern := smartFinanceRulePatternFromFields(req.MerchantPattern, req.Merchant); pattern != "" {
		rule.MerchantPattern = pattern
		cols = append(cols, "merchant_pattern")
	}

	txType := smartFinanceTransactionType(rule.TransactionType)
	typeChanged := false
	if strings.TrimSpace(req.Type) != "" {
		parsedType, err := smartFinanceParseTransactionType(req.Type)
		if err != nil {
			return nil, errs.ErrParameterInvalid
		}
		typeChanged = string(parsedType) != rule.TransactionType
		txType = parsedType
		rule.TransactionType = string(parsedType)
		cols = append(cols, "transaction_type")
	}

	if strings.TrimSpace(req.Category) != "" {
		category := strings.TrimSpace(req.Category)
		categoryId, err := a.ensureCategory(c, c.GetCurrentUid(), category, txType)
		if err != nil {
			return nil, errs.Or(err, errs.ErrOperationFailed)
		}
		rule.CategoryId = categoryId
		rule.CategoryName = category
		cols = append(cols, "category_id", "category_name")
	} else if typeChanged {
		categoryId, err := a.ensureCategory(c, c.GetCurrentUid(), rule.CategoryName, txType)
		if err != nil {
			return nil, errs.Or(err, errs.ErrOperationFailed)
		}
		rule.CategoryId = categoryId
		cols = append(cols, "category_id")
	}

	rule.UpdatedUnixTime = time.Now().Unix()
	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).ID(rule.RuleId).Cols(cols...).Update(rule); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.categoryRuleResponse(rule), nil
}

func (a *SmartFinanceApi) DeleteCategoryRuleHandler(c *core.WebContext) (any, *errs.Error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return nil, errs.ErrParameterInvalid
	}

	rule, err := a.getCategoryRule(c, c.GetCurrentUid(), id)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	now := time.Now().Unix()
	rule.Deleted = true
	rule.DeletedUnixTime = now
	rule.UpdatedUnixTime = now
	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).ID(rule.RuleId).Cols("deleted", "deleted_unix_time", "updated_unix_time").Update(rule); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return core.O{"deleted": true}, nil
}

func (a *SmartFinanceApi) CreatePlannedAddOnHandler(c *core.WebContext) (any, *errs.Error) {
	var req smartFinancePlannedAddOnRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errs.NewIncompleteOrIncorrectSubmissionError(err)
	}

	addOn, err := a.buildPlannedAddOnFromRequest(c.GetCurrentUid(), &req)
	if err != nil {
		return nil, errs.ErrParameterInvalid
	}

	if _, err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).Insert(addOn); err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	return a.plannedAddOnResponse(addOn), nil
}

func (a *SmartFinanceApi) ListPlannedAddOnsHandler(c *core.WebContext) (any, *errs.Error) {
	addOns := make([]*models.PlannedAddOn, 0)
	err := datastore.Container.UserDataStore.Query(c, c.GetCurrentUid()).
		Where("uid=? AND deleted=?", c.GetCurrentUid(), false).
		Asc("expected_date").
		Desc("created_unix_time").
		Find(&addOns)
	if err != nil {
		return nil, errs.Or(err, errs.ErrOperationFailed)
	}

	responses := make([]*smartFinancePlannedAddOnResponse, len(addOns))
	for i, addOn := range addOns {
		responses[i] = a.plannedAddOnResponse(addOn)
	}

	return responses, nil
}

func (a *SmartFinanceApi) buildCategoryRuleFromRequest(c *core.WebContext, uid int64, req *smartFinanceCategoryRuleRequest) (*models.CategoryRule, error) {
	pattern := smartFinanceRulePatternFromFields(req.MerchantPattern, req.Merchant)
	if pattern == "" {
		return nil, fmt.Errorf("merchant pattern is required")
	}

	category := strings.TrimSpace(req.Category)
	if category == "" {
		return nil, fmt.Errorf("category is required")
	}

	txType, err := smartFinanceParseTransactionType(req.Type)
	if err != nil {
		return nil, err
	}

	categoryId, err := a.ensureCategory(c, uid, category, txType)
	if err != nil {
		return nil, err
	}

	now := time.Now().Unix()
	return &models.CategoryRule{
		Uid:             uid,
		MerchantPattern: pattern,
		CategoryId:      categoryId,
		CategoryName:    category,
		TransactionType: string(txType),
		CreatedUnixTime: now,
		UpdatedUnixTime: now,
	}, nil
}

func (a *SmartFinanceApi) buildPlannedAddOnFromRequest(uid int64, req *smartFinancePlannedAddOnRequest) (*models.PlannedAddOn, error) {
	expectedDate, err := smartFinanceParseDate(req.ExpectedDate)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	if expectedDate.Before(today) {
		return nil, fmt.Errorf("expected date cannot be in the past")
	}

	amount, err := smartFinanceParseAmount(req.Amount)
	if err != nil || amount <= 0 {
		return nil, fmt.Errorf("amount must be greater than zero")
	}

	txType, err := smartFinanceParseTransactionType(req.Type)
	if err != nil {
		return nil, err
	}

	description := strings.TrimSpace(req.Description)
	if description == "" {
		return nil, fmt.Errorf("description is required")
	}

	merchant := strings.TrimSpace(req.Merchant)
	category := strings.TrimSpace(req.Category)
	if category == "" {
		category = smartFinanceCategorize(strings.Join([]string{description, merchant}, " "), txType)
	}

	return &models.PlannedAddOn{
		Uid:             uid,
		ExpectedDate:    expectedDate.Format("2006-01-02"),
		Description:     description,
		Merchant:        merchant,
		Amount:          amount,
		Type:            string(txType),
		CategoryName:    category,
		Note:            strings.TrimSpace(req.Note),
		Status:          "planned",
		CreatedUnixTime: now.Unix(),
		UpdatedUnixTime: now.Unix(),
	}, nil
}

func (a *SmartFinanceApi) buildTransactionFromRequest(c *core.WebContext, uid int64, req *smartFinanceTransactionRequest, source string) (*models.Transaction, error) {
	transactionDate, err := smartFinanceParseDate(req.Date)
	if err != nil {
		return nil, err
	}

	amount, err := smartFinanceParseAmount(req.Amount)
	if err != nil || amount <= 0 {
		return nil, fmt.Errorf("amount must be greater than zero")
	}

	txType, err := smartFinanceParseTransactionType(req.Type)
	if err != nil {
		return nil, err
	}

	description := strings.TrimSpace(req.Description)
	if description == "" {
		return nil, fmt.Errorf("description is required")
	}

	merchant := strings.TrimSpace(req.Merchant)
	if merchant == "" {
		merchant = smartFinanceMerchantFromDescription(description)
	}

	category := strings.TrimSpace(req.Category)
	if category == "" {
		category = a.categorize(c, uid, strings.TrimSpace(merchant+" "+description), txType)
	}

	categoryId, err := a.ensureCategory(c, uid, category, txType)
	if err != nil {
		return nil, err
	}

	accountId, err := a.ensureDefaultAccount(c, uid)
	if err != nil {
		return nil, err
	}

	dbType := models.TRANSACTION_DB_TYPE_EXPENSE
	storedAmount := -amount
	if txType == smartFinanceCredit {
		dbType = models.TRANSACTION_DB_TYPE_INCOME
		storedAmount = amount
	}

	now := time.Now().Unix()
	return &models.Transaction{
		TransactionId:     uuid.Container.GenerateUuid(uuid.UUID_TYPE_TRANSACTION),
		Uid:               uid,
		Type:              dbType,
		CategoryId:        categoryId,
		AccountId:         accountId,
		TransactionTime:   transactionDate.Unix(),
		TimezoneUtcOffset: 330,
		Amount:            storedAmount,
		Comment:           smartFinanceComment(description, merchant, source),
		CreatedIp:         c.ClientIP(),
		CreatedUnixTime:   now,
		UpdatedUnixTime:   now,
	}, nil
}

func (a *SmartFinanceApi) ensureDefaultAccount(c *core.WebContext, uid int64) (int64, error) {
	account := &models.Account{}
	has, err := datastore.Container.UserDataStore.Query(c, uid).Where("uid=? AND deleted=? AND name=?", uid, false, smartFinanceDefaultAccountName).Get(account)
	if err != nil {
		return 0, err
	}
	if has {
		return account.AccountId, nil
	}

	now := time.Now().Unix()
	account = &models.Account{
		AccountId:       uuid.Container.GenerateUuid(uuid.UUID_TYPE_ACCOUNT),
		Uid:             uid,
		Category:        models.ACCOUNT_CATEGORY_CASH,
		Type:            models.ACCOUNT_TYPE_SINGLE_ACCOUNT,
		ParentAccountId: models.LevelOneAccountParentId,
		Name:            smartFinanceDefaultAccountName,
		Icon:            1,
		Color:           "4A90E2",
		Currency:        smartFinanceDefaultCurrency,
		CreatedUnixTime: now,
		UpdatedUnixTime: now,
	}

	_, err = datastore.Container.UserDataStore.Query(c, uid).Insert(account)
	return account.AccountId, err
}

func (a *SmartFinanceApi) ensureCategory(c *core.WebContext, uid int64, name string, txType smartFinanceTransactionType) (int64, error) {
	if name == "" {
		name = "Other"
	}

	categoryType := models.CATEGORY_TYPE_EXPENSE
	if txType == smartFinanceCredit {
		categoryType = models.CATEGORY_TYPE_INCOME
	}

	category := &models.TransactionCategory{}
	has, err := datastore.Container.UserDataStore.Query(c, uid).Where("uid=? AND deleted=? AND type=? AND name=?", uid, false, categoryType, name).Get(category)
	if err != nil {
		return 0, err
	}
	if has {
		return category.CategoryId, nil
	}

	now := time.Now().Unix()
	category = &models.TransactionCategory{
		CategoryId:       uuid.Container.GenerateUuid(uuid.UUID_TYPE_CATEGORY),
		Uid:              uid,
		Type:             categoryType,
		ParentCategoryId: models.LevelOneTransactionCategoryParentId,
		Name:             name,
		Icon:             1,
		Color:            smartFinanceCategoryColor(name),
		CreatedUnixTime:  now,
		UpdatedUnixTime:  now,
	}

	_, err = datastore.Container.UserDataStore.Query(c, uid).Insert(category)
	return category.CategoryId, err
}

func (a *SmartFinanceApi) getTransaction(c *core.WebContext, uid int64, id int64) (*models.Transaction, error) {
	tx := &models.Transaction{}
	has, err := datastore.Container.UserDataStore.Query(c, uid).Where("uid=? AND deleted=?", uid, false).ID(id).Get(tx)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, errs.ErrTransactionNotFound
	}
	return tx, nil
}

func (a *SmartFinanceApi) getBudget(c *core.WebContext, uid int64, id int64) (*models.Budget, error) {
	budget := &models.Budget{}
	has, err := datastore.Container.UserDataStore.Query(c, uid).Where("uid=? AND deleted=?", uid, false).ID(id).Get(budget)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, errs.ErrParameterInvalid
	}
	return budget, nil
}

func (a *SmartFinanceApi) getGoal(c *core.WebContext, uid int64, id int64) (*models.SavingsGoal, error) {
	goal := &models.SavingsGoal{}
	has, err := datastore.Container.UserDataStore.Query(c, uid).Where("uid=? AND deleted=?", uid, false).ID(id).Get(goal)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, errs.ErrParameterInvalid
	}
	return goal, nil
}

func (a *SmartFinanceApi) getCategoryRule(c *core.WebContext, uid int64, id int64) (*models.CategoryRule, error) {
	rule := &models.CategoryRule{}
	has, err := datastore.Container.UserDataStore.Query(c, uid).Where("uid=? AND deleted=?", uid, false).ID(id).Get(rule)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, errs.ErrParameterInvalid
	}
	return rule, nil
}

func (a *SmartFinanceApi) findTransactions(c *core.WebContext, uid int64, startDate string, endDate string, txType string, category string, search string) ([]*models.Transaction, error) {
	session := datastore.Container.UserDataStore.Query(c, uid).Where("uid=? AND deleted=?", uid, false)

	if startDate != "" {
		t, err := smartFinanceParseDate(startDate)
		if err != nil {
			return nil, err
		}
		session.And("transaction_time>=?", t.Unix())
	}

	if endDate != "" {
		t, err := smartFinanceParseDate(endDate)
		if err != nil {
			return nil, err
		}
		session.And("transaction_time<?", t.Add(24*time.Hour).Unix())
	}

	if txType != "" {
		parsedType, err := smartFinanceParseTransactionType(txType)
		if err != nil {
			return nil, err
		}
		if parsedType == smartFinanceCredit {
			session.And("type=?", models.TRANSACTION_DB_TYPE_INCOME)
		} else {
			session.And("type=?", models.TRANSACTION_DB_TYPE_EXPENSE)
		}
	}

	transactions := make([]*models.Transaction, 0)
	if err := session.Desc("transaction_time").Find(&transactions); err != nil {
		return nil, err
	}

	filtered := make([]*models.Transaction, 0, len(transactions))
	for _, tx := range transactions {
		resp := a.transactionResponse(c, tx)
		if category != "" && !strings.EqualFold(resp.Category, category) {
			continue
		}
		if search != "" && !strings.Contains(strings.ToLower(resp.Description), strings.ToLower(search)) {
			continue
		}
		filtered = append(filtered, tx)
	}

	return filtered, nil
}

func (a *SmartFinanceApi) analyticsTransactions(c *core.WebContext) (*smartFinanceAnalyticsRequest, []*models.Transaction, error) {
	var req smartFinanceAnalyticsRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		return nil, nil, err
	}

	startDate, endDate := req.StartDate, req.EndDate
	if req.Period != "" && startDate == "" && endDate == "" {
		startDate, endDate = smartFinancePeriodToRange(req.Period)
	}

	transactions, err := a.findTransactions(c, c.GetCurrentUid(), startDate, endDate, "", "", "")
	if err != nil {
		return nil, nil, err
	}

	req.StartDate = startDate
	req.EndDate = endDate
	return &req, transactions, nil
}

func (a *SmartFinanceApi) transactionResponse(c *core.WebContext, tx *models.Transaction) *smartFinanceTransactionResponse {
	txType := "debit"
	if tx.Type == models.TRANSACTION_DB_TYPE_INCOME {
		txType = "credit"
	}

	return &smartFinanceTransactionResponse{
		Id:          utils.Int64ToString(tx.TransactionId),
		Date:        smartFinanceDateFromUnix(tx.TransactionTime),
		Description: smartFinanceDescriptionFromComment(tx.Comment),
		Merchant:    smartFinanceMerchantFromComment(tx.Comment),
		Amount:      smartFinanceAmountToString(absInt64(tx.Amount)),
		Type:        txType,
		Category:    a.categoryName(c, tx.Uid, tx.CategoryId),
		Source:      smartFinanceSourceFromComment(tx.Comment),
		CreatedAt:   tx.CreatedUnixTime,
	}
}

func (a *SmartFinanceApi) categoryName(c *core.WebContext, uid int64, categoryId int64) string {
	if categoryId <= 0 {
		return "Other"
	}

	category := &models.TransactionCategory{}
	has, err := datastore.Container.UserDataStore.Query(c, uid).ID(categoryId).Get(category)
	if err != nil || !has {
		return "Other"
	}

	return category.Name
}

func (a *SmartFinanceApi) budgetResponse(c *core.WebContext, budget *models.Budget) *smartFinanceBudgetResponse {
	startDate, endDate := smartFinanceBudgetPeriodToRange(budget.Period)
	transactions, _ := a.findTransactions(c, budget.Uid, startDate, endDate, "debit", budget.CategoryName, "")
	var spent int64
	for _, tx := range transactions {
		spent += absInt64(tx.Amount)
	}

	remaining := budget.LimitAmount - spent
	progress := 0.0
	if budget.LimitAmount > 0 {
		progress = float64(spent) * 100 / float64(budget.LimitAmount)
	}

	return &smartFinanceBudgetResponse{
		Id:          utils.Int64ToString(budget.BudgetId),
		Category:    budget.CategoryName,
		LimitAmount: smartFinanceAmountToString(budget.LimitAmount),
		Period:      budget.Period,
		Spent:       smartFinanceAmountToString(spent),
		Remaining:   smartFinanceAmountToString(remaining),
		Progress:    smartFinanceFloatToString(progress),
	}
}

func (a *SmartFinanceApi) goalResponse(c *core.WebContext, goal *models.SavingsGoal) *smartFinanceGoalResponse {
	startDate := ""
	if goal.CreatedUnixTime > 0 {
		startDate = smartFinanceDateFromUnix(goal.CreatedUnixTime)
	}
	endDate := time.Now().Format("2006-01-02")
	transactions, _ := a.findTransactions(c, goal.Uid, startDate, endDate, "", "", "")
	income, expenses := smartFinanceIncomeExpense(transactions)
	progressAmount := income - expenses
	progress := 0.0
	if goal.TargetAmount > 0 {
		progress = float64(progressAmount) * 100 / float64(goal.TargetAmount)
	}

	return &smartFinanceGoalResponse{
		Id:              utils.Int64ToString(goal.GoalId),
		Name:            goal.Name,
		TargetAmount:    smartFinanceAmountToString(goal.TargetAmount),
		TargetDate:      goal.TargetDate,
		CurrentProgress: smartFinanceAmountToString(progressAmount),
		Progress:        smartFinanceFloatToString(progress),
	}
}

func (a *SmartFinanceApi) categoryRuleResponse(rule *models.CategoryRule) *smartFinanceCategoryRuleResponse {
	return &smartFinanceCategoryRuleResponse{
		Id:              utils.Int64ToString(rule.RuleId),
		MerchantPattern: rule.MerchantPattern,
		Category:        rule.CategoryName,
		Type:            rule.TransactionType,
		CreatedAt:       rule.CreatedUnixTime,
		UpdatedAt:       rule.UpdatedUnixTime,
	}
}

func (a *SmartFinanceApi) plannedAddOnResponse(addOn *models.PlannedAddOn) *smartFinancePlannedAddOnResponse {
	return &smartFinancePlannedAddOnResponse{
		Id:           utils.Int64ToString(addOn.PlannedAddOnId),
		ExpectedDate: addOn.ExpectedDate,
		Description:  addOn.Description,
		Merchant:     addOn.Merchant,
		Amount:       smartFinanceAmountToString(addOn.Amount),
		Type:         addOn.Type,
		Category:     addOn.CategoryName,
		Note:         addOn.Note,
		Status:       addOn.Status,
		CreatedAt:    addOn.CreatedUnixTime,
	}
}

func (a *SmartFinanceApi) budgetAdherenceScore(c *core.WebContext, uid int64) (float64, error) {
	budgets := make([]*models.Budget, 0)
	if err := datastore.Container.UserDataStore.Query(c, uid).Where("uid=? AND deleted=?", uid, false).Find(&budgets); err != nil {
		return 0, err
	}
	if len(budgets) == 0 {
		return 70, nil
	}

	var total float64
	for _, budget := range budgets {
		resp := a.budgetResponse(c, budget)
		progress, _ := strconv.ParseFloat(resp.Progress, 64)
		if progress <= 100 {
			total += 100
		} else {
			total += math.Max(0, 100-(progress-100))
		}
	}
	return total / float64(len(budgets)), nil
}

func smartFinanceUserResponse(user *models.User) core.O {
	return core.O{
		"id":    utils.Int64ToString(user.Uid),
		"email": user.Email,
	}
}

func smartFinanceUsernameFromEmail(email string) string {
	base := strings.Split(email, "@")[0]
	base = regexp.MustCompile("[^A-Za-z0-9_-]+").ReplaceAllString(base, "_")
	if base == "" {
		base = "user"
	}
	if len(base) > 24 {
		base = base[:24]
	}
	return fmt.Sprintf("%s_%d", strings.ToLower(base), time.Now().UnixNano()%10000000)
}

func smartFinanceParseTransactionType(value string) (smartFinanceTransactionType, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", "debit", "expense", "withdrawal", "dr":
		return smartFinanceDebit, nil
	case "credit", "income", "deposit", "cr":
		return smartFinanceCredit, nil
	default:
		return "", fmt.Errorf("type must be debit or credit")
	}
}

func smartFinanceParseAmount(value string) (int64, error) {
	cleaned := strings.TrimSpace(value)
	cleaned = strings.TrimPrefix(cleaned, "₹")
	cleaned = strings.TrimPrefix(cleaned, "INR")
	cleaned = strings.ReplaceAll(cleaned, ",", "")
	cleaned = strings.TrimSpace(cleaned)
	parsed, err := strconv.ParseFloat(cleaned, 64)
	if err != nil {
		return 0, err
	}
	return int64(math.Round(math.Abs(parsed) * 100)), nil
}

func smartFinanceAmountToString(value int64) string {
	return smartFinanceFloatAmountToString(float64(value))
}

func smartFinanceFloatAmountToString(value float64) string {
	return strconv.FormatFloat(value/100, 'f', 2, 64)
}

func smartFinanceFloatToString(value float64) string {
	return strconv.FormatFloat(value, 'f', 2, 64)
}

func smartFinanceParseDate(value string) (time.Time, error) {
	value = strings.TrimSpace(value)
	layouts := []string{
		"2006-01-02",
		"02/01/2006",
		"2/1/2006",
		"01-02-2006",
		"1-2-2006",
		"02-01-2006",
		"2006/01/02",
		"02 Jan 2006",
		"2 Jan 2006",
		"02 January 2006",
		"2 January 2006",
		"Jan 02 2006",
		"January 2 2006",
	}
	for _, layout := range layouts {
		if parsed, err := time.ParseInLocation(layout, value, time.Local); err == nil {
			return parsed, nil
		}
	}

	currentYear := time.Now().Year()
	withoutYearLayouts := []string{"02 Jan", "2 Jan", "02 January", "2 January", "Jan 02", "January 2"}
	for _, layout := range withoutYearLayouts {
		if parsed, err := time.ParseInLocation(layout, value, time.Local); err == nil {
			return time.Date(currentYear, parsed.Month(), parsed.Day(), 0, 0, 0, 0, time.Local), nil
		}
	}

	return time.Time{}, fmt.Errorf("date is invalid")
}

func smartFinanceDateFromUnix(value int64) string {
	return time.Unix(value, 0).Format("2006-01-02")
}

func smartFinanceCategorize(description string, txType smartFinanceTransactionType) string {
	if txType == smartFinanceCredit {
		return "Salary/Income"
	}

	for _, rule := range smartFinanceCategoryRules {
		if rule.Pattern.MatchString(description) {
			return rule.Name
		}
	}

	return "Other"
}

func (a *SmartFinanceApi) categorize(c *core.WebContext, uid int64, description string, txType smartFinanceTransactionType) string {
	rules := make([]*models.CategoryRule, 0)
	err := datastore.Container.UserDataStore.Query(c, uid).
		Where("uid=? AND deleted=? AND transaction_type=?", uid, false, string(txType)).
		Desc("updated_unix_time").
		Find(&rules)
	if err == nil {
		normalizedDescription := strings.ToLower(description)
		for _, rule := range rules {
			pattern := strings.ToLower(strings.TrimSpace(rule.MerchantPattern))
			if pattern != "" && strings.Contains(normalizedDescription, pattern) {
				return rule.CategoryName
			}
		}
	}

	return smartFinanceCategorize(description, txType)
}

func smartFinanceRulePatternFromFields(merchantPattern string, merchant string) string {
	pattern := strings.TrimSpace(merchantPattern)
	if pattern == "" {
		pattern = strings.TrimSpace(merchant)
	}
	if len(pattern) > 128 {
		pattern = pattern[:128]
	}
	return pattern
}

func smartFinanceCategoryColor(name string) string {
	colors := map[string]string{
		"Food":            "F5A623",
		"Transport":       "4A90E2",
		"Bills/Utilities": "7ED321",
		"Shopping":        "BD10E0",
		"Entertainment":   "9013FE",
		"Health":          "D0021B",
		"Rent":            "8B572A",
		"Salary/Income":   "50E3C2",
		"Subscriptions":   "417505",
	}
	if color, ok := colors[name]; ok {
		return color
	}
	return "9B9B9B"
}

func smartFinanceComment(description string, merchant string, source string) string {
	description = strings.TrimSpace(description)
	merchant = strings.TrimSpace(merchant)
	source = strings.TrimSpace(source)
	if source == "" {
		source = "manual"
	}
	if merchant != "" {
		return fmt.Sprintf("%s\nmerchant:%s\nsource:%s", description, merchant, source)
	}
	return fmt.Sprintf("%s\nsource:%s", description, source)
}

func smartFinanceDescriptionFromComment(comment string) string {
	description := strings.Split(comment, "\nsource:")[0]
	description = strings.Split(description, "\nmerchant:")[0]
	return strings.TrimSpace(description)
}

func smartFinanceMerchantFromComment(comment string) string {
	parts := strings.Split(comment, "\nmerchant:")
	if len(parts) < 2 {
		return smartFinanceMerchantFromDescription(smartFinanceDescriptionFromComment(comment))
	}

	merchant := strings.Split(parts[1], "\nsource:")[0]
	return strings.TrimSpace(merchant)
}

func smartFinanceSourceFromComment(comment string) string {
	parts := strings.Split(comment, "\nsource:")
	if len(parts) < 2 {
		return "manual"
	}
	return strings.TrimSpace(parts[len(parts)-1])
}

func smartFinanceCSVHeaderMap(row []string) map[string]int {
	result := map[string]int{}
	for i, column := range row {
		normalized := smartFinanceNormalizeCSVHeader(column)
		if normalized != "" {
			result[normalized] = i
		}
	}
	return result
}

func smartFinanceCSVValue(row []string, header map[string]int, column string) string {
	idx, ok := header[smartFinanceNormalizeCSVHeader(column)]
	if !ok || idx >= len(row) {
		return ""
	}
	return strings.TrimSpace(row[idx])
}

func smartFinanceCSVValueAny(row []string, header map[string]int, columns ...string) string {
	for _, column := range columns {
		if value := smartFinanceCSVValue(row, header, column); value != "" {
			return value
		}
	}
	return ""
}

func smartFinanceCSVHasAny(header map[string]int, columns ...string) bool {
	for _, column := range columns {
		if _, ok := header[smartFinanceNormalizeCSVHeader(column)]; ok {
			return true
		}
	}
	return false
}

func smartFinanceNormalizeCSVHeader(column string) string {
	column = strings.ToLower(strings.TrimSpace(column))
	column = strings.ReplaceAll(column, " ", "")
	column = strings.ReplaceAll(column, "_", "")
	column = strings.ReplaceAll(column, "-", "")
	return column
}

func smartFinanceCSVImportAmount(row []string, header map[string]int) string {
	if amount := smartFinanceCSVValueAny(row, header, "amount", "transactionamount", "value"); amount != "" {
		return amount
	}
	if debit := smartFinanceCSVValueAny(row, header, "debit", "withdrawal", "withdrawals"); debit != "" {
		return debit
	}
	return smartFinanceCSVValueAny(row, header, "credit", "deposit", "deposits")
}

func smartFinanceCSVImportType(row []string, header map[string]int) string {
	if txType := smartFinanceCSVValueAny(row, header, "type", "transactiontype"); txType != "" {
		return txType
	}
	if smartFinanceCSVValueAny(row, header, "credit", "deposit", "deposits") != "" {
		return "credit"
	}
	return "debit"
}

func smartFinanceMerchantFromDescription(description string) string {
	fields := strings.Fields(description)
	if len(fields) == 0 {
		return ""
	}

	merchant := fields[0]
	merchant = strings.Trim(merchant, "-:|")
	if len(merchant) > 96 {
		return merchant[:96]
	}
	return merchant
}

func smartFinanceDuplicateKey(tx *smartFinanceTransactionResponse) string {
	return strings.ToLower(strings.Join([]string{tx.Date, tx.Description, tx.Amount, tx.Type}, "|"))
}

func smartFinanceIncomeExpense(transactions []*models.Transaction) (int64, int64) {
	var income int64
	var expenses int64
	for _, tx := range transactions {
		if tx.Type == models.TRANSACTION_DB_TYPE_INCOME {
			income += absInt64(tx.Amount)
		} else if tx.Type == models.TRANSACTION_DB_TYPE_EXPENSE {
			expenses += absInt64(tx.Amount)
		}
	}
	return income, expenses
}

func smartFinanceCategoryBreakdown(c *core.WebContext, transactions []*models.Transaction, totalExpenses int64) []core.O {
	amounts := map[string]int64{}
	for _, tx := range transactions {
		if tx.Type != models.TRANSACTION_DB_TYPE_EXPENSE {
			continue
		}
		category := SmartFinance.categoryName(c, tx.Uid, tx.CategoryId)
		amounts[category] += absInt64(tx.Amount)
	}

	result := make([]core.O, 0, len(amounts))
	for category, amount := range amounts {
		percentage := 0.0
		if totalExpenses > 0 {
			percentage = float64(amount) * 100 / float64(totalExpenses)
		}
		result = append(result, core.O{
			"category":   category,
			"amount":     smartFinanceAmountToString(amount),
			"percentage": smartFinanceFloatToString(percentage),
		})
	}

	sort.Slice(result, func(i, j int) bool {
		left, _ := strconv.ParseFloat(result[i]["amount"].(string), 64)
		right, _ := strconv.ParseFloat(result[j]["amount"].(string), 64)
		return left > right
	})

	return result
}

func smartFinanceMonthlyTrends(transactions []*models.Transaction) []core.O {
	type monthlyTotal struct {
		Income   int64
		Expenses int64
	}

	months := map[string]*monthlyTotal{}
	for _, tx := range transactions {
		month := time.Unix(tx.TransactionTime, 0).Format("2006-01")
		if months[month] == nil {
			months[month] = &monthlyTotal{}
		}
		if tx.Type == models.TRANSACTION_DB_TYPE_INCOME {
			months[month].Income += absInt64(tx.Amount)
		} else if tx.Type == models.TRANSACTION_DB_TYPE_EXPENSE {
			months[month].Expenses += absInt64(tx.Amount)
		}
	}

	keys := make([]string, 0, len(months))
	for month := range months {
		keys = append(keys, month)
	}
	sort.Strings(keys)

	result := make([]core.O, 0, len(keys))
	for _, month := range keys {
		total := months[month]
		result = append(result, core.O{
			"month":        month,
			"totalIncome":  smartFinanceAmountToString(total.Income),
			"totalExpense": smartFinanceAmountToString(total.Expenses),
			"netSavings":   smartFinanceAmountToString(total.Income - total.Expenses),
		})
	}

	return result
}

func smartFinanceVolatilityScore(transactions []*models.Transaction) float64 {
	monthly := smartFinanceMonthlyTrends(transactions)
	if len(monthly) < 2 {
		return 75
	}

	values := make([]float64, 0, len(monthly))
	for _, item := range monthly {
		expense, _ := strconv.ParseFloat(item["totalExpense"].(string), 64)
		values = append(values, expense)
	}

	var sum float64
	for _, value := range values {
		sum += value
	}
	mean := sum / float64(len(values))
	if mean == 0 {
		return 100
	}

	var variance float64
	for _, value := range values {
		variance += math.Pow(value-mean, 2)
	}
	cv := math.Sqrt(variance/float64(len(values))) / mean
	return math.Max(0, 100-(cv*100))
}

func smartFinancePeriodToRange(period string) (string, string) {
	now := time.Now()
	switch strings.ToLower(period) {
	case "month", "current_month", "this_month":
		start := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
		end := start.AddDate(0, 1, -1)
		return start.Format("2006-01-02"), end.Format("2006-01-02")
	case "year", "current_year", "this_year":
		start := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, now.Location())
		end := time.Date(now.Year(), 12, 31, 0, 0, 0, 0, now.Location())
		return start.Format("2006-01-02"), end.Format("2006-01-02")
	default:
		return "", ""
	}
}

func smartFinanceNormalizeBudgetPeriod(period string) string {
	switch strings.ToLower(strings.TrimSpace(period)) {
	case "", "month", "current_month", "this_month", "monthly":
		return "monthly"
	case "week", "current_week", "this_week", "weekly":
		return "weekly"
	case "year", "current_year", "this_year", "yearly", "annual", "annually":
		return "yearly"
	case "all", "all_time", "lifetime":
		return "all_time"
	default:
		return strings.ToLower(strings.TrimSpace(period))
	}
}

func smartFinanceBudgetPeriodToRange(period string) (string, string) {
	now := time.Now()
	switch smartFinanceNormalizeBudgetPeriod(period) {
	case "weekly":
		weekday := int(now.Weekday())
		if weekday == 0 {
			weekday = 7
		}
		start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location()).AddDate(0, 0, -(weekday - 1))
		end := start.AddDate(0, 0, 6)
		return start.Format("2006-01-02"), end.Format("2006-01-02")
	case "monthly":
		start := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
		end := start.AddDate(0, 1, -1)
		return start.Format("2006-01-02"), end.Format("2006-01-02")
	case "yearly":
		start := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, now.Location())
		end := time.Date(now.Year(), 12, 31, 0, 0, 0, 0, now.Location())
		return start.Format("2006-01-02"), end.Format("2006-01-02")
	default:
		return "", ""
	}
}

func smartFinancePeriodResponse(req *smartFinanceAnalyticsRequest) core.O {
	return core.O{
		"period":    req.Period,
		"startDate": req.StartDate,
		"endDate":   req.EndDate,
	}
}

func clampFloat(value float64, minValue float64, maxValue float64) float64 {
	if value < minValue {
		return minValue
	}
	if value > maxValue {
		return maxValue
	}
	return value
}

func absInt64(value int64) int64 {
	if value < 0 {
		return -value
	}
	return value
}
