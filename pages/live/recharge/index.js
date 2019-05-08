// pages/live/recharge/index.js
const app = getApp()
// const utils = require('../../../utils/arith.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rangeType: [
      {id: 14, val: 0.01},
      { id: 1, val: 6.00 },
      { id: 2, val: 18.00 },
      { id: 3, val: 68.00 },
      { id: 5, val: 168.00 },
      { id: 6, val: 268.00 },
      { id: 13, val: 648.00 }
    ],
    sub: -1,
    coin: 0,
    income: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      coin: options.coin || 0
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

  },

  rangeChange (e) {
    const sub = Number(e.detail.value)
    this.setData({
      sub: sub,
      income: this.data.rangeType[sub].val * 10
    })
  },

  handleBuy () {
    if (this.data.sub === -1) {
      wx.showToast({
        title: '请选择购买额度',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '请稍后',
      })
      const item = this.data.rangeType[this.data.sub]
      app.http({
        url: 'Charge.WxOrder',
        data: {
          uid: app.globalData.depInfo.id,
          changeid: item.id,
          coin: this.data.income,
          money: item.val
        }
      }).then(res => {
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              this.pay(res.data.info)
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
    }
  },

  pay (args) {
    app.http({
      url: 'Shop.Wx_pay',
      data: {
        uid: app.globalData.depInfo.id,
        order_id: args.orderid,
        body: args.body,
        money: args.money,
        type: 5,
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
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              },
              fail: res => {
                // wx.showModal({
                //   title: '提示',
                //   showCancel: false,
                //   content: res.errMsg === 'requestPayment:fail cancel' ? '已取消支付' : res.errMsg
                // })
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
  }
})