// pages/personal/personal.js
let startY, moveY, distanceY
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {} // 用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户基本信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
    }
  },

  // 跳转至login
  toLogin: function () {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },

  // 动画效果
  handleTouchStart(e) {
    this.setData({
      coverTransition: ''
    })
    startY = e.touches[0].clientY
  },
  handleTouchMove(e) {
    moveY = e.touches[0].clientY
    distanceY = moveY - startY
    if (distanceY <= 0) {
      return
    }
    if (distanceY > 80) {
      distanceY = 80
    }
    this.setData({
      coverTransform: `translateY(${distanceY}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0)`,
      coverTransition: 'transform 1s linear'
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