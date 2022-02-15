import { wxPromise } from '@utils';
import { userStore, authStore, settingStore } from '@store';
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

function handleResponse(pathname: string, options = {}, handle401 = false) {
  return (response) => {
    const { statusCode } = response;
    if (statusCode >= 200 && statusCode < 300) {
      const timestamp = +get(response, 'header.timestamp') || +get(response, 'header.Timestamp') || 0;
      timestamp && settingStore.updateTimestamp(timestamp);
      return response.data;
    } else {
      if (handle401 && statusCode === 401) {
        return handleAuth(pathname, options);
      }
      const err: any = new Error(response.data.message)
      err.status = statusCode
      throw err
    }
  }
}

function getRequestOpts(method = 'GET', headerName = 'header' ) {
  return {
    method,
    [headerName]: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authStore.token
    }
  }
}

async function fetch_production(pathname: string, options: any = {}, handle401 = true) {
  pathname = pathname.replace(/\$\$bookId/g, userStore.currentBookId);
  const { method = 'GET', data = {} } = options;
  const methodStr = method.toUpperCase();
  const request: any = getRequestOpts(methodStr, 'headers');
  request.baseUrl = apiOrigin;
  request.url = pathname;
  if (methodStr === 'GET' || methodStr === 'DELETE') {
    request.qs = data;
  } else {
    request.body = JSON.stringify(data);
  }
  const { result: { response: { statusCode, headers }, body } } = await wxPromise.cloud.callFunction({
    name: 'request',
    data: { request }
  });

  const res = {
    header: headers,
    statusCode,
    data: body
  }
  return handleResponse(pathname, options, handle401)(res);
}

function fetch_development(pathname: string, options: any = {}, handle401 = true) {
  pathname = pathname.replace(/\$\$bookId/g, userStore.currentBookId);
  const mergeUrl = urlConcat(apiOrigin, pathname)
  const apiName = options.apiName || 'request'
  const opts = Object.assign({}, getRequestOpts(), options)
  return wxPromise[apiName]({ url: mergeUrl, ...opts })
    .then(handleResponse(pathname, options, handle401));
}

const fn = {
  development: fetch_development,
  production: fetch_production
}

const { NODE_ENV = 'development' } = process.env;

export const fetch = fn[NODE_ENV];

