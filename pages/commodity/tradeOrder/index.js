// pages/commodity/tradeOrder/index.js
const calc = require('../../../utils/arith.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: null, // 艺人id
    id: null,
    info: null, // 商品详情
    artist: null,
    address: null,
    unitPrice: 0, // 单价
    spend: 0, // 金额
    stock: 1, // 库存
    quantity: 1,
    lastQuan: 1 // 最后一次输入，用来记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.aid = options.aid // 商品所属人的id
    this.data.id = options.id
    // this.setData({
    //   artist: wx.getStorageSync('artinfo')
    // })
    if (options.from === 'detail') {
      const item = wx.getStorageSync('goodsDetail')
      const spend = calc.arith.mul(+item.money, this.data.quantity)
      this.setData({
        info: item,
        stock: item.inventory,
        unitPrice: +item.money,
        spend: spend
      })
      this.getUserInfo(this.data.aid)
    } else {
      if (app.globalData.depInfo) {
        this.fetchData()
        this.getUserInfo(this.data.aid)
      } else {
        app.requiresAuth = res => {
          this.fetchData()
          this.getUserInfo(this.data.aid)
        }
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
    if (app.globalData.depInfo.id === '369') {
      wx.showModal({
        title: '提示',
        content: '下单需要关联手机号，去关联手机号？',
        success: () => {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        },
        fail: () => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      const addr = wx.getStorageSync('addrBuy')
      if (addr) {
        this.setData({
          address: addr
        })
      } else {
        this.fetchAddressList()
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
    return {
      title: this.data.info.goods_name || '商品下单',
      path: `/pages/commodity/tradeOrder/index?id=${this.data.id}&aid=${this.data.aid}`
    }
  },

  fetchData () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Shop.Goodsedit',
      data: {
        uid: this.data.aid,
        shop_id: this.data.id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            const money = +res.data.info[0].money
            this.setData({
              info: res.data.info[0],
              stock: res.data.info[0].inventory,
              unitPrice: money,
              spend: calc.arith.mul(money, this.data.quantity)
            })
            this.getUserInfo(res.data.info[0].uid)
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

  getUserInfo (uid) {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'User.GetPmUserInfo',
      data: {
        uid: app.globalData.depInfo.id,
        touid: uid
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (res.data.code) {
          case 0:
            const data = res.data.info[0]
            this.setData({
              artist: {
                name: data.user_nicename, 
                avatar_thumb: data.avatar_thumb
              }
            })
            break
          default:
            wx.showToast({
              title: res.data.msg || '数据错误',
              icon: 'none'
            })
        }
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  fetchAddressList() {
    app.http({
      url: 'User.Selectuserarea',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            if (res.data.info[0].length > 0) {
              const addr = res.data.info[0].find(item => item.is_ture === '1')
              if (addr) {
                this.setData({
                  address: addr
                })
              }
            }
          } else {
            if (res.data.info.length > 0) {
              const addr = res.data.info.find(item => item.is_ture === '1')
              if (addr) {
                this.setData({
                  address: addr
                })
              }
            }
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
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

  handleEmitQuan (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastQuan = '' : void 0
    const val = value.trim().toString().match(/^\d+$/)
    let formatVal = 0
    if (val) {
      this.data.lastQuan = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    const result = val ? (formatVal === '0' ? 1 : formatVal) : this.data.lastQuan
    const q = result > this.data.stock ? this.data.stock : result
    this.setData({
      quantity: q,
      spend: calc.arith.mul(this.data.unitPrice, q)
    })
  },

  handleMinus () {
    const val = --this.data.quantity
    const q = val < 1 ? 1 : val
    this.setData({
      quantity: q,
      spend: calc.arith.mul(this.data.unitPrice, q)
    })
  },
  handleAdd () {
    const val = ++this.data.quantity
    const q = val > this.data.stock ? this.data.stock : val
    this.setData({
      quantity: q,
      spend: calc.arith.mul(this.data.unitPrice, q)
    })
  },

  handleChooseAddr () {
    wx.navigateTo({
      url: '/pages/address/index?from=trade'
    })
  },

  handleBuy () {
    if (!this.data.address) {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '请稍后'
    })
    const data = {
      uid: app.globalData.depInfo.id,
      token: app.globalData.depInfo.token,
      shop_id: this.data.id,
      area_id: this.data.address.id,
      number: this.data.quantity
    }
    this.data.info.ent_id ? data.ent_id = this.data.info.ent_id : void 0
    app.http({
      url: 'Shop.Shopping',
      data: data
    }).then(res => {
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.handlePay(res.data.info[0])
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
        title: res || '网络错误',
        icon: 'none'
      })
    })
  },

  handlePay (args) {
    app.http({
      url: 'Shop.Wx_pay',
      data: {
        uid: app.globalData.depInfo.id,
        order_id: args.orderid,
        body: args.goods_name,
        money: args.money,
        type: 1,
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
  }
})