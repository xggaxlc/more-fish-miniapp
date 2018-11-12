import { observer, billListStore, BillStore, budgetListStore } from '@store';
import { autoLoading, goBack } from '@utils';
import * as dayjs from 'dayjs';
import get from 'lodash-es/get';

observer({

  _needCurrentBookId: true,

  get props() {
    const billId = this.options.id;
    const stores: any = {
      billListStore,
      budgetListStore
    }
    if (billId) {
      stores.billStore = BillStore.findOrCreate(billId);
    }
    return stores;
  },

  data: {
    time: dayjs().format('YYYY-MM-DD'),
    budgetIndex: -1
  },

  async onLoad() {
    const { billStore, budgetListStore } = this.props;
    await budgetListStore.fetchData();
    if (billStore) {
      await billStore.fetchData();

      const budgetId = get(billStore, 'data.budget._id');
      let index = -1;
      budgetListStore.data.forEach((item, i) => {
        if (get(item, 'data._id') === budgetId) {
          index = i;
        }
      });
      this.setData({ budgetIndex: index, time: dayjs(billStore.data.time).format('YYYY-MM-DD') });
    }
  },

  async handleSubmit(e) {
    const body = e.detail.value;
    const billStore = this.props.billStore;

    if (billStore) {
      // 更新
      await autoLoading(billStore.update(body));
    } else {
      // 创建
      await autoLoading(this.props.billListStore.create(body));
    }
    goBack();
  },

  handleTimeChange(e) {
    this.setData({ time: e.detail.value });
  },

  handleSelectBudget(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ budgetIndex: index });
  }
});
