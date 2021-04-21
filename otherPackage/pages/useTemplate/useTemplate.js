// pages/useTemplate/useTemplate.js
import request from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      username: '我是假用户',
      age: '18'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取openid
  handleGetOpenId () {
    // 获取登录凭证
    wx.login({
      success: async (res) => { // res.code  res.errMsg
        // 将登陆凭证发给服务端
        const token = await request('/getOpenId', {code: res.code}) // 会返回由openid以及用户信息所生成的token
        console.log(token)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})