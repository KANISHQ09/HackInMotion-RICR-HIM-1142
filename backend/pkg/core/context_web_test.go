package core

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSetTokenStringToCookie(t *testing.T) {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	ginContext, _ := gin.CreateTestContext(recorder)
	context := WrapWebContext(ginContext, nil)

	context.SetTokenStringToCookie("signed-token", 3600, "/", true)

	cookies := recorder.Result().Cookies()
	require.Len(t, cookies, 1)
	assert.Equal(t, tokenCookieParam, cookies[0].Name)
	assert.Equal(t, "signed-token", cookies[0].Value)
	assert.Equal(t, "/", cookies[0].Path)
	assert.Equal(t, 3600, cookies[0].MaxAge)
	assert.True(t, cookies[0].HttpOnly)
	assert.True(t, cookies[0].Secure)
	assert.Equal(t, http.SameSiteLaxMode, cookies[0].SameSite)
}

func TestSetTokenStringToCookieClearsCookie(t *testing.T) {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	ginContext, _ := gin.CreateTestContext(recorder)
	context := WrapWebContext(ginContext, nil)

	context.SetTokenStringToCookie("", 3600, "/", false)

	cookies := recorder.Result().Cookies()
	require.Len(t, cookies, 1)
	assert.Empty(t, cookies[0].Value)
	assert.Less(t, cookies[0].MaxAge, 0)
	assert.True(t, cookies[0].HttpOnly)
	assert.Equal(t, http.SameSiteLaxMode, cookies[0].SameSite)
}
