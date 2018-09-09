import { observable, computed, action } from 'mobx';
import { WebAPIStore, fetchAction, asyncAction } from './helper';
import { userStore } from './user-store';
import get from 'lodash-es/get';
import sumBy from 'lodash-es/sumBy';
import { BudgetStore } from '@store/budget-store';
import { fetch } from '@utils';

export class BudgetListStore extends WebAPIStore {
  @observable data = [];

  @fetchAction.merge
  async fetchData() {
    const { data: originData } = await fetch(`/books/${userStore.currentBookId}/budgets`);
    const data = originData.map(item => BudgetStore.createOrUpdate(item._id, { data: item }));
    return { data };
  }

  findIndexById(id) {
    return this.data.findIndex(item => String(item._id || get(item, 'data._id')) === String(id));
  }

  @action
  deleteItemById(id) {
    const index = this.findIndexById(id);
    if (index >= 0) {
      this.data.splice(index, 1);
    }
  }

  transformData(data) {
    return data.map(item => BudgetStore.createOrUpdate(item._id, { data: item }));
  }

  @computed
  get total() {
    return sumBy(this.data, item => item.data.amount).toFixed(2);
  }


  @asyncAction
  async* create(data) {
    const { data: { _id } } = yield fetch(`/books/${userStore.currentBookId}/budgets`, { method: 'POST', data });
    this.fetchData();
    return _id;
  }
}
