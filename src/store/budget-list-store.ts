import { observable, computed, action } from 'mobx';
import { WebAPIStore, fetchAction, asyncAction } from './helper';
import get from 'lodash-es/get';
import sumBy from 'lodash-es/sumBy';
import { BudgetStore } from './budget-store';
import { fetch } from '@utils';
import * as dayjs from 'dayjs';

class BudgetListStore extends WebAPIStore {
  @observable data = [];

  @observable form = {
    year: dayjs().year(),
    month: dayjs().month()
  }

  getParams() {
    const { year, month } = this.form;
    const $time = dayjs().set('year', year).set('month', month);

    return {
      start_at: $time.startOf('month').toISOString(),
      end_at: $time.endOf('month').toISOString()
    }
  }

  @action
  updateForm(body) {
    Object.assign(this.form, body);
  }

  @fetchAction.merge
  async fetchData(params = {}) {
    const { data: originData } = await fetch('/books/$$bookId/budgets', { data: { ...this.getParams(), ...params } });
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
    const { data: { _id } } = yield fetch('/books/$$bookId/budgets', { method: 'POST', data });
    this.fetchData();
    return _id;
  }

  @computed
  get currentDate() {
    const { year, month } = this.form;
    const $time = dayjs().set('year', year).set('month', month);
    return $time.format('YYYY-MM');
  }
}

export const budgetListStore = new BudgetListStore();
