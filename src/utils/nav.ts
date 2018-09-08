export function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

export function goHome() {
  wx.switchTab({ url: '/pages/bill/bill' });
}

export function goBack() {
  const canBack = getCurrentPages().length > 1;
  canBack ? wx.navigateBack() : goHome();
}

export function isCurrentPage(url) {
  const { route } = getCurrentPage();
  url = url.startsWith('/') ? url : `/${url}`;
  return url.indexOf(`/${route}`) !== -1;
}

export function goTo({ url = '', method = 'navigateTo', force = false } = {}) {
  const nav = () => {
    wx[method]({ url });
    return true;
  }
  if (force) {
    return nav();
  } else {
    return isCurrentPage(url) ? false : nav();
  }
}
