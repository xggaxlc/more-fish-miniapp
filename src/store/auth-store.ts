import { observable, action } from 'mobx';
import { fetch, wxPromise } from '@utils';

const TOKEN_KEY = 'token';

class AuthStore {

  @observable token = '';

  constructor() {
    this.init();
  }

  @action
  init() {
    this.token = wx.getStorageSync(TOKEN_KEY) || '';
  }

  @action
  saveToken(token) {
    this.token = token;
    wx.setStorageSync(TOKEN_KEY, token);
  }

  @action
  removeToken() {
    this.token = '';
    wx.removeStorageSync(TOKEN_KEY);
  }

  async login() {
    const { code } = await wxPromise.login();
    const { data: { token } } = await fetch('/users/login', { method: 'POST', data: { code } });
    this.saveToken(token);
  }
}

export const authStore = new AuthStore();
