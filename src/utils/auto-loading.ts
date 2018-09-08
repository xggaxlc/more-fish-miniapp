import noop from 'lodash-es/noop';

async function loading(promise: Promise<any> | Function = noop, title = '加载中', successMessage = '', failMessage = '', showLoading = true): Promise<any> {
  const mask = true
  try {
    showLoading && await wx.showLoading({ title, mask })
    const res = await promise
    wx.hideLoading()
    if (successMessage) wx.showToast({ title: successMessage, icon: 'success' })
    return res
  } catch (err) {
    wx.hideLoading()
    if (!err.message.startsWith('ignore')) {
      wx.showModal({
        title: '错误',
        content: failMessage || err.message,
        showCancel: false,
        confirmColor: '#E0B44F',
        confirmText: '知道了',
      })
    }
    throw err
  }
}

function loadingDecorator({ title = '', successMessage = '', failMessage = '', showLoading = true } = {}) {
  return function (target?, name?, descriptor?: any) {
    const func = descriptor.value
    descriptor.value = function () {
      return loading(func.apply(this, arguments), title, successMessage, failMessage, showLoading)
    }
    descriptor.enumerable = true
    return descriptor
  }
}

export function autoLoading(...args) {
  if (args[0] instanceof Promise) {
    return loading(...args)
  } else if (args.length === 3) {
    return loadingDecorator()(...args)
  } else {
    return loadingDecorator(args[0])
  }
}
