import { computed, action, observable, IObservableArray, isObservableArray } from 'mobx'
import { WebAPIStore } from './web-api-store'
import { fetchAction } from './fetch-action'
import get from 'lodash-es/get';

export class Collection extends WebAPIStore {
  collection: any;
  params: Object = {}
  fetchApi: any;

  @observable
  meta = {
    page: 1,
    limit: 20,
    count: 0
  }

  data: IObservableArray<any> | Array<any> = []

  @fetchAction.merge
  async fetchData(options = {}) {
    const { data, meta } = await this.fetchApi({ page: 1, limit: this.meta.limit, ...this.params, ...options });
    return {
      meta,
      data: this.transformData(data)
    }
  }

  @fetchAction.merge
  async* fetchMoreData(options) {
    const { data, meta } = yield this.fetchApi({ page: +this.meta.page + 1, per_page: this.meta.limit, ...this.params, ...options });
    return {
      meta,
      data: [...this.data, ...this.transformData(data)]
    }
  }

  transformData(data) {
    return data;
  }

  findItemById(id) {
    return (this.data as any).find((item) => String(item._id || get(item, 'data._id')) === String(id));
  }

  findIndexById(id) {
    return (this.data as any).findIndex(item => String(item._id || get(item, 'data._id')) === String(id));
  }

  @action
  deleteItemById(id) {
    const index = this.findIndexById(id);
    if (index !== -1) {
      this.data.splice(index, 1) as any;
    }
  }

  @action
  resetData() {
    this.isFulfilled = false
    if (isObservableArray(this.data)) {
      this.data.clear();
    }
  }

  @computed
  get isEmpty() {
    return this.isFulfilled && this.data.length === 0
  }

  @computed
  get complete() {
    return this.isFulfilled && this.data.length >= this.meta.count
  }
}
