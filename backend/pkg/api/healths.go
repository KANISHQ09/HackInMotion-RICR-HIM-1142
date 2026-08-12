package api

import (
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/errs"
)

// HealthsApi represents health api
type HealthsApi struct{}

// Initialize a healths api singleton instance
var (
	Healths = &HealthsApi{}
)

// HealthStatusHandler returns the health status of current service
func (a *HealthsApi) HealthStatusHandler(c *core.WebContext) (any, *errs.Error) {
	result := make(map[string]string)

	result["version"] = core.Version
	result["commit"] = core.CommitHash
	result["status"] = "ok"

	return result, nil
}
