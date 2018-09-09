import { observable } from 'mobx';
import { WebAPIStore, fetchAction, asyncAction } from './helper';
import { fetch } from '@utils';
import { BillListStore } from './bill-list-store';
import { userStore } from './user-store';
import * as dayjs from 'dayjs';

export class BillStore extends WebAPIStore {
  @observable data = {};

  @fetchAction.merge
  async fetchData() {
    const { data } = await fetch(`/books/${userStore.currentBookId}/bills/${this.instanceKey}`);
    data.time_formated = dayjs(data.time).format('YYYY-MM-DD');
    data.create_at_formated = dayjs(data.create_at).format('YYYY-MM-DD HH:mm');
    data.update_at_formated = dayjs(data.update_at).format('YYYY-MM-DD HH:mm');
    data.amount_formated = data.amount.toFixed(2);
    return { data };
  }

  @asyncAction
  async* update(body: any = {}) {
    const { data } = yield fetch(`/books/${userStore.currentBookId}/bills/${this.instanceKey}`, { method: 'PUT', data: { ...body, time: dayjs(body.time).toDate() } });
    this.data = data;
  }

  async delete() {
    const id = this.instanceKey;
    await fetch(`/books/${userStore.currentBookId}/bills/${this.instanceKey}`, { method: 'DELETE' });
    const billListStore = BillListStore.findOrCreate(userStore.currentBookId);
    billListStore.fetchTotalAmount();
    billListStore.deleteItemById(id);
  }
}
