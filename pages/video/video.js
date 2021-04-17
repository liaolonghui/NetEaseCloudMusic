// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [], // 导航列表
    navIndex: 0, // 当前nav标志
    videoList: [], // 视频列表
    videoId: '', // 当前音乐标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航列表数据
    this.getNavList()
  },

  // 获取导航列表
  async getNavList () {
    const navListData = await request('/video/group/list')
    this.setData({
      navList: navListData.data.slice(0, 14), // 只要14个
      navIndex: navListData.data[0].id
    })
    // 获取视频列表数据
    this.getVideoList(this.data.navIndex)
  },
  // 获取视频信息
  async getVideoList (id) {
    const videoListData = await request('/video/group', { id })
    wx.hideLoading()
    let index = 0
    while (index < videoListData.datas.length) {
      videoListData.datas[index].id = index++
    }
    this.setData({
      videoList: videoListData.datas
    })
  },
  // 改变navIndex
  changeNav (e) {
    const id = e.currentTarget.id
    this.setData({
      navIndex: id>>>0,
      videoList: []
    })
    // 获取更新的视频数据
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navIndex)
  },

  // 播放视频时暂停上一个视频(且两视频不是同一个时)
  handlePlay (event) {
    const vid = event.currentTarget.id
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    this.videoContext.play()
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