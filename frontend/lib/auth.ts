/**
 * Auth helpers — token is stored as an HttpOnly cookie set by the backend.
 * The frontend never has direct access to the token value.
 *
 * isAuthenticated() uses a lightweight in-memory flag that is set after a
 * successful login/refresh and cleared on logout. On a hard page reload the
 * flag resets; call GET /auth/me (or any authenticated endpoint) to re-validate.
 */

let _authenticated = false

export function markAuthenticated(): void {
  _authenticated = true
}

export function markUnauthenticated(): void {
  _authenticated = false
}

export function isAuthenticated(): boolean {
  return _authenticated
}

// Legacy helpers kept for compatibility — they are no-ops now that the token
// lives in an HttpOnly cookie managed by the browser.
export function saveToken(_token: string): void {
  markAuthenticated()
}

export function getToken(): string | null {
  // The token is in an HttpOnly cookie — JavaScript cannot read it.
  return null
}

export function clearToken(): void {
  markUnauthenticated()
}
