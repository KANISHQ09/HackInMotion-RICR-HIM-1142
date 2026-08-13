package api

import "github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/settings"

// ApiUsingConfig represents an api that need to use config
type ApiUsingConfig struct {
	container *settings.ConfigContainer
}

// CurrentConfig returns the current config
func (a *ApiUsingConfig) CurrentConfig() *settings.Config {
	return a.container.GetCurrentConfig()
}
