import { observer, BookStore, userStore } from '@store';
import { autoLoading, showTipModal } from '@utils';

observer({
  _needUpdateUserInfo: true,

  get props() {
    return {
      userStore,
      bookStore: BookStore.findOrCreate(this.options.id)
    }
  },

  async onLoad() {
    const store = this.props.bookStore;
    await store.fetchJoinData();

    if (store.userIsMember) {
      wx.hideLoading();
      await showTipModal('您已经在此账本了');
      this.navToHome();
    }
  },

  async handleJoin() {
    await autoLoading(
      this.props.bookStore.joinBook()
    );
    this.navToHome();
  },

  navToHome() {
    wx.redirectTo({ url: '/pages/book-list/book-list' });
  }
})
