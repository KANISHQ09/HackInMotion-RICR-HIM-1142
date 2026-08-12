package _default

// defaultTransactionDataCSVFileConverter defines the structure of spendly default csv file converter
type defaultTransactionDataCSVFileConverter struct {
	defaultTransactionDataPlainTextConverter
}

// Initialize an spendly default transaction data csv file converter singleton instance
var (
	DefaultTransactionDataCSVFileConverter = &defaultTransactionDataCSVFileConverter{
		defaultTransactionDataPlainTextConverter{
			columnSeparator: ",",
		},
	}
)
