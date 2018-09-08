import { settingStore } from './../store/setting-store';
import { apiOrigin } from './environment';
import { urlConcat } from './url-concat';
import get from 'lodash-es/get';

async function handleAuth(pathname, options) {
  const maxRetry = 2;
  let retry = 0;
  const authStore = require('@store').authStore;

  const fn = async() => {
    retry ++;
    if (retry >= maxRetry) {
      throw new Error('登录失败');
    }

    try {
      authStore.removeToken();
      await authStore.login();
      return await fetch(pathname, options, false);
    } catch (e) {
      if (e.message.startsWith('ignore')) {
        throw e;
      }
      return fn();
    }
  }

  return fn();
}

// export async function fetch(pathname, options: any = {}, handle401 = true) {
//   const { method = 'GET', data = {} } = options;
//   const token = get(require('@store'), 'authStore.token');
//   const request: any = {
//     baseUrl: apiOrigin,
//     url: pathname,
//     method,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       'Authorization': token
//     }
//   }

//   const methodStr = method.toUpperCase();
//   if (methodStr === 'GET' || methodStr === 'DELETE') {
//     request.qs = data;
//   } else {
//     request.body = JSON.stringify(data);
//   }

//   const res = await wx.cloud.callFunction({
//     name: 'request',
//     data: {
//       request
//     }
//   });
//   const { result: { response: { statusCode }, body } } = res;
//   if (statusCode >= 200 && statusCode < 300) {
//     return body;
//   } else {
//     if (handle401 && statusCode === 401) {
//       return handleAuth(pathname, options);
//     }
//     const err: any = new Error(body.message)
//     err.status = statusCode;
//     throw err;
//   }
// }

export function fetch(pathname, options: any = {}, handle401 = true) {
  const mergeUrl = urlConcat(apiOrigin, pathname)
  const apiName = options.apiName || 'request'
  const defaultOptions = {
    method: 'GET',
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const opts = Object.assign({}, defaultOptions, options)

  const token = get(require('@store'), 'authStore.token');
  if (token) {
    opts.header['Authorization'] = token;
  }

  return wx[apiName]({ url: mergeUrl, ...opts }).then(res => {
    const { statusCode } = res
    if (statusCode >= 200 && statusCode < 300) {
      const timestamp = +get(res, 'header.Timestamp', 0);
      timestamp && settingStore.setTimestamp(timestamp);
      return res.data;
    } else {
      if (handle401 && statusCode === 401) {
        return handleAuth(pathname, options);
      }
      const err: any = new Error(res.data.message)
      err.status = statusCode
      throw err
    }
  })
}
