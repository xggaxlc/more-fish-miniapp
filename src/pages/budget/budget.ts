import { observer, userStore, checkCurrentBook, BudgetListStore, BudgetStore, uiStore } from '@store';
import { autoLoading, showToast, showConfirmModal } from '@utils';
import './budget.scss';

observer({
  get props() {
    return checkCurrentBook()
      .then(() => {
        return {
          uiStore,
          userStore,
          budgetListStore: BudgetListStore.findOrCreate(userStore.currentBookId)
        }
      });
  },

  onLoad() {
    return this.props.budgetListStore.fetchData();
  },

  async handleLongPress(e) {
    if (!userStore.isCurrentBookCreator) {
      return false;
    }
    const id = e.currentTarget.dataset.id;
    const { tapIndex } = await wx.showActionSheet({
      itemList: ['编辑', '删除']
    });
    tapIndex ? this.handleDelete(id) : this.handleEdit(id);
  },

  async handleDelete(id) {
    await showConfirmModal('预算');
    const budgetStore = BudgetStore.findOrCreate(id);
    await autoLoading(budgetStore.delete());
    showToast('删除成功');
  },

  handleEdit(id) {
    wx.navigateTo({ url: `/pages/budget-form/budget-form?id=${id}` });
  },

  onShareAppMessage() {
    return {
      imageUrl: '/images/img-share.png'
    }
  },
});
