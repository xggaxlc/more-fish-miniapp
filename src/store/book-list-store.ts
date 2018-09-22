import { Collection, asyncAction } from './helper';
import { fetch } from '@utils';
import { BookStore } from './book-store';
import { observable } from 'mobx';

class BookListStore extends Collection {

  fetchApi = (params = {}) => fetch('/books', { data: params })
  @observable data = [];

  transformData(data) {
    return data.map(item => BookStore.createOrUpdate(item._id, { data: item }));
  }

  @asyncAction
  async* create(data) {
    const { data: { _id } } = yield fetch('/books', { method: 'POST', data });
    this.fetchData();
    return _id;
  }
}

export const bookListStore = new BookListStore();
