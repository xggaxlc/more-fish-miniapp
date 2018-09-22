import { WebAPIStore } from './helper';
import { fetch } from '@utils';

class StatStore extends WebAPIStore {
  async getBudgetGroupByMonth(params?: { type: string, value: number }) {
    const data = await fetch('/books/$$bookId/stat/getAmountGroupByBudgetName', { data: params });
  }
}

export const statStore = new StatStore();
