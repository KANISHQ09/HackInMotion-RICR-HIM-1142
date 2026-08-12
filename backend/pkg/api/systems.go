package api

import (
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/errs"
)

// SystemsApi represents system api
type SystemsApi struct{}

// Initialize a system api singleton instance
var (
	Systems = &SystemsApi{}
)

// VersionHandler returns the server version and commit hash
func (a *SystemsApi) VersionHandler(c *core.WebContext) (any, *errs.Error) {
	result := make(map[string]string)

	result["version"] = core.Version
	result["commitHash"] = core.CommitHash

	if core.BuildTime != "" {
		result["buildTime"] = core.BuildTime
	}

	return result, nil
}
