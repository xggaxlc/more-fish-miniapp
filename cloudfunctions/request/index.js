const superRequest = require('request');

exports.main = async (event) => {
  const { userInfo, request } = event;
  try {
    const res = await new Promise((resolve, reject) => {
      superRequest(request, (error, response, body) => {
        if (error) return reject(error);
        resolve({
          response,
          body: JSON.parse(body)
        });
      });
    });
    return {
      userInfo,
      ...res
    };
  } catch (err) {
    return err;
  }
}
