// pages/search/search.js
import request from '../../utils/request'
let isSend = false // 该变量用于“节流”操作...
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    hotList: [],
    searchContent: '', // 搜索输入框的值（用bindinput方法同步更新）
    searchList: [], //模糊搜索到的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取placeholder和热搜榜数据
    this.getSearchData()
  },

  // 获取默认搜索和热搜榜数据
  async getSearchData () {
    const placeholderData = await request('/search/default')
    const hotData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotData.data
    })
  },

  // 输入框改变
  handleInputChange (event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })
    // 节流（性能优化）
    if (isSend) return // 如果isSend为true说明距离上一次请求还没有超过300ms（直接返回，不发请求）
    isSend = true
    // 发请求获取模糊匹配数据
    this.getSearchList()
    // 300ms后把isSend置为false（即允许发请求）
    setTimeout(() => {
      isSend = false
    }, 300)
  },
  // 发请求获取模糊匹配的数据
  async getSearchList () {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }
    const searchListData = await request('/search', { keywords: this.data.searchContent })
    this.setData({
      searchList: searchListData.result.songs
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