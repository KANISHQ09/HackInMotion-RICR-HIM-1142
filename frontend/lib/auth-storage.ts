export const authTokenStorageKey = "spendly.authToken"
export const authUserStorageKey = "spendly.authUser"

export type AuthUser = {
  id: string
  email: string
  username?: string
  nickname?: string
  defaultCurrency?: string
  emailVerified?: boolean
}

export function saveAuthSession(token: string, user: AuthUser) {
  localStorage.setItem(authTokenStorageKey, token)
  localStorage.setItem(authUserStorageKey, JSON.stringify(user))
}

export function getAuthToken() {
  return localStorage.getItem(authTokenStorageKey)
}

export function getAuthUser() {
  const storedUser = localStorage.getItem(authUserStorageKey)

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch {
    return null
  }
}

export function hasAuthSession() {
  return Boolean(getAuthToken())
}

export function clearAuthSession() {
  localStorage.removeItem(authTokenStorageKey)
  localStorage.removeItem(authUserStorageKey)
}
