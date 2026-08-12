package custom

import "github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"

// CustomTransactionDataParser represents the parser for custom transaction data files
type CustomTransactionDataParser interface {
	ParseDataLines(ctx core.Context, data []byte) ([][]string, error)
}
