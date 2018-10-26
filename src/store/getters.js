const config = state => state.app.config
const isLoading = state => state.app.isLoading

const isLoggedIn = state => !!state.auth.token
const authStatus = state => state.auth.status

export {
  config,
  isLoading,
  isLoggedIn,
  authStatus
}
