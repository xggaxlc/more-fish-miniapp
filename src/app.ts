// for core-js polyfill
const g = Function('return this')();
g.parseInt = parseInt;
g.parseFloat = parseFloat;
g.Promise = Promise;
g.Array = Array;
g.Math = Math;
g.Number = Number;
g.Object = Object;
g.Function = Function;
g.String = String;
g.RegExp = RegExp;
g.Symbol = Symbol;

require('core-js/modules/es7.promise.finally');
require('core-js/modules/es7.symbol.async-iterator');

import { clouldeEnv } from './utils/environment';

App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({ env: clouldeEnv })
    }
    this.globalData = {}
  }
});
