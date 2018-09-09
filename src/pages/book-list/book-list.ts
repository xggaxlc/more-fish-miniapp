import { showToast, showConfirmModal, showTipModal, autoLoading, pullDownRefresh } from '@utils';
import { observer, bookListStore, BookStore, userStore } from '@store';
observer({

  props: {
    bookListStore,
    userStore
  },

  onLoad() {
    return Promise.all([
      userStore.tryFetchData(),
      bookListStore.fetchData()
    ]);
  },

  onPullDownRefresh() {
    return pullDownRefresh(bookListStore.fetchData());
  },

  async handleStart(e) {
    const { id } = e.currentTarget.dataset;
    await autoLoading(userStore.updateCurrentBook(id));
    wx.reLaunch({ url: '/pages/bill/bill' });
  },

  async handleOpenActionsheet(e) {
    const { id, creator } = e.currentTarget.dataset;
    const creatorId = creator._id || creator;
    if (String(creatorId) !== String(userStore.data._id)) {
      showTipModal('账本创建者才有权限修改账本');
      return;
    }

    const { tapIndex } = await wx.showActionSheet({
      itemList: ['编辑', '删除']
    });
    tapIndex ? this.handleDelete(id) : this.navToEdit(id);
  },

  navToEdit(id) {
    wx.navigateTo({ url: `/pages/book-form/book-form?id=${id}` });
  },

  navToAddBook() {
    wx.navigateTo({ url: '/pages/book-form/book-form' });
  },

  async handleDelete(id) {
    await showConfirmModal('账本');
    const bookStore = BookStore.findOrCreate(id);
    await autoLoading(bookStore.deleteBook());
    showToast('删除成功');
  }

});
