import config from './config'
export default (url, data={}, method="GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.mobileHost + url,
      data,
      method,
      success: ({data}) => {
        resolve(data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}