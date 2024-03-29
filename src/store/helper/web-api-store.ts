/* eslint-disable no-console */
import { observable, toJS, computed, action } from 'mobx'
import { StoreHelper } from './store-helper'

export class WebAPIStore extends StoreHelper {
  @observable isFetching = false
  @observable isRejected = false
  @observable isFulfilled = false
  @observable error: Error = null

  fetchData(options?: any) {}

  @action
  setPendingState(actionName) {
    this.isFetching = true
    this.logMessage('%cpending  ', 'color:blue', actionName)
  }

  @action
  setFulfilledState(newState, actionName) {
    Object.assign(this, {
      isFetching: false,
      isRejected: false,
      isFulfilled: true,
      error: null,
    }, newState)
    this.logMessage('%cfulfilled', 'color:green', actionName)
  }

  @action
  setRejectedState(error, actionName, options: any = {}) {
    const nextState = {
      error,
      isFetching: false,
      isRejected: true,
    }
    Object.assign(this, nextState, options)
    this.logMessage('%crejected', 'color:red', actionName)
  }

  tryFetchData() {
    return this.instanceKey && !this.isFulfilled && this.fetchData()
  }

  logMessage(status, color, actionName) {
    const IS_PRODUCTION = false;
    if (!IS_PRODUCTION) {
      console.log(
        status,
        color,
        `${this.constructor.name.replace(/^\w/, w => w.toLowerCase())}->${actionName}`,
        { state: toJS(this) },
      )
    }
  }

  loadingAll(...webAPIStores: WebAPIStore[]) {
    return this.loading || !!webAPIStores.find(item => item.loading)
  }

  @computed
  get loading() {
    return this.isFetching
  }
}
