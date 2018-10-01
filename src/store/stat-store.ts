import { WebAPIStore, fetchAction } from './helper';
import { fetch } from '@utils';
import { observable, action, computed } from 'mobx';
import * as dayjs from 'dayjs';
import sumby from 'lodash-es/sumBy';

class StatStore extends WebAPIStore {

  @observable form = {
    yearMode: true,
    year: dayjs().year(),
    month: dayjs().month()
  }

  @observable data = [];

  @fetchAction.merge
  fetchData() {
    return fetch('/books/$$bookId/stat/getAmountGroupByBudgetName', { data: this.getParams() });
  }

  @action
  updateForm(body) {
    Object.assign(this.form, body);
  }

  getParams() {
    const { yearMode, year, month } = this.form;
    if (yearMode) {
      const $time = dayjs().set('year', year);
      return {
        start_at: $time.startOf('year').toISOString(),
        end_at: $time.endOf('year').toISOString(),
      }
    } else {
      const $time = dayjs().set('year', year).set('month', month);
      return {
        start_at: $time.startOf('month').toISOString(),
        end_at: $time.endOf('month').toISOString(),
      }
    }
  }

  @computed
  get budgetTitle() {
    const { yearMode, year, month } = this.form;
    return yearMode ? `${year}年预算` : `${month + 1}月预算`;
  }

  @computed
  get billTitle() {
    const { yearMode, year, month } = this.form;
    return yearMode ? `${year}年支出` : `${month + 1}月支出`;
  }

  @computed
  get datePickerValue() {
    const { yearMode, year, month } = this.form;
    const $time = dayjs().set('year', year).set('month', month);
    return $time.format(yearMode ? 'YYYY' : 'YYYY-MM');
  }

  @computed
  get billAmount() {
    return sumby(this.data, 'amount');
  }

  @computed
  get budgetAmount() {
    return sumby(this.data, 'budget_amount');
  }

}

export const statStore = new StatStore();
