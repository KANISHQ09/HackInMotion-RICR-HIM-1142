package api

import (
	"testing"
	"time"

	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/utils"
	"github.com/stretchr/testify/assert"
)

func TestSmartFinanceDateFromTransactionTime(t *testing.T) {
	unixTime := time.Date(2024, time.January, 15, 12, 0, 0, 0, time.Local).Unix()

	assert.Equal(t, "2024-01-15", smartFinanceDateFromTransactionTime(unixTime))
	assert.Equal(
		t,
		"2024-01-15",
		smartFinanceDateFromTransactionTime(utils.GetMinTransactionTimeFromUnixTime(unixTime)),
	)
}
