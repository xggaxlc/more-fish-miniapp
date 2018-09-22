import { observable } from 'mobx';
import { WebAPIStore, fetchAction, asyncAction } from './helper';
import { fetch } from '@utils';
import { budgetListStore } from './budget-list-store';

export class BudgetStore extends WebAPIStore {
  @observable data = {};

  @fetchAction.merge
  async fetchData() {
    return fetch(`/books/$$bookId/budgets/${this.instanceKey}`);
  }

  @asyncAction
  async* update(body = {}) {
    const { data } = yield fetch(`/books/$$bookId/budgets/${this.instanceKey}`, { method: 'PUT', data: body });
    this.data = data;
  }

  async delete() {
    const id = this.instanceKey;
    await fetch(`/books/$$bookId/budgets/${this.instanceKey}`, { method: 'DELETE' });
    budgetListStore.deleteItemById(id);
  }
}
