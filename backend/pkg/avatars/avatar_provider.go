package avatars

import "github.com/spendly/spendly/pkg/models"

// AvatarProvider is user avatar provider interface
type AvatarProvider interface {
	GetAvatarUrl(user *models.User) string
}
