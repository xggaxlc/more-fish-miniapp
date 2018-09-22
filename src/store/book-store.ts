import { fetch } from '@utils';
import { WebAPIStore, fetchAction, asyncAction } from './helper';
import { bookListStore } from './book-list-store';
import { userStore } from './user-store';
import { computed, observable } from 'mobx';
import chunk from 'lodash-es/chunk';
import * as dayjs from 'dayjs';

export class BookStore extends WebAPIStore {

  @observable data: any = {
    users: [],
    create_user: {}
  }

  @fetchAction.merge
  async fetchData() {
    return fetch(`/books/${this.instanceKey}`);
  }

  @computed
  get userIsMember() {
    const user = this.data.users
      .find((user: any) => String(user._id) === String(userStore.data._id));
    return !!user;
  }

  @computed
  get userIsCreator() {
    return String(this.data.create_user._id) === String(userStore.data._id);
  }

  @computed
  get chunkedUsers() {
    return chunk(this.data.users, 4);
  }

  @computed
  get createAtFormated() {
    return dayjs(this.data.create_at).format('YYYY-MM-DD');
  }

  // 确认加入账本
  @asyncAction
  async* joinBook() {
    const { data } = yield fetch(`/books/${this.instanceKey}/join`, { method: 'PUT' });
    this.data = data;
  }

  // 删除成员
  deleteBookMember(id) {
    const userIds = this.data.users.map(item => item._id);
    const index = userIds.findIndex(userId => String(userId) === String(id));
    if (index !== -1) {
      userIds.splice(index, 1);
      return this.updateBook({ users: userIds });
    }
  }

  // 退出账本
  exitBook() {
    return fetch(`/books/${this.instanceKey}/exit`, { method: 'PUT' });
  }

  @asyncAction
  async* updateBook(body = {}) {
    const id = this.instanceKey;
    const { data } = yield fetch(`/books/${id}`, { method: 'PUT', data: body });
    this.data = data;
  }

  // 删除账本
  async deleteBook() {
    const id = this.instanceKey;
    await fetch(`/books/${id}`, { method: 'DELETE' });
    bookListStore.deleteItemById(id);
  }
}
