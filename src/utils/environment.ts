const { IP, NODE_ENV = 'development', PORT = 4000 } = process.env;

const environmentConfig = {
  development: {
    apiOrigin: `http://${IP}:${PORT}`,
    cloudEnv: 'develop-6e2138'
  },
  production: {
    apiOrigin: 'http://45.76.13.154:7000',
    cloudEnv: 'production-d1725e'
  },
}

export const { apiOrigin, cloudEnv } = environmentConfig[NODE_ENV]
