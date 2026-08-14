package middlewares

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"github.com/HackInMotion-RICR-HIM-1142/HackInMotion-RICR-HIM-1142/pkg/core"
)

func TestJWTAuthorizationByCookieRejectsMissingCookieAsUnauthorized(t *testing.T) {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	ginContext, _ := gin.CreateTestContext(recorder)
	ginContext.Request = httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	context := core.WrapWebContext(ginContext, nil)

	JWTAuthorizationByCookie(nil)(context)

	assert.Equal(t, http.StatusUnauthorized, recorder.Code)
	assert.True(t, ginContext.IsAborted())
}
