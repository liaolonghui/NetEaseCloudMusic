// pages/songDetail/songDetail.js
import request from '../../utils/request'
// 先获取全局实例
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识音乐是否播放
    song: {}, // 歌曲详情对象
    musicId: '', //音乐ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 音乐id
    const ids = options.ids
    this.setData({
      musicId: ids
    })
    this.getSong(ids)

    // 判断当前音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }

    // 部署监听
    // 先创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onStop(() => {
      // 修改音乐播放的状态
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onPause(() => {
      // 修改音乐播放的状态
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onPlay(() => {
      // 修改音乐播放的状态
      this.changePlayState(true)
      // 修改全局播放状态（为了解决页面销毁后音乐播放状态的小bug）
      appInstance.globalData.musicId = musicId
    })

  },

  // 修改音乐播放的状态
  changePlayState (isPlay) {
    this.setData({
      isPlay
    })
    // 修改全局播放状态（为了解决页面销毁后音乐播放状态的小bug）
    appInstance.globalData.isMusicPlay = isPlay
  },


  // 获取歌曲详情对象
  async getSong (id) {
    const songData = await request('/song/detail', { ids: id })
    this.setData({
      song: songData.songs[0]
    })
    wx.setNavigationBarTitle({
      title: songData.songs[0].name,
    })
  },


  // 暂停或播放音乐的回调
  handlePlayOrPause () {
    const isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    this.musicControl(isPlay, this.data.musicId)
  },

  // 暂停/播放音乐的功能
  async musicControl (isPlay, musicId) {
    if (isPlay) { // 播
      let musicLinkData = await request('/song/url', { id: musicId })
      // 添加title，src
      this.backgroundAudioManager.src = musicLinkData.data[0].url
      this.backgroundAudioManager.title = this.data.song.name
    } else { // 停
      this.backgroundAudioManager.pause()
    }
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