package avatars

import (
	"github.com/spendly/spendly/pkg/core"
	"github.com/spendly/spendly/pkg/errs"
	"github.com/spendly/spendly/pkg/models"
	"github.com/spendly/spendly/pkg/settings"
)

// AvatarProviderContainer contains the current user avatar provider
type AvatarProviderContainer struct {
	current AvatarProvider
}

// Initialize a user avatar provider container singleton instance
var (
	Container = &AvatarProviderContainer{}
)

// InitializeAvatarProvider initializes the current user avatar provider according to the config
func InitializeAvatarProvider(config *settings.Config) error {
	if config.AvatarProvider == core.USER_AVATAR_PROVIDER_INTERNAL {
		Container.current = NewInternalStorageAvatarProvider(config)
		return nil
	} else if config.AvatarProvider == core.USER_AVATAR_PROVIDER_GRAVATAR {
		Container.current = NewGravatarAvatarProvider()
		return nil
	} else if config.AvatarProvider == "" {
		Container.current = NewNullAvatarProvider()
		return nil
	}

	return errs.ErrInvalidAvatarProvider
}

// GetAvatarUrl returns the avatar url by the current user avatar provider
func (p *AvatarProviderContainer) GetAvatarUrl(user *models.User) string {
	if p.current == nil {
		return ""
	}

	return p.current.GetAvatarUrl(user)
}
