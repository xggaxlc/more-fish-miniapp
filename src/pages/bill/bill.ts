import { observer, userStore, billListStore, uiStore, budgetListStore, settingStore } from '@store';
import { pullDownRefresh, autoLoading } from '@utils';
import * as dayjs from 'dayjs';

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
    params: {
      year: dayjs().year(),
      month: dayjs().month(),
      budget: ''
    },
    filter: {
      budget: ''
    },
    showFilter: false
  },

  async onLoad() {
    wx.setNavigationBarTitle({ title: userStore.currentBookName });
    await this.fetchData();
  },

  getParams() {
    const { params } = this.data;
    const $date = dayjs().set('year', params.year).set('month', params.month);
    return {
      budget: params.budget,
      start_at: $date.startOf('month').toISOString(),
      end_at: $date.endOf('month').toISOString()
    }
  },

  fetchData() {
    const params = this.getParams();
    return Promise.all([
      this.props.billListStore.fetchData(params),
      this.props.billListStore.fetchTotalAmount(params),
      this.props.budgetListStore.fetchData(params)
    ]);
  },

  onPullDownRefresh() {
    return pullDownRefresh(this.fetchData());
  },

  onReachBottom() {
    const params = this.getParams();
    const { billListStore } = this.props;
    return !billListStore.complete && billListStore.fetchMoreData(params);
  },

  handleDateChange(e) {
    const value = e.detail.value;
    const [yearStr, monthStr] = value.split('-');
    const year = +yearStr;
    const month = monthStr - 1;
    const currentParams = this.data.params;
    if (year !== currentParams.year || month !== currentParams.month) {
      this.setData({ 'params.year': year, 'params.month': month }, () => autoLoading(this.fetchData()));
    }
  },

  handleFilterBudget(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ 'filter.budget': id });
  },

  handleResetBudget() {
    this.setData({ 'filter.budget': '' });
  },

  handleApplyFilter() {
    this.setData({ showFilter: false, 'params.budget': this.data.filter.budget }, () => autoLoading(this.fetchData()));
  },

  toggleFilterBox() {
    const showFilter = !this.data.showFilter;
    const setData = { showFilter }
    if (showFilter) {
      setData['filter.budget'] = this.data.params.budget;
    }
    this.setData(setData);
  }
});
