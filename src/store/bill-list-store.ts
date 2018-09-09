import { Collection } from '@store/helper';
import { asyncAction, fetchAction } from './helper';
import { fetch } from '@utils';
import { observable, computed } from 'mobx';
import sumBy from 'lodash-es/sumBy';
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

// instanceKey => currentBook._id
export class BillListStore extends Collection {

  @observable amountOfMonth = [];

  fetchApi = (params = {}) => fetch(`/books/${this.instanceKey}/bills`, { data: params })
  @observable data = [];

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
    return sumBy(this.amountOfMonth, item => item.amount).toFixed(2);
  }

  @asyncAction
  async* fetchTotalAmount() {
    const { data } = yield fetch(`/books/${this.instanceKey}/stat/getAmountGroupByDay`);
    this.amountOfMonth = data;
  }

  @asyncAction
  async* create(body) {
    const { data } = yield fetch(`/books/${this.instanceKey}/bills`, { method: 'POST', data: { ...body, time: dayjs(body.time).toDate() } });
    this.fetchData();
    this.fetchTotalAmount();
    return data;
  }
}
