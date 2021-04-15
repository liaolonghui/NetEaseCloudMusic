// index.js
import request from '../../utils/request'
// 获取应用实例
const app = getApp()

Page({
  data: {
    bannerList: [],
    recommendList: []
  },

  onLoad: async function (options) {
    const bannerData = await request('/banner', {type: 2})
    this.setData({
      bannerList: bannerData.banners
    })
    // 获取推荐歌单数据
    const recommendData = await request('/personalized', {limit: 10})
    this.setData({
      recommendList: recommendData.result
    })
  },

})
