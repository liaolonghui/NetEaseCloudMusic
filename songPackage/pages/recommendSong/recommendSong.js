// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'

import request from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: '',
    day: '',
    recommendList: [],
    index: 0 // 用于标识点击的哪一个音乐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 是否登录
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    // 获取每日推荐的数据
    this.getRecommendList()
    // date
    this.setData({
      month: new Date().getMonth()+1,
      day: new Date().getDate()
    })

    // 订阅来自songDetail发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let { recommendList, index } = this.data // 把所有音乐的数组以及当前音乐标识拿出
      if (type === 'prev') {
        // 上一首
        index -= 1 // 要切换歌曲的下标
      } else {
        // 下一首
        index += 1 // 要切换歌曲的下标
      }
      // 如果index大于等于数组长度，则重置为0
      if (index >= recommendList.length) {
        index = 0
      }
      // 小于0则重置为数组长度-1
      if (index < 0) {
        index = recommendList.length - 1
      }
      let musicId = recommendList[index].id // 要切换音乐的id
      this.setData({ // 更新标识
        index
      })
      // 把音乐id回传给songDetail页面
      PubSub.publish('musicId', musicId)
    })
  },

  // 获取推荐数据
  async getRecommendList () {
    const recommendData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendData.recommend
    })
  },

  // 跳转至songDetail
  toSongDetail (e) {
    const {ids, index} = e.currentTarget.dataset // ids是音乐id，index是音乐下标
    // 更新当前音乐的标识
    this.setData({
      index
    })
    // 跳转
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?ids=' + ids,
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