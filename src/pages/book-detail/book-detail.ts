import { showConfirmModal } from '@utils';
import { observer, BookStore } from '@store';

observer({
  get props() {
    return {
      bookStore: BookStore.findOrCreate(this.options.id)
    }
  },

  onLoad() {
    return this.props.bookStore.fetchData();
  },

  async handleDelete() {
    await showConfirmModal('账本');
    await this.props.bookStore.deleteBook();
    wx.reLaunch({
      url: '/pages/book-list/book-list'
    });
  },

  async handleExit() {
    await showConfirmModal('账本');
    await this.props.bookStore.exitBook();
    wx.reLaunch({
      url: '/pages/book-list/book-list'
    });
  }

});
