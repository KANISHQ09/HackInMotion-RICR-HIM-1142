package middlewares

import (
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/errs"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/settings"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/utils"
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
