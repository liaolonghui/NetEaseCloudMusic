// index.js
import request from '../../utils/request'
// 获取应用实例
const app = getApp()

Page({
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  onLoad: async function (options) {
    // banner
    const bannerData = await request('/banner', {type: 2})
    this.setData({
      bannerList: bannerData.banners
    })
    // 获取推荐歌单数据
    const recommendData = await request('/personalized', {limit: 10})
    this.setData({
      recommendList: recommendData.result
    })
    // 排行榜数据
    let topList = []
    let index = 0
    while (index < 5) {
      let itemData = await request('/top/list', {idx: index++})
      let itemList = { name: itemData.playlist.name, tracks: itemData.playlist.tracks.slice(0, 3) }
      topList.push(itemList)
      // 为了用户体验应该获取到一次数据就push一次
      this.setData({
        topList
      })
    }
  },

  toRecommend () {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong'
    })
  },


  toTemplate () {
    wx.navigateTo({
      url: '/pages/useTemplate/useTemplate',
    })
  }

})
