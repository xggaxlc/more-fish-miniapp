import { autorun, isObservable, toJS } from 'mobx'
import merge from 'lodash-es/merge';
import forEach from 'lodash-es/forEach';
import activate from './activate'

export function observer(options: any = {}, ...args) {
  const { onLoad, onHide, onShow, onUnload } = options
  const propsDescriptor = Object.getOwnPropertyDescriptor(options, 'props')
  Object.defineProperty(options, 'props', { value: null })

  const observerOptions = {
    autoRunList: [],

    cloneProp(key, value) {
      this.setData({ [key]: toJS(value) })
    },

    setAutoRun() {
      Object.keys(this.props).forEach(propName => {
        const prop = this.props[propName]
        if (isObservable(prop)) {
          activate(prop)
          this.autoRunList.push(autorun(() => this.cloneProp(propName, prop)))
        } else {
          forEach(prop, (value, key) => {
            activate(value)
            this.autoRunList.push(autorun(() => this.cloneProp(`${propName}.${key}`, value)))
          })
        }
      })
    },

    clearAutoRun() {
      this.autoRunList.forEach(func => func())
      this.autoRunList = []
    },

    onLoad() {
      return this.afterLoad = (async() => {
        Object.defineProperty(this, 'props', propsDescriptor)
        Object.defineProperty(this, 'props', { value: this.props, writable: true })
        if (this.props instanceof Promise) {
          const result = await this.props;
          this.props = result
        }
        this.setAutoRun()
        return onLoad && onLoad.call(this, this.options)
      })()
    },

    onShow() {
      this.autoRunList.length === 0 && this.setAutoRun()
      onShow && onShow.call(this)
    },

    onUnload() {
      this.clearAutoRun()
      onUnload && onUnload.call(this)
    },

    onHide() {
      this.clearAutoRun()
      onHide && onHide.call(this)
    },
  }

  return Page(merge(options, ...args, observerOptions))
}
