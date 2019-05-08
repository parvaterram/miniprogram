// pages/live/index/index.js
const app = getApp()
const region = require('../../../utils/region.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar: [
      {
        id: 1,
        name: '直播墙'
      },
      {
        id: 2,
        name: '代言墙'
      }
    ],
    tab: 1,
    liveKW: '',
    goodsKW: '',
    liveList: [],
    goodsList: [],
    p: 1, // 页数
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    allp: 1, // 总页数
    city: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mulArray: [
        region.prov,
        ['北京市']
      ],
      citys: region.citys
    })
    this.fetchLiveWall()
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
    this.fetchLiveWall()
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
  
  },

  handleEmitLiveKW (e) {
    this.setData({
      liveKW: e.detail.value.trim()
    })
  },


/**
 * 搜索直播间
 */
  handleSearchLives () {
    wx.navigateTo({
      url: `/pages/live/liveList/index?kw=${this.data.liveKW}`
    })
  },


/**
 * 跳转代言中列表
 */
  handleLinkEntrustList () {
    wx.navigateTo({
      url: `/pages/live/liveList/index?t=2`,
    })
  },

/**
 * 跳转直播列表
 */
  handleLinkLivesList () {
    wx.navigateTo({
      url: `/pages/live/liveList/index?t=1`,
    })
  },

/**
 * 请求列表 直播墙
 */
  fetchLiveWall () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Home.Wx_lives',
      data: {}
    }).then(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              liveList: res.data.info
            })
            break
          default:
            wx.showToast({
              title: res.data.msg || '数据错误',
              icon: 'none'
            })
        }
      } else {
        wx.showToast({
          title: res.msg || '数据错误',
          icon: 'none'
        })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  handleLinkRoom (e) {
    
    const item = e.currentTarget.dataset
    
    if (item.islive === '0') {
      app.live.videoUrl = item.videourl
      app.live.videoPoster = item.videoposter
      wx.navigateTo({
        url: `/pages/live/livePlay/index?roomnum=${item.uid}&islive=${item.islive}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/live/livePlay/index?roomnum=${item.uid}&islive=${item.islive}`,
      })
    }
  }
})