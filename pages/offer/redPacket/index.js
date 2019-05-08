// pages/offer/redPacket/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.touid = options.touid
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
      title: '红包询价',
      path: `/pages/offer/redPacket/index?touid=${this.data.touid}`
    }
  },

  handlePayRedPacket () {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Art.Pay_redprice',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        touid: this.data.touid
      }
    }).then(res => {
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info.isok.toString() === '1') {
              this.buildOptions(res.data.info)
            } else {
              wx.showToast({
                title: '订单生成失败',
                icon: 'none'
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

  buildOptions (res) {
    app.http({
      url: 'Shop.Wx_pay',
      data: {
        uid: res.uid,
        order_id: res.orderid,
        body: res.body,
        money: res.money,
        type: 3,
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
                      url: `/pages/offer/index?touid=${this.data.touid}`
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
        title: res || '网络错误',
        icon: 'none'
      })
    })
  },

  test () {
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
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      fail: res => {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.err.desc
        })
      }
    })
  }
})