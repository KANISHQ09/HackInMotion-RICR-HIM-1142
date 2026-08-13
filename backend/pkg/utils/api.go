package utils

import (
	"errors"
	"net/http"
	"reflect"

	"github.com/go-playground/validator/v10"

	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"
	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/errs"
)

// GetDisplayErrorMessage returns the display error message for given error
func GetDisplayErrorMessage(err *errs.Error) string {
	if err.Code() == errs.ErrIncompleteOrIncorrectSubmission.Code() && len(err.BaseError) > 0 {
		var validationErrors validator.ValidationErrors
		ok := errors.As(err.BaseError[0], &validationErrors)

		if ok {
			for _, err := range validationErrors {
				return getValidationErrorText(err)
			}
		}
	}

	return err.Error()
}

// GetJsonErrorResult returns error response in json format
func GetJsonErrorResult(err *errs.Error, path string) map[string]any {
	return core.O{
		"success":      false,
		"errorCode":    err.Code(),
		"errorMessage": GetDisplayErrorMessage(err),
		"path":         path,
	}
}

// PrintJsonSuccessResult writes success response in json format to current http context
func PrintJsonSuccessResult(c *core.WebContext, result any) {
	c.JSON(http.StatusOK, core.O{
		"success": true,
		"result":  result,
	})
}

// PrintDataSuccessResult writes success response in custom content type to current http context
func PrintDataSuccessResult(c *core.WebContext, contentType string, fileName string, result []byte) {
	if fileName != "" {
		c.Header("Content-Disposition", "attachment;filename="+fileName)
	}

	c.Data(http.StatusOK, contentType, result)
}

// PrintJsonErrorResult writes error response in json format to current http context
func PrintJsonErrorResult(c *core.WebContext, err *errs.Error) {
	c.SetResponseError(err)

	result := GetJsonErrorResult(err, c.Request.URL.Path)

	if err.Context != nil {
		result["context"] = err.Context
	}

	c.AbortWithStatusJSON(err.HttpStatusCode, result)
}

// PrintDataErrorResult writes error response in custom content type to current http context
func PrintDataErrorResult(c *core.WebContext, contentType string, err *errs.Error) {
	c.SetResponseError(err)
	c.Data(err.HttpStatusCode, contentType, []byte(GetDisplayErrorMessage(err)))
	c.Abort()
}

func getValidationErrorText(err validator.FieldError) string {
	fieldName := GetFirstLowerCharString(err.Field())

	switch err.Tag() {
	case "required":
		return errs.GetParameterIsRequiredMessage(fieldName)
	case "max":
		if isIntegerParameter(err.Kind()) {
			return errs.GetParameterMustLessThanMessage(fieldName, err.Param())
		} else if isStringParameter(err.Kind()) {
			return errs.GetParameterMustLessThanCharsMessage(fieldName, err.Param())
		}
	case "min":
		if isIntegerParameter(err.Kind()) {
			return errs.GetParameterMustMoreThanMessage(fieldName, err.Param())
		} else if isStringParameter(err.Kind()) {
			return errs.GetParameterMustMoreThanCharsMessage(fieldName, err.Param())
		}
	case "len":
		return errs.GetParameterLengthNotEqualMessage(fieldName, err.Param())
	case "notBlank":
		return errs.GetParameterNotBeBlankMessage(fieldName)
	case "validUsername":
		return errs.GetParameterInvalidUsernameMessage(fieldName)
	case "validEmail":
		return errs.GetParameterInvalidEmailMessage(fieldName)
	case "validCurrency":
		return errs.GetParameterInvalidCurrencyMessage(fieldName)
	case "validHexRGBColor":
		return errs.GetParameterInvalidHexRGBColorMessage(fieldName)
	case "validAmountFilter":
		return errs.GetParameterInvalidAmountFilterMessage(fieldName)
	case "validTransactionAmount":
		return errs.GetParameterInvalidTransactionAmountMessage(fieldName)
	case "validTagFilter":
		return errs.GetParameterInvalidTagFilterMessage(fieldName)
	}

	return errs.GetParameterInvalidMessage(fieldName)
}

func isIntegerParameter(kind reflect.Kind) bool {
	switch kind {
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64, reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		return true
	default:
		return false
	}
}

func isStringParameter(kind reflect.Kind) bool {
	return kind == reflect.String
}
