import { flow } from 'mobx'
import { autobind } from 'core-decorators'

export function asyncAction(target, name, descriptor) {
  const oldAction = descriptor.value
  if (typeof oldAction !== 'function') throw new Error(`${name} is not a function`)
  descriptor.value = flow(oldAction)
  return autobind(target, name, descriptor)
}
