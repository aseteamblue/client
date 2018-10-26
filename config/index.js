const env = process.env.NODE_ENV || 'development'
const configs = {
  base: {
    env,
  },
  production: {
    api_url: 'https://server-thingy.herokuapp.com'
  },
  development: {
    api_url: 'http://localhost:7070'
  },
}
const config = Object.assign(configs.base, configs[env])

export default config
