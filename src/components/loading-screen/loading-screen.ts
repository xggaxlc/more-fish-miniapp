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
    showAuth: false,
    showError: false,
    errorInfo: ''
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
        this.setData({ errorInfo: '', showRetry: false, showError: false, showAuth: false, loading: false });
      } catch (e) {
        const errorType = get(e, 'type', '');
        const errorMsg = get(e, 'message', '');
        const errorStatus = get(e, 'status');

        if (errorStatus === 403) {
          this.setData({ errorInfo: '没有权限', showError: true, showRetry: false, showAuth: false, loading: false });
        } else if (errorStatus === 404) {
          this.setData({ errorInfo: '资源不存在', showError: true, showRetry: false, showAuth: false, loading: false });
        } else if (errorType === 'userinfo') {
          this.setData({ errorInfo: '', showError: false, showRetry: false, showAuth: true, loading: false });
        } else {
          const setData = { errorInfo: '', showError: false, showRetry: true, showAuth: false, loading: false }
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
