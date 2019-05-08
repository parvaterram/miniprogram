// pages/portal/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    depInfo: false, // 登录信息
    userInfo: {},
    orderNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载'
    })
    if (app.hasRedHot) {
      wx.hideTabBarRedDot({
        index: 4
      })
      this.setData({
        orderNum: app.redHotNum
      })
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
    if (app.globalData.depInfo) {
      this.fetchData()
    } else {
      app.requiresAuth = res => {
        this.fetchData()
      }
    }
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
  
  },

  fetchData () {
    this.setData({
      depInfo: app.globalData.depInfo
    })
    app.http({
      url: 'User.GetBaseInfo',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      wx.hideLoading()
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            this.setData({
              userInfo: res.data.info[0]
            })
            app.globalData.baseInfo = res.data.info[0]
            wx.setStorageSync('userInfo', res.data.info[0])
          } else {
            this.setData({
              userInfo: res.data.info
            })
            wx.setStorageSync('userInfo', res.data.info)
          }
          break
        default:
          wx.showToast({
            title: res.data.msg || '数据错误',
            icon: 'none',
            duration: 2000
          })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  }
})