// pages/campaign/trip/index.js
const utils = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    sid: null,
    info: null,
    signup: null,
    enrollStartDate: null,
    enrollEndDate: null,
    intro: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.data.sid = options.sid
    this.fetchData()
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
    return {
      title: '活动受理',
      path: `/pages/campaign/trip/index?id=${this.data.id}&sid=${this.data.sid}`
    }
  },

  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Activity.Activity_dec',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        id: this.data.id,
        sid: this.data.sid,
        uid_type: 2
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              info: res.data.info,
              signup: res.data.info.activity_signup,
              enrollStartDate: utils.dateFormat(res.data.info.sta_btime, 'yyyy-MM-dd'),
              enrollEndDate: utils.dateFormat(res.data.info.end_btime, 'yyyy-MM-dd')
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
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  handleEmitIntro (e) {
    this.setData({
      intro: e.detail.value.trim()
    })
  },

  handleAccept (e) {
      wx.showLoading({
        title: '请稍后'
      })
      app.http({
        url: 'Activity.Art_isup',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          sid: this.data.sid,
          isup: e.target.dataset.type,
          des: this.data.intro
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              this.fetchData()
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
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      })
    }
})