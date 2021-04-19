// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'

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
    musicLink: '', //保存音乐链接
    currentTime: '00:00', // 已播放
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 进度条已播放长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 音乐id
    const musicId = options.ids
    this.setData({
      musicId
    })
    this.getSong(musicId)

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

    // 播放完自动下一首
    this.backgroundAudioManager.onEnded(() => {
      // 订阅来自recommendSong发布的musicId消息
      PubSub.subscribe('musicId', (msg, musicId) => {
        this.getSong(musicId)
        this.musicControl(true, musicId) // 因为是切换歌曲，所以要获取新的音乐url（不传入musicLink）
        // 结束完各种操作后取消订阅
        PubSub.unsubscribe('musicId')
      })
      // 发布消息给recommendSong页面
      PubSub.publish('switchType', 'next')
      // 重置一些信息
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })

    // 已播放时长
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 若现在的id和播放的id不同则不执行
      if (musicId !== appInstance.globalData.musicId) return
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
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
      song: songData.songs[0],
      durationTime: moment(songData.songs[0].dt).format('mm:ss')
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
    const { musicId, musicLink } = this.data
    this.musicControl(isPlay, musicId, musicLink) // 若musicLink是空串则会发请求获取音乐url
  },

  // 暂停/播放音乐的功能
  async musicControl (isPlay, musicId, musicLink) {
    if (isPlay) { // 播
      if (!musicLink) { // 如果没有传入musicLink或者为空串则说明需要发请求获取
        let musicLinkData = await request('/song/url', { id: musicId })
        musicLink = musicLinkData.data[0].url
        // 更新musicLink
        this.setData({
          musicLink
        })
      }
      // 添加title，src
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else { // 停
      this.backgroundAudioManager.pause()
    }
  },

  // 切换歌曲
  handleSwitch (e) {
    const type = e.target.id

    // 切换歌曲前先停止当前播放的音乐
    this.backgroundAudioManager.stop()

    // 订阅来自recommendSong发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      // 获取音乐信息
      this.getSong(musicId)
      // 自动播放
      this.musicControl(true, musicId) // 因为是切换歌曲，所以要获取新的音乐url（不传入musicLink）
      // 结束完各种操作后取消订阅
      PubSub.unsubscribe('musicId')
    })
    // 发布消息给recommendSong页面
    PubSub.publish('switchType', type)

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