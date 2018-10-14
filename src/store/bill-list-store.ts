import { budgetListStore } from '@store';
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
    year: dayjs().year(),
    month: dayjs().month(),
    budget: '',
    user: ''
  }

  fetchApi = (params = {}) => fetch('/books/$$bookId/bills', { data: { ...this.getParams(), ...params } });
  @observable data = [];

  @action
  updateForm(body) {
    Object.assign(this.form, body);
  }

  getParams() {
    const { year, month, budget, user } = this.form;
    const $time = dayjs().set('year', year).set('month', month);

    return {
      start_at: $time.startOf('month').toISOString(),
      end_at: $time.endOf('month').toISOString(),
      budget,
      user
    }
  }

  @fetchAction.merge
  async fetchData(options = {}) {
    const params = { ...this.getParams(), ...options };
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
        amount: (+amount).toFixed(2),
        fromNow: fromNow(`${year}/${month}/${date}`),
        data
      }
    });
    return data.filter(item => item.data.length);
  }

  @computed
  get totalAmount() {
    return sumBy(this.amountOfMonth, item => item.amount).toFixed(2);
  }

  @asyncAction
  async* create(body) {
    const { data } = yield fetch('/books/$$bookId/bills', { method: 'POST', data: { ...body, time: dayjs(body.time).toDate() } });
    if (dayjs(data.time).format('YYYY-MM') !== this.currentDate) {
      this.refresh();
    }
    return data;
  }

  refresh() {
    this.fetchData();
  }

  @computed
  get currentDate() {
    const { year, month } = this.form;
    const $time = dayjs().set('year', year).set('month', month);
    return $time.format('YYYY-MM');
  }

  @computed
  get currentBudgetTitle() {
    const { month } = this.form;
    return `${month + 1}月预算`;
  }

  @computed
  get currentBudget() {
    const { budget } = this.form;
    const amount = budget ? get(budgetListStore.data.find(item => String(item.data._id) === String(budget)), 'data.amount') : budgetListStore.total;
    return (+amount || 0).toFixed(2);
  }

  @computed
  get currentBillTitle() {
    const { month } = this.form;
    return `${month + 1}月支出`;
  }

  @computed
  get currentBill() {
    return this.totalAmount;
  }
}

export const billListStore = new BillListStore();
