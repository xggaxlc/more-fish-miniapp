import { observer, BookStore, userStore } from '@store';
import { autoLoading, showTipModal } from '@utils';

observer({
  get props() {
    return {
      userStore,
      bookStore: BookStore.findOrCreate(this.options.id)
    }
  },

  async onLoad() {
    const store = this.props.bookStore;
    await Promise.all([
      store.fetchJoinData(),
      userStore.fetchData()
    ]);

    if (store.userIsMember) {
      wx.hideLoading();
      await showTipModal('您已经在此账本了');
      this.navToHome();
    }
  },

  async handleJoin() {
    await autoLoading(
      Promise.all([
        userStore.refreshUser(),
        this.props.bookStore.joinBook()
      ])
    );
    this.navToHome();
  },

  navToHome() {
    wx.redirectTo({ url: '/pages/book-list/book-list' });
  },

  async handleGetUserInfo(e) {
    const { userInfo, errMsg } = e.detail;
    if (errMsg.indexOf('fail') !== -1) {
      return;
    }
    await autoLoading(userStore.updateUser(userInfo));
    this.handleJoin();
  }
})
