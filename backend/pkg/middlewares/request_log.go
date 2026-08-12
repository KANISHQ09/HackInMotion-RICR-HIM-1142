package middlewares

import (
	"time"

	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/log"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/utils"
)

// RequestLog logs the http request log
func RequestLog(c *core.WebContext) {
	start := time.Now()
	path := c.Request.URL.Path
	query := c.Request.URL.RawQuery

	c.Next()

	now := time.Now()

	statusCode := c.Writer.Status()
	errorCode := int32(0)

	userId := "-"
	claims := c.GetTokenClaims()
	err := c.GetResponseError()

	clientIP := c.ClientIP()
	method := c.Request.Method

	if claims != nil {
		userId = utils.Int64ToString(claims.Uid)
	}

	if err != nil {
		errorCode = err.Code()
	}

	if query != "" {
		path = path + "?" + query
	}

	cost := now.Sub(start).Nanoseconds() / 1e6

	log.Requestf(c, "%d %d %s %s %s %s %dms", statusCode, errorCode, userId, clientIP, method, path, cost)
}
