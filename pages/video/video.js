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
    videoUpdateTime: [], // 所有视频已播放时长
    isTriggered: false, // 是否触发下拉刷新（样式）
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
    // 获取导航列表数据
    this.getNavList()
  },

  // 去搜索页
  toSearch () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
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
    // 隐藏loading
    wx.hideLoading()
    let index = 0
    while (index < videoListData.datas.length) {
      videoListData.datas[index].id = index++
    }
    // 更新视频数据  并且关闭下拉刷新（样式）
    this.setData({
      videoList: videoListData.datas,
      isTriggered: false
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
    // 判断当前的视频是否有播放记录
    const {videoUpdateTime} = this.data
    const videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  // 记录视频已播放时长
  handleTimeUpdata (e) {
    const videoTimeObj = { vid: e.currentTarget.id, currentTime: e.detail.currentTime }
    const {videoUpdateTime} = this.data
    const videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem){
      videoItem.currentTime = videoTimeObj.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    // 更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束
  handleEnd (e) {
    // 移除videoUpdateTime当前播放视频的对象
    const { videoUpdateTime } = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.id === e.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },

  // 自定义下拉刷新
  handleRefresher () {
    this.getVideoList(this.data.navIndex)
  },

  // 自定义下拉加载
  handleToLower () {
    console.log('下拉')
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
  onShareAppMessage: function ({from}) {
    if (from === 'button') {
      return {
        title: '来自button的转发',
        path: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    } else {
      return {
        title: '来自menu的转发',
        path: '/pages/video/video'
      }
    }
  }
})