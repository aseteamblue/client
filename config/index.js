const env = process.env.NODE_ENV || 'development'
const configs = {
  base: {
    env,
    api_url: 'http://localhost:7070'
  },
  production: {
    api_url: 'https://server-thingy.herokuapp.com'
  },
  development: {
  },
}
const config = Object.assign(configs.base, configs[env])

export default config
