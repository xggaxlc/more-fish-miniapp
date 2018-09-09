import get from 'lodash-es/get';

Component({
  properties: {
    coverView: {
      type: Boolean,
      value: false
    }
  },

  data: {
    loading: true,
    showRetry: false,
    showAuth: false
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
      this.setData({ loading: true });
      wx.showLoading({ title: '加载中...', mask: true });
      try {
        await promise;
        this.setData({ showRetry: false, showAuth: false, loading: false });
      } catch (e) {
        const errorType = get(e, 'type', '');
        const errorMsg = get(e, 'message', '');

        if (errorType === 'userinfo') {
          this.setData({ showRetry: false, showAuth: true, loading: false });
        } else {
          const setData = { showRetry: true, showAuth: false, loading: false }
          if (errorType === 'ignore' || errorMsg.startsWith('ignore')) {
            // ignore错误不显示“点击屏幕重新加载”
            setData.loading = true;
          }
          this.setData(setData);
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
