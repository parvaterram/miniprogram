// pages/artist/goods/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    entList: [],
    ownList: [],
    p: 1,
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.setData({
      entList: [],
      ownList: []
    })
    wx.removeStorageSync('addrBuy')
    if (app.globalData.depInfo) {
      this.fetchData()
    } else {
      app.requiresAuth = res => {
        this.fetchData()
      }
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
    if (this.data.nextPage) {
      this.setData({
        p: ++this.data.p,
        loading: true,
        loadText: '正在加载中...'
      })
      this.fetchData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'Ta的代言',
      path: `/pages/artist/goods/index?id=${this.data.id}`
    }
  },

  fetchData () {
    if (!this.data.nextPage) {
      return false
    }
    app.http({
      url: 'Shop.Appgoodslist',
      data: {
        uid: this.data.id,
        p: 1
      }
    }).then(res => {
      this.setData({
        loading: false
      })
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (this.data.p === 1) {
              this.setData({
                entList: res.data.info.ent
              })
            }
            if (res.data.info.my.length > 0) {
              this.setData({
                ownList: [...this.data.ownList, ...res.data.info.my],
                loading: false
              })
            } else {
              this.setData({
                nextPage: false,
                loading: false,
                isDownBottom: true,
                loadText: '没有更多数据了'
              })
            }
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
      wx.showToast({
        title: res || '网络错误',
        icon: 'none'
      })
    })
  },

  handleLinkDetail (e) {
    wx.navigateTo({
      url: `/pages/commodity/tradeDetail/index?id=${e.currentTarget.dataset.id}&aid=${this.data.id}`
    })
  },

  handleBuy (e) {
    wx.navigateTo({
      url: `/pages/commodity/tradeOrder/index?from=agent&id=${e.target.dataset.id}&aid=${this.data.id}`
    })
  }
})