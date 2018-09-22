import { observer, userStore, billListStore, uiStore, budgetListStore, settingStore } from '@store';
import { pullDownRefresh } from '@utils';

observer({

  _needCurrentBookId: true,

  props: {
    settingStore,
    uiStore,
    userStore,
    billListStore,
    budgetListStore
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
