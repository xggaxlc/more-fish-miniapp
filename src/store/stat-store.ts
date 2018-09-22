import { WebAPIStore, fetchAction } from './helper';
import { fetch } from '@utils';
import { observable } from 'mobx';

class StatStore extends WebAPIStore {

  @observable data = [];

  @fetchAction.merge
  getBudgetGroupByMonth(params?: { type: string, value: number }) {
    return fetch('/books/$$bookId/stat/getAmountGroupByBudgetName', { data: params });
  }
}

export const statStore = new StatStore();
