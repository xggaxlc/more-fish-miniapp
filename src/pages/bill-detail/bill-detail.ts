import { observer, checkCurrentBook, BillStore, userStore } from '@store';
import { showConfirmModal, autoLoading, goBack } from '@utils';
import './bill-detail.scss';

observer({
  get props() {
    return checkCurrentBook()
      .then(() => {
        return {
          userStore,
          billStore: BillStore.findOrCreate(this.options.id)
        }
      });
  },

  onLoad() {
    return this.props.billStore.fetchData();
  },

  async handleDelte() {
    await showConfirmModal('账单');
    await autoLoading(this.props.billStore.delete());
    goBack();
  }
});
