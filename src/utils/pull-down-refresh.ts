import { showToast } from "./show-toast";

export async function pullDownRefresh(fn) {
  wx.showNavigationBarLoading();
  try {
    await fn();
  } catch (e) {
    showToast('请求失败');
    throw e;
  } finally {
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  }
}
