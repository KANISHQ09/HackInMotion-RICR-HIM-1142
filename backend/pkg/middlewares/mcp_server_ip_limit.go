package middlewares

import (
	"github.com/spendly/spendly/pkg/core"
	"github.com/spendly/spendly/pkg/errs"
	"github.com/spendly/spendly/pkg/settings"
	"github.com/spendly/spendly/pkg/utils"
)

// MCPServerIpLimit limits access to the MCP server based on IP address.
func MCPServerIpLimit(config *settings.Config) core.MiddlewareHandlerFunc {
	return func(c *core.WebContext) {
		if len(config.MCPAllowedRemoteIPs) < 1 {
			c.Next()
			return
		}

		for i := 0; i < len(config.MCPAllowedRemoteIPs); i++ {
			if config.MCPAllowedRemoteIPs[i].Match(c.ClientIP()) {
				c.Next()
				return
			}
		}

		utils.PrintJsonErrorResult(c, errs.ErrIPForbidden)
	}
}
