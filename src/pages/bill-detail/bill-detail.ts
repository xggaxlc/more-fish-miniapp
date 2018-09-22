import { observer, BillStore } from '@store';
import { showConfirmModal, autoLoading, goBack } from '@utils';

observer({

  _needCurrentBookId: true,

  get props() {
    return {
      billStore: BillStore.findOrCreate(this.options.id)
    }
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
