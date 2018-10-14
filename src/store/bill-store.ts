import { observable, computed } from 'mobx';
import { WebAPIStore, fetchAction, asyncAction } from './helper';
import { fetch } from '@utils';
import { billListStore } from './bill-list-store';
import * as dayjs from 'dayjs';

export class BillStore extends WebAPIStore {

  @observable data: { [key: string]: any } = {};

  @fetchAction.merge
  async fetchData() {
    return fetch(`/books/$$bookId/bills/${this.instanceKey}`);
  }

  @computed
  get amount_formated() {
    if (!this.data.amount) return '';
    return this.data.amount.toFixed(2);
  }

  @computed
  get time_formated() {
    if (!this.data.time) return '';
    return dayjs(this.data.time).format('YYYY-MM-DD');
  }

  @computed
  get create_at_formated() {
    if (!this.data.create_at) return '';
    return dayjs(this.data.create_at).format('YYYY-MM-DD');
  }

  @computed
  get update_at_formated() {
    if (!this.data.update_at) return '';
    return dayjs(this.data.update_at).format('YYYY-MM-DD');
  }

  @asyncAction
  async* update(body: any = {}) {
    const { data } = yield fetch(`/books/$$bookId/bills/${this.instanceKey}`, { method: 'PUT', data: { ...body, time: dayjs(body.time).toDate() } });
    this.data = data;
    billListStore.refresh();
  }

  async delete() {
    this.instanceKey;
    await fetch(`/books/$$bookId/bills/${this.instanceKey}`, { method: 'DELETE' });
    billListStore.refresh();
  }
}
