import { get } from 'lodash';

Component({
  properties: {
    coverView: {
      type: Boolean,
      value: false
    }
  },

  data: {
    show: true,
    showError: false,
  },

  ready() {
    const currentPage = this.getCurrentPage();
    if (!currentPage.afterLoad) {
      return this.setData({ show: false });
    }
    this.handleLoad(currentPage.afterLoad);
  },

  methods: {

    preventTouchmove() {
      // 阻止滚动穿透
    },

    getCurrentPage() {
      const pages = getCurrentPages();
      return pages[pages.length - 1];
    },

    async handleLoad(promise) {
      wx.showLoading({ title: '加载中...', mask: true });
      try {
        await promise;
        this.setData({ showError: false, show: false });
      } catch (e) {
        // ignore错误不显示“点击屏幕重新加载”
        if (!get(e, 'message', '').startsWith('ignore')) {
          this.setData({ showError: true, show: true });
        }
        throw e;
      } finally {
        wx.hideLoading();
      }
    },

    handleRetry() {
      const currentPage = this.getCurrentPage();
      this.handleLoad(currentPage.onLoad());
    }
  }
});
