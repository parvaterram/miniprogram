// pages/entrust/detail/index.js
const calc = require('../../../utils/arith.js')
const utils = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    type: 1, // 1商家进来， 2用户
    info: null,
    actualCost: 0,
    startTime: '',
    endTime: '',
    desc: '' // 描述
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.setData({
      type: +options.type
    })
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
  
  },

  handleEmitDesc (e) {
    this.setData({
      desc: e.detail.value
    })
  },

  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Shop.Entrust_des',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        ent_id: this.data.id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            const data = res.data.info[0]
            const extra = calc.arith.add(data.commission_price, data.tax_price)
            this.setData({
              info: data,
              actualCost: calc.arith.add(Number(data.sta_pay_price), Number(data.commission_price)),
              startTime: utils.dateFormat(data.prosta_time),
              endTime: utils.dateFormat(data.proend_time)
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

  handleAccept (e) {
    if (this.data.desc.trim() === '') {
      wx.showToast({
        title: '请填写受理描述',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '加载中'
      })
      app.http({
        url: 'Shop.Push_entrust',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          ent_id: this.data.id,
          reason: this.data.desc.trim(),
          isok: e.target.dataset.type
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              if (Array.isArray(res.data.info)) {
                if (+res.data.info[0].isok === 1) {
                  wx.showToast({
                    title: '接受成功',
                    icon: 'none',
                    complete: () => {
                      setTimeout(() => {
                        this.fetchData()
                      }, 1500)
                    }
                  })
                } else {
                  wx.showToast({
                    title: '受理失败',
                    icon: 'none'
                  })
                }
              } else {
                if (+res.data.info.isok === 1) {
                  wx.showToast({
                    title: '接受成功',
                    icon: 'none',
                    complete: () => {
                      setTimeout(() => {
                        this.fetchData()
                      }, 1500)
                    }
                  })
                } else {
                  wx.showToast({
                    title: '受理失败',
                    icon: 'none'
                  })
                }
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
        wx.hideLoading()
        wx.showToast({
          title: res || '数据错误',
          icon: 'none'
        })
      })
    }
  },

  handlePay (e) {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Shop.Wx_pay',
      data: {
        uid: app.globalData.depInfo.id,
        order_id: this.data.id,
        body: this.data.info.goods_name,
        money: this.data.actualCost,
        type: 2,
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
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: '支付失败'
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
  }
})