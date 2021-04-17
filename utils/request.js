import config from './config'
export default (url, data={}, method="GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.mobileHost + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        // 如果是login请求就保存其cookie
        if (data.isLogin) {
          wx.setStorage({
            key: 'cookies',
            data: res.cookies,
          })
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}