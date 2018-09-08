// wx.api 转 promise
const wxApis = [
  'request',
  'showToast',
  'login',
  'checkSession',
  'chooseImage',
  'canvasToTempFilePath',
  'previewImage',
  'getImageInfo',
  'showLoading',
  'getSystemInfo',
  'uploadFile',
  'downloadFile',
  'requestPayment',
  'hideShareMenu',
  'getUserInfo',
  'showModal',
  'setNavigationBarTitle',
  'getSetting',
  'showActionSheet'
]

wxApis.forEach(name => {
  const func = wx[name]
  if (typeof func !== 'function') {
    throw new Error(`wx.${name} is not a function`)
  }
  Object.defineProperty(wx, name, {
    value(options = {}): Promise<any> {
      return new Promise((resolve, reject) => {
        const { success, fail, complete } = options as any
        func({
          ...options,
          success: res => {
            resolve(res)
            success && success(res)
          },
          fail: err => {
            reject(new Error(err.errMsg))
            fail && fail(err)
          },
          complete,
        })
      })
    },
  })
})
