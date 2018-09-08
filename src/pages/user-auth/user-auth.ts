import { observer, userStore } from '@store';
import { autoLoading } from '@utils';

const homeUrl = '/pages/book-list/book-list';

observer({
  props: {
    userStore
  },

  page: '',

  onLoad({ page = homeUrl }) {
    this.page = `${decodeURIComponent(page)}`;
  },

  async handleUpdateUser(userInfo) {
    await autoLoading(userStore.updateUser(userInfo));
    const pages = getCurrentPages();
    const navMethod = pages.length > 1 ? 'redirectTo' : 'reLaunch';
    wx[navMethod]({ url: this.page });
  },

  userInfoHandler(e) {
    const { userInfo, errMsg } = e.detail;
    if (errMsg.indexOf('fail') !== -1) {
      return;
    }
    this.handleUpdateUser(userInfo);
  }
});
