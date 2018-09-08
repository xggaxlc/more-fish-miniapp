import { observer, checkCurrentBook, BillListStore, userStore, BillStore, BudgetListStore } from '@store';
import { autoLoading, goBack, showToast } from '@utils';

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

  async onLoad() {
    const billStore = this.props.billStore;
    if (billStore) {
      await billStore.fetchData();
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
  }
});
