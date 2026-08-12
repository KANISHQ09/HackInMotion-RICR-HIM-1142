package core

import "context"

// Context is the base context of Spendly
type Context interface {
	context.Context
	ClientIP() string
	GetContextId() string
	GetClientLocale() string
}
