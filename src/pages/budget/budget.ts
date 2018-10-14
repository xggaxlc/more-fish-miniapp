import { observer, userStore, settingStore, budgetListStore, BudgetStore, billListStore } from '@store';
import { autoLoading, showToast, showConfirmModal, pullDownRefresh, wxPromise } from '@utils';

observer({

  _needCurrentBookId: true,

  props: {
    settingStore,
    userStore,
    budgetListStore
  },

  onLoad() {
    return this.fetchData();
  },

  fetchData() {
    return budgetListStore.fetchData();
  },

  onPullDownRefresh() {
    return pullDownRefresh(this.fetchData());
  },

  async handleLongPress(e) {
    if (!userStore.isCurrentBookCreator) {
      return false;
    }
    const id = e.currentTarget.dataset.id;
    const { tapIndex } = await wxPromise.showActionSheet({
      itemList: ['编辑', '删除']
    });
    tapIndex ? this.handleDelete(id) : this.handleEdit(id);
  },

  async handleDelete(id) {
    await showConfirmModal('预算');
    const budgetStore = BudgetStore.findOrCreate(id);
    await autoLoading(budgetStore.delete());
    billListStore.fetchData();
    showToast('删除成功');
  },

  handleEdit(id) {
    wx.navigateTo({ url: `/pages/budget-form/budget-form?id=${id}` });
  },

  handleDateChange(e) {
    const value = e.detail.value;
    const [yearStr, monthStr] = value.split('-');
    const year = +yearStr;
    const month = monthStr - 1;
    const { year: currentYear, month: currentMonth } = budgetListStore.form;
    if (year !== currentYear || month !== currentMonth) {
      budgetListStore.updateForm({ year, month  });
      autoLoading(this.fetchData());
    }
  },
});
