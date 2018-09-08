import { WebAPIStore, fetchAction, asyncAction } from './helper';
import { fetch, goTo } from '@utils';
import { computed, observable } from 'mobx';
import { get } from 'lodash';
import * as qs from 'qs';

class UserStore extends WebAPIStore {

  @observable data: any = { currentBook: {} };
  @observable userUpdated = false;

  @fetchAction.merge
  async fetchData() {
    return fetch('/users/me');
  }

  @asyncAction
  async* updateCurrentBook(bookId) {
    const { data } = yield fetch('/users/me', { method: 'PUT', data: { currentBook: bookId } });
    this.data = data;
  }

  @asyncAction
  async* updateUser(body) {
    const { data } = yield fetch('/users/me', { method: 'PUT', data: body });
    this.data = data;
    this.userUpdated = true;
  }

  async refreshUser() {
    if (this.userUpdated) return;
    const { authSetting } = await wx.getSetting();
    if (get(authSetting, 'scope.userInfo')) {
      const { userInfo } = await wx.getUserInfo();
      this.updateUser(userInfo);
    } else {
      this.navToAuthPage();
      throw new Error('ignore 需要重新授权');
    }
  }

  async navToAuthPage() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const query = qs.stringify(currentPage.options);

    const currentUrl = `/${currentPage.route}?${query}`;
    const authUrl = '/pages/user-auth/user-auth';

    if (currentUrl.indexOf(authUrl) === -1) {
      wx.redirectTo({ url: `${authUrl}?page=${encodeURIComponent(currentUrl)}` });
    }
  }

  @computed
  get userInfoFull() {
    return !!this.data.nickName;
  }

  @computed
  get currentBookName() {
    return get(this.data, 'currentBook.name', '');
  }

  @computed
  get currentBookId() {
    return get(this.data, 'currentBook._id', '');
  }

  @computed
  get isCurrentBookCreator() {
    return String(this.data._id) === String(get(this.data, 'currentBook.create_user'));
  }
}

export const userStore = new UserStore();

export function checkCurrentBook(...args) {
  async function check() {
    const authStore = require('./auth-store').authStore;
    if (!authStore.token) {
      await authStore.login();
    }
    await userStore.tryFetchData();
    if (!get(userStore.data, 'currentBook._id')) {
      goTo({
        url: '/pages/book-list/book-list',
        method: 'redirectTo'
      });
      throw new Error('ignore 需要选择当前账本');
    }
  }
  if (!args.length) {
    return check();
  }

  const descriptor = args[2];
  const func = descriptor.value;
  descriptor.value = async function(...args) {
    await check();
    return func.apply(this, args);
  }
  return descriptor;
}
