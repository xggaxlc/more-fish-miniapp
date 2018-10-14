import { observer, userStore, billListStore, uiStore, budgetListStore, settingStore } from '@store';
import { pullDownRefresh, autoLoading } from '@utils';

observer({

  _needCurrentBookId: true,

  props: {
    settingStore,
    uiStore,
    userStore,
    billListStore,
    budgetListStore
  },

  data: {
    filter: {
      budget: ''
    },
    showFilter: false
  },

  async onLoad() {
    wx.setNavigationBarTitle({ title: userStore.currentBookName });
    await this.fetchData();
  },

  fetchData() {
    return billListStore.fetchData();
  },

  onPullDownRefresh() {
    return pullDownRefresh(this.fetchData());
  },

  onReachBottom() {
    const { billListStore } = this.props;
    return !billListStore.complete && billListStore.fetchMoreData();
  },

  handleDateChange() {
    autoLoading(this.fetchData());
  },

  handleFilterBudget(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ 'filter.budget': id });
  },

  handleResetBudget() {
    this.setData({ 'filter.budget': '' });
  },

  handleApplyFilter() {
    billListStore.updateForm(this.data.filter);
    this.setData({ showFilter: false }, () => autoLoading(this.fetchData()));
  },

  toggleFilterBox() {
    const showFilter = !this.data.showFilter;
    const setData = { showFilter }
    if (showFilter) {
      setData['filter.budget'] = billListStore.form.budget;
      setData['filter.user'] = billListStore.form.user;
    }
    this.setData(setData);
  }
});
