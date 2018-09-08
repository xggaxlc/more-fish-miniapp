import { observable } from 'mobx';
import { WebAPIStore, fetchAction, asyncAction } from './helper';
import { fetch } from '@utils';
import { BudgetListStore } from './budget-list-store';
import { userStore } from './user-store';

export class BudgetStore extends WebAPIStore {
  @observable data = {};

  @fetchAction.merge
  async fetchData() {
    return fetch(`/books/${userStore.currentBookId}/budgets/${this.instanceKey}`);
  }

  @asyncAction
  async* update(body = {}) {
    const { data } = yield fetch(`/books/${userStore.currentBookId}/budgets/${this.instanceKey}`, { method: 'PUT', data: body });
    this.data = data;
  }

  async delete() {
    const id = this.instanceKey;
    await fetch(`/books/${userStore.currentBookId}/budgets/${this.instanceKey}`, { method: 'DELETE' });
    const budgetListStore = BudgetListStore.findOrCreate(userStore.currentBookId);
    budgetListStore.deleteItemById(id);
  }
}
