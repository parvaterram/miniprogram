// pages/entrust/order/index.js
const utils = require('../../../utils/util.js')
const calc = require('../../../utils/arith.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1, // 1代表商家， 2代表用户
    p: 1, // 页数
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    tabBar: [
      {
        id: "0",
        name: '未受理'
      },
      {
        id: "1",
        name: '已受理'
      },
      {
        id: "3",
        name: '已完结'
      },
      {
        id: "2",
        name: '已取消'
      }
    ],
    tab: '0',
    pop: false,
    entId: null,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    if (options.type === '2') {
      wx.setNavigationBarTitle({
        title: '我的代言'
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
    this.setData({
      list: [],
      p: 1,
      nextPage: true
    })
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
  
  },

  handleSwithTab (e) {
    this.setData({
      tab: e.target.dataset.index,
      list: [],
      p: 1,
      nextPage: true
    })
    this.fetchData()
  },

  fetchData () {
    if (!this.data.nextPage) {
      return false
    }
    this.setData({
      loading: true
    })
    app.http({
      url: 'Shop.Entrust_list',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        uid_type: this.data.type,
        p: this.data.p,
        sl_status: this.data.tab
      }
    }).then(res => {
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info[0].length > 0) {
              const stack = res.data.info[0].map(item => {
                return {
                  ...item,
                  startTime: utils.dateFormat(item.prosta_time, 'yyyy-MM-dd'),
                  endTime: utils.dateFormat(item.proend_time, 'yyyy-MM-dd'),
                  createTime: utils.dateFormat(item.sta_time),
                  acceptTime: utils.dateFormat(item.acc_time)
                }
              })
              this.setData({
                list: [...this.data.list, ...stack],
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

  handleView (e) {
    wx.navigateTo({
      url: `/pages/entrust/detail/index?type=${this.data.type}&id=${e.target.dataset.id}`
    })
  },

  handlePay (e) {
    const id = e.target.dataset.id
    wx.showLoading({
      title: '请稍后'
    })
    const item = this.data.list.find(item => item.ent_id === id)
    const tax = calc.arith.add(item.commission_price, item.tax_price)
    app.http({
      url: 'Shop.Wx_pay',
      data: {
        uid: app.globalData.depInfo.id,
        order_id: id,
        body: item.goods_name,
        money: calc.arith.add(tax, item.sta_pay_price),
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
                    const sub = this.data.list.findIndex(arg => arg.ent_id === id)
                    this.setData({
                      [`list[${sub}].pay_status`]: '1'
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
  },

  handleFinish (e) {
    this.setData({
      pop: true,
      entId: e.target.dataset.id
    })
  },

  handleCancelPop () {
    this.setData({
      pop: false
    })
  },

  handleEnsurePop () {
    const id = this.data.entId
    this.setData({
      pop: false
    })
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Huser.End_entrust_getmoney',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        gid: id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info.isok.toString() === '1') {
              wx.showModal({
                title: '提示',
                content: '操作成功',
                success: res => {
                  const sub = this.data.list.findIndex(item => item.ent_id === id)
                  this.setData({
                    [`list[${sub}].end_status`]: '1'
                  })
                }
              })
            } else {
              wx.showToast({
                title: res.data.msg || '操作失败',
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
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  }
})