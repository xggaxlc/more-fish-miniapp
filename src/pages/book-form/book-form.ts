import { observer, bookListStore, BookStore, userStore } from '@store';
import { autoLoading, showToast, showTipModal, showConfirmModal, goBack } from '@utils';

observer({

  _needUpdateUserInfo: true,

  get props() {
    const id = this.options.id;
    const stores: any = { userStore }
    if (this.options.id) {
      stores.bookStore = BookStore.findOrCreate(id)
    }
    return stores;
  },

  data: {
    form: {}
  },

  async onLoad() {
    wx.hideShareMenu();
    const bookStore = this.props.bookStore;
    if (bookStore) {
      await bookStore.fetchData();
      wx.showShareMenu({ withShareTicket: true });
      this.setData({
        form: {
          name: bookStore.data.name,
          remark: bookStore.data.remark
        }
      });
    }
  },

  handleInputChange(e) {
    const { detail: { value }, target: { dataset: { name } } } = e;
    this.setData({ [`form.${name}`]: value });
  },

  async handleSubmit() {
    const { name } = this.data.form;
    if (!name) {
      showTipModal('请填写账本名称');
      return;
    }
    const bookStore = this.props.bookStore;
    if (bookStore) {
      // 更新
      await autoLoading(bookStore.updateBook(this.data.form));
      showToast('更新成功');
      goBack();
    } else {
      // 创建
      const id = await autoLoading(bookListStore.create(this.data.form));
      await showToast('添加成功');
      wx.redirectTo({ url: `/pages/book-form/book-form?id=${id}` });
    }
  },

  async handleDelete(e) {
    await showConfirmModal('成员');
    const userId = e.target.dataset.id;
    const bookStore = this.props.bookStore;
    await autoLoading(bookStore.deleteBookMember(userId));
    showToast('删除成功');
  },

  onShareAppMessage() {
    const bookStore = this.props.bookStore;
    return {
      title: `${userStore.data.nickName}邀请你加入${bookStore.data.name}`,
      imageUrl: '/images/img-share.png',
      path: `/pages/join-book/join-book?id=${bookStore.data._id}&user_id=${userStore.data._id}`
    }
  }
});
