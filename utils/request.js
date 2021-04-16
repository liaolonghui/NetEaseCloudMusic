import config from './config'
export default (url, data={}, method="GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
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