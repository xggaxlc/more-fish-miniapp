import { flow } from 'mobx'
import has from 'lodash-es/has';
import { autobind } from 'core-decorators';
import { WebAPIStore } from './web-api-store'

function fetchActionDecorator(target, name, descriptor, { bound = false, autoMerge = false, useFlow = false } = {}) {
  const { value } = descriptor
  if (typeof value !== 'function') throw new Error(`${name} is not a function`)
  const oldAction = useFlow ? flow(value) : value

  descriptor.value = async function(...args) {
    const self: WebAPIStore = this
    try {
      self.setPendingState(name)
      const res = await oldAction.apply(self, args)
      if (autoMerge) {
        const newState = has(res, 'statusCode') ? res.data : res;
        self.setFulfilledState(newState, name)
      }
      return res
    } catch (err) {
      self.setRejectedState(err, name)
      throw err
    }
  }

  return bound ? autobind(target, name, descriptor) : descriptor
}

function fetchActionDecoratorCreate(options: Object) {
  return (...args) => fetchActionDecorator(args[0], args[1], args[2], options)
}


export const fetchAction: any = (...args) => {
  if (args.length === 3) {
    return fetchActionDecorator(args[0], args[1], args[2])
  } else {
    return fetchActionDecoratorCreate(args[0])
  }
}

fetchAction.bound = fetchActionDecoratorCreate({ bound: true })
fetchAction.flow = fetchActionDecoratorCreate({ bound: true, useFlow: true })
fetchAction.merge = fetchActionDecoratorCreate({ autoMerge: true })
