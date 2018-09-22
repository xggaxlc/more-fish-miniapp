import { wxPromise } from '@utils';
export function showToast(title, duration = 1500) {
  return new Promise(async resolve => {
    await wxPromise.showToast({ title, duration, icon: 'none' })
    setTimeout(resolve, duration)
  })
}
