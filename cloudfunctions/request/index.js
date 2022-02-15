const superRequest = require('request');

exports.main = async (event) => {
  const { userInfo, request } = event;
  return new Promise((resolve, reject) => {
    superRequest(request, (error, response, body) => {
      if (error) return reject(error);
      resolve({
        userInfo,
        response,
        body: JSON.parse(body)
      });
    });
  });
}
