package core

import "github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/errs"

// CliHandlerFunc represents the cli handler function
type CliHandlerFunc func(*CliContext) error

// MiddlewareHandlerFunc represents the middleware handler function
type MiddlewareHandlerFunc func(*WebContext)

// ApiHandlerFunc represents the api handler function
type ApiHandlerFunc func(*WebContext) (any, *errs.Error)

// DataHandlerFunc represents the handler function that returns file data byte array and file name
type DataHandlerFunc func(*WebContext) ([]byte, string, *errs.Error)
