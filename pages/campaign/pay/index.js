// pages/campaign/pay/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, // 活动id
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
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
    this.fetchData()
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
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Activity.Feeinfo',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        id: this.data.id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              info: res.data.info
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

  handlePay () {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Activity.Pay_fee',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        id: this.data.id
      }
    }).then(res => {
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.submitOrder(res.data.info)
            break
          default:
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg || '数据错误',
              icon: 'none'
            })
        }
      } else {
        wx.hideLoading()
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

  submitOrder (options) {
    app.http({
      url: 'Shop.Wx_pay',
      data: {
        uid: app.globalData.depInfo.id,
        order_id: options.order_id,
        body: '活动报酬支付',
        money: options.total_price,
        type: 4,
        openid: app.globalData.loginInfo.openid
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            const rs = res.data.info
            wx.requestPayment({
              timeStamp: rs.timestamp.toString(),
              nonceStr: rs.noncestr,
              package: 'prepay_id=' + rs.prepayid,
              signType: 'MD5',
              paySign: rs.sign,
              success: () => {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: '支付成功',
                  success: () => {
                    wx.navigateTo({
                      url: `/pages/campaign/payFinish/index`
                    })
                  }
                })
              },
              fail: res => {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: res.errMsg === 'requestPayment:fail cancel' ? '已取消支付' : res.errMsg
                })
              }
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
  }
 })