import { uiStore } from '@store';
import get from 'lodash-es/get';

Component({
  properties: {
    bgColor: {
      type: 'String',
      value: 'transparent'
    },

    showFooter: {
      type: Boolean,
      value: true,
      observer: function(newVal) {
        newVal && this.calcHeight();
      }
    },

    useContentHeight: {
      type: Boolean,
      value: false
    }
  },

  options: {
    multipleSlots: true
  },

  data: {
    height: 0,
    contentHeight: uiStore.systemInfo.windowHeight,
    showButton: true,
    iphoneXPadding: uiStore.isIphoneX ? 32 : 0 // rpx
  },

  systemInfo: null,

  ready() {
    const { showFooter } = this.properties;
    showFooter && this.calcHeight();
    this.triggerEvent('iphoneXPadding', this.data.iphoneXPadding);
  },

  methods: {

    async getSystemInfo() {
      try {
        const systemInfo = await uiStore.fetchData();
        this.systemInfo = systemInfo;
        return systemInfo;
      } catch (e) {
        this.systemInfo = uiStore.fetchDataSync();
      }
    },

    calcHeight() {
      wx.createSelectorQuery()
        .in(this)
        .select('#footer')
        .boundingClientRect(async (res) => {
          const height = get(res, 'height', 0);
          if (!this.systemInfo) {
            await this.getSystemInfo();
          }
          this.setData({ height, contentHeight: this.systemInfo.windowHeight - height });
        })
        .exec();
    }
  }
});
