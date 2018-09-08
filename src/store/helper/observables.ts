import { observable } from 'mobx'
import forEach from 'lodash-es/forEach';

export function observables(properties, shallowList) {
  return target => {
    const { prototype } = target
    forEach(properties, (value, key: any) => {
      const result: any = observable(prototype, key, { initializer: () => value } as any)
      Object.defineProperty(prototype, key, result)
    })
    forEach(shallowList, (value, key) => {
      const result: any = observable.ref(prototype, key, { initializer: () => value } as any)
      Object.defineProperty(prototype, key, result)
    })
    Object.defineProperty(prototype, 'initialState', {
      enumerable: false,
      value: Object.assign({}, properties, shallowList),
    })
    return target
  }
}
