import { budgetListStore, settingStore } from '@store';
import { asyncAction, Collection, fetchAction } from './helper';
import { fetch } from '@utils';
import { observable, computed, action } from 'mobx';
import sumBy from 'lodash-es/sumBy';
import get from 'lodash-es/get';
import * as dayjs from 'dayjs';

function fromNow(time: string) {
  const today = dayjs(dayjs().format('YYYY-MM-DD'));
  const timeDate = dayjs(time).format('YYYY-MM-DD');
  const diffday = dayjs(today).diff(dayjs(timeDate), 'day');

  if (diffday < 1) {
    return '今天';
  }

  if (diffday < 2) {
    return '昨天';
  }

  if (diffday < 3) {
    return '前天';
  }

  return dayjs(time).format('D日');
}

class BillListStore extends Collection {

  @observable amountOfMonth = [];

  @observable form = {
    budget: '',
    user: ''
  }

  fetchApi = (params = {}) => fetch('/books/$$bookId/bills', { data: { ...this.form, ...settingStore.datePickerParams,  ...params } });
  @observable data = [];

  @action
  updateForm(body) {
    Object.assign(this.form, body);
  }

  @fetchAction.merge
  async fetchData(options = {}) {
    const params = { ...this.form, ...settingStore.datePickerParams, ...options };
    const [{ data, meta }, , { data: amountOfMonth }] = await Promise.all([
      this.fetchApi({ page: 1, limit: this.meta.limit, ...this.params, ...params }),
      budgetListStore.fetchData(params),
      fetch('/books/$$bookId/stat/getAmountGroupByDay', { data: params })
    ]);

    return {
      meta,
      data,
      amountOfMonth
    }
  }

  @computed
  get dataGroupByDate() {
    const data = this.amountOfMonth.map(amountItem => {
      const { _id: { year, month, date }, amount } = amountItem;
      const data = this.data.filter(item => {
        const timeObj = dayjs(item.time);
        return timeObj.year() === year && timeObj.month() === month - 1 && timeObj.date() === date;
      });
      return {
        amount,
        fromNow: fromNow(`${year}/${month}/${date}`),
        data
      }
    });
    return data.filter(item => item.data.length);
  }

  @computed
  get totalAmount() {
    return sumBy(this.amountOfMonth, item => item.amount);
  }

  @asyncAction
  async* create(body) {
    const { data } = yield fetch('/books/$$bookId/bills', { method: 'POST', data: { ...body, time: dayjs(body.time).toDate() } });
    this.refresh();
    return data;
  }

  refresh() {
    this.fetchData();
  }

  @computed
  get currentBudget() {
    const { budget } = this.form;
    return budget ? get(budgetListStore.data.find(item => String(item.data._id) === String(budget)), 'data.amount') : budgetListStore.total;
  }

  @computed
  get currentBill() {
    return this.totalAmount;
  }
}

export const billListStore = new BillListStore();
