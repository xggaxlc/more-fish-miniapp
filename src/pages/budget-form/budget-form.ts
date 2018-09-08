import { observer, BudgetListStore, BudgetStore, checkCurrentBook, userStore } from '@store';
import { autoLoading, goBack, showToast } from '@utils';
import './budget-form.scss';

observer({
  get props() {
    const budgetId = this.options.id;
    return checkCurrentBook()
      .then(() => {
        const stores: any = {
          userStore,
          budgetListStore: BudgetListStore.findOrCreate(userStore.currentBookId)
        }
        if (budgetId) {
          stores.budgetStore = BudgetStore.findOrCreate(budgetId);
        }
        return stores;
      })
  },

  async onLoad() {
    const budgetStore = this.props.budgetStore;
    if (budgetStore) {
      await budgetStore.fetchData();
    }
  },

  async handleSubmit(e) {
    const body = e.detail.value;
    const budgetStore = this.props.budgetStore;

    if (budgetStore) {
      // 更新
      await autoLoading(budgetStore.update(body));
    } else {
      // 创建
      await autoLoading(this.props.budgetListStore.create(body));
    }
    await showToast('保存成功');
    goBack();
  }
});
