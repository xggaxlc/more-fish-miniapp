import { debounce, forEach } from 'lodash-es';

function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

class StorageParent {
  name: any;
  data: any;
  isArrayData: boolean;
  duration: any;
  overdueData: {};

  constructor(name, { isArrayData = false, duration }) {
    this.name = name;
    const data = wx.getStorageSync(name);
    this.data = data || (isArrayData ? [] : {});
    this.isArrayData = isArrayData;
    this.duration = duration;
    this.overdueData = this.checkOverdue();
  }

  set(key, data) {
    this.data[key] = {
      val: data,
      time: Date.now(),
    };
    this.saveStorage();
  }

  get(key) {
    const data = this.data[key];
    return data ? data.val : null;
  }

  remove(key) {
    if (key in this.data) {
      const data = this.data[key];
      delete this.data[key];
      this.saveStorage();
      return data;
    }
  }

  clear() {
    this.data = this.isArrayData ? [] : {};
    wx.removeStorageSync(this.name);
  }

  saveStorage = debounce(() => {
    wx.setStorageSync(this.name, this.data);
  }, 100)

  // 检查过期
  checkOverdue() {
    const { duration, isArrayData } = this;
    if (!duration) { return false; }
    const newData = isArrayData ? [] : {};
    const overdueData = isArrayData ? [] : {};
    forEach(this.data, (value, key) => {
      const startTime = value.time;
      if ((Date.now() - startTime) < this.duration) {
        isArrayData ? (newData as Array<any>).push(value) : newData[key] = value;
      } else {
        isArrayData ? (overdueData as Array<any>).push(value) : overdueData[key] = value;
      }
    });
    this.data = newData;
    this.saveStorage();
    return overdueData;
  }
}

export class Storage extends StorageParent {
  constructor(name = getCurrentPage().route, duration) {
    super(`__LS_${name}`, { duration });
  }
}

export class ArrayStorage extends StorageParent {
  isRepeat: any;
  maxLength: number;
  constructor(name = getCurrentPage().route, { maxLength = 0, duration = 0, isRepeat = true } = {}) {
    super(`__LS_ARRAY_${name}`, { duration, isArrayData: true });
    this.maxLength = maxLength || Infinity;
    this.isRepeat = isRepeat;
    this.initMethods();
  }

  initMethods() {
    [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse',
    ].map(method => {
      this[method] = (...ags) => {
        let newData = {
          val: ags[0],
          time: Date.now(),
        };
        if (method === 'push' || method === 'unshift') {
          this.data[method](newData);
        }
        if (method === 'splice') {
          newData.val = ags[2];
          this.data[method](ags[0], ags[1], newData);
        }
        if (method === 'pop' || method === 'shift') {
          newData = this.data[method](ags);
        }
        if (method === 'sort' || method === 'reverse') {
          this.data[method](ags);
        }
        !this.isRepeat && this.deduplication();
        this.data.splice(this.maxLength);
        this.saveStorage();
        return newData && newData.val;
      };
    });
  }

  get() {
    return this.data.map(item => item.val);
  }

  deduplication() {
    const obj = {};
    const newData = []; // 因为 对象无法保证数组的顺序，所以使用一个新数组保存
    this.data.map(item => {
      if (!obj[item.val]) {
        newData.push(item);
        obj[item.val] = item;
      }
    });
    this.data = newData;
    this.saveStorage();
  }
}
