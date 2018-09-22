import { wxPromise } from './../utils/wx-promise';
import { computed, observable, action } from 'mobx';
import { asyncAction } from './helper';
import * as dayjs from 'dayjs';

class UIStore {
  @observable systemInfo = wx.getSystemInfoSync();

  @asyncAction
  async* fetchData() {
    // 可能不同页面拿到的信息不一致（比如tab页的windowHeight和非tab页的windowHeight）
    const res = yield wxPromise.getSystemInfo();
    this.systemInfo = res;
    return res;
  }

  @action
  fetchDataSync() {
    const res = wx.getSystemInfoSync();
    this.systemInfo = res;
    return res;
  }

  /**
   * 判断两个版本字符串的大小
   * @param  {string} v1 原始版本
   * @param  {string} v2 目标版本
   * @return {number}    如果原始版本大于目标版本，则返回大于0的数值, 如果原始小于目标版本则返回小于0的数值。0当然是两个版本都相等拉。
   */
  compareVersion(v1, v2) {
    let _v1 = v1.split('.'),
        _v2 = v2.split('.'),
        _r = _v1[0] - _v2[0];
    return _r === 0 && v1 !== v2 ? this.compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.')) : _r;
  }

  // 判断可使用wx.openSetting
  @computed
  get canUseOpenSetting() {
    return this.compareVersion(this.systemInfo.SDKVersion, '2.0.7') < 0;
  }

  @computed
  get isIOS() {
    const { platform } = this.systemInfo;
    return platform.toUpperCase() === 'IOS';
  }

  @computed
  get isIphoneX() {
    const { screenHeight, screenWidth } = this.systemInfo;
    return this.isIOS && screenHeight / screenWidth === 2436 / 1125;
  }

  // 获取相对于iphone6的宽的比例
  @computed
  get scale() {
    const { screenWidth } = this.systemInfo;
    return screenWidth / 375;
  }

  @computed
  get currentMonth() {
    return dayjs().month() + 1;
  }

  @computed
  get currentYear() {
    return dayjs().year();
  }

  @computed
  get currentMonthWithYear() {
    return dayjs().format('YYYY-MM');
  }

  rpx2px(rpx) {
    return rpx / (750 / this.systemInfo.screenWidth);
  }

}

export const uiStore = new UIStore();
