import { settingStore } from './../../store/setting-store';
import { observer, userStore, checkCurrentBook, BillListStore, uiStore, BudgetListStore } from '@store';
import { pullDownRefresh, autoLoading } from '@utils';

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
    await this.fetchData();
  },

  fetchData() {
    return Promise.all([
      this.props.billListStore.fetchData(),
      this.props.billListStore.fetchTotalAmount(),
      this.props.budgetListStore.fetchData()
    ]);
  },

  onPullDownRefresh() {
    return pullDownRefresh(this.fetchData());
  },

  onReachBottom() {
    const { billListStore } = this.props;
    return !billListStore.complete && billListStore.fetchMoreData();
  },
});
