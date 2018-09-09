const { ip, NODE_ENV = 'development', PORT = 4000 } = process.env;

const environmentConfig = {
  development: {
    apiOrigin: `http://${ip}:${PORT}`,
    clouldeEnv: 'develop-6e2138'
  },
  production: {
    apiOrigin: 'http://45.76.13.154:7000',
    clouldeEnv: 'production-d1725e'
  },
}

export const { apiOrigin, clouldeEnv } = environmentConfig[NODE_ENV]
