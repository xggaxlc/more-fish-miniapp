import { toRGB } from '@utils';
import { WebAPIStore, fetchAction, asyncAction } from './helper';
import { fetch, goTo, wxPromise } from '@utils';
import { computed, observable } from 'mobx';
import get from 'lodash-es/get';

class UserStore extends WebAPIStore {

  @observable userInfoUpdated = false;
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
    // 整个小程序周期只更新一次用户信息
    if (this.userUpdated) {
      return;
    }
    const { data } = yield fetch('/users/me', { method: 'PUT', data: body });
    this.data = data;
    this.userUpdated = true;
  }

  async tryUpdateUser() {
    const { authSetting } = await wxPromise.getSetting();
    if (get(authSetting, 'scope.userInfo')) {
      const { userInfo } = await wxPromise.getUserInfo();
      return this.updateUser(userInfo);
    } else {
      const error: any = new Error('需要用户授权');
      error.type = 'userinfo';
      throw error;
    }
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

  @computed
  get currentBookColorRgb() {
    const hex = get(this.data, 'currentBook.color', '').replace('#', '');
    return toRGB(hex);
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
