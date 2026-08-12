package avatars

import "github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/models"

// AvatarProvider is user avatar provider interface
type AvatarProvider interface {
	GetAvatarUrl(user *models.User) string
}
