import { observer, checkCurrentBook, BillListStore, userStore, BillStore, BudgetListStore } from '@store';
import { autoLoading, goBack, showToast } from '@utils';
import * as dayjs from 'dayjs';
import get from 'lodash-es/get';

observer({
  get props() {
    const billId = this.options.id;
    return checkCurrentBook()
      .then(() => {
        const stores: any = {
          userStore,
          billListStore: BillListStore.findOrCreate(userStore.currentBookId),
          budgetListStore: BudgetListStore.findOrCreate(userStore.currentBookId)
        }
        if (billId) {
          stores.billStore = BillStore.findOrCreate(billId);
        }
        return stores;
      });
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
    await showToast('保存成功');
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
