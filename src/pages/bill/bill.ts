import { settingStore } from './../../store/setting-store';
import { observer, userStore, checkCurrentBook, BillListStore, uiStore, BudgetListStore } from '@store';

observer({
  get props() {
    return checkCurrentBook()
      .then(() => {
        return {
          settingStore,
          uiStore,
          userStore,
          billListStore: BillListStore.findOrCreate(userStore.currentBookId),
          budgetListStore: BudgetListStore.findOrCreate(userStore.currentBookId)
        }
      });
  },

  async onLoad() {
    wx.setNavigationBarTitle({ title: userStore.currentBookName });
    await Promise.all([
      this.props.billListStore.fetchData(),
      this.props.billListStore.fetchTotalAmount(),
      this.props.budgetListStore.fetchData()
    ]);
  }
});
