const { ip, NODE_ENV = 'development', PORT = 4000 } = process.env;

const environmentConfig = {
  development: {
    apiOrigin: `http://${ip}:${PORT}`,
  },
  staging: {
    apiOrigin: `http://${ip}:${PORT}`,
  },
  production: {
    apiOrigin: 'http://45.76.13.154:7000',
  },
}

export const { apiOrigin } = environmentConfig[NODE_ENV]
