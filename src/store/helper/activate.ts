import forEach from 'lodash-es/forEach';
import { isObservable } from 'mobx';

export default function activate(store) {
  isObservable(store);
  const descriptors = Object.getOwnPropertyDescriptors(store)

  forEach(descriptors, (descriptor, name) => {
    if (descriptor.get && !descriptor.enumerable) {
      descriptor.enumerable = true
      Object.defineProperty(store, name, descriptor)
    }
  })
}
