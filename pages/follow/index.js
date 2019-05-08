// pages/follow/index.js
const app = getApp()
const calc = require('../../utils/arith.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1, // 页数
    pop: true, // 弹框
    isshop: false, // 是否是商家
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    list: [],
    touid: null,
    artName: '',
    price: '',
    lastPrice: '',
    tax: '',
    lastTax: '',
    taxPrice: 0, // 税务金额
    allPrice: 0 // 总金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isshop: app.globalData.baseInfo.isshop === '1'
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

  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'User.GetFollowsList',
      data: {
        uid: app.globalData.depInfo.id,
        touid: app.globalData.depInfo.id,
        P: this.data.p
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info.length > 0) {
              this.setData({
                list: [...this.data.list, ...res.data.info],
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
      wx.hideLoading()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none'
      })
    })
  },

  handleOffer (e) {
    this.setData({
      touid: e.target.dataset.id,
      artName: e.target.dataset.name,
      pop: false
    })
  },

  handleEmitPrice (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastPrice = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d{0,2}?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastPrice = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    const result = val ? formatVal : this.data.lastPrice
    const taxPrice = this.data.tax !== '' ? calc.arith.mul(result, +this.data.tax).toFixed(2) : 0
    this.setData({
      price: result,
      taxPrice: taxPrice,
      allPrice: calc.arith.add(+result, taxPrice).toFixed(2)
    })
  },

  handleEmitTax (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastTax = '' : void 0
    const val = value.trim().toString().match(/^0(\.\d{0,3}?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastTax = val[0]
      formatVal = val[0]
    }
    const result = val ? formatVal : this.data.lastTax
    const taxPrice = this.data.price !== '' ? calc.arith.mul(+result, +this.data.price).toFixed(2) : 0
    this.setData({
      tax: result,
      taxPrice: taxPrice,
      allPrice: calc.arith.add(+this.data.price, taxPrice).toFixed(2)
    })
  },

  handleEnsure () {
    if (this.data.price === '') {
      wx.showToast({
        title: '请输入报价金额',
        icon: 'none'
      })
    } else if (this.data.tax === '') {
      wx.showToast({
        title: '请输入出具税务比例',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '请稍后'
      })
      app.http({
        url: 'Art.Create_offer',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          touid: this.data.touid,
          price: this.data.price,
          tax_type: 0,
          type: 2,
          tax_price: this.data.taxPrice
        }
      }).then(res => {
        wx.hideLoading()
        this.setData({
          pop: true
        })
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              this.setData({
                list: this.data.list.map(item => {
                  return item.id === this.data.touid ? {...item, offer: this.data.allPrice} : item
                })
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
        this.setData({
          pop: true
        })
        wx.showToast({
          title: res || '网络错误',
          icon: 'none'
        })
      })
    }
  },

  handleCancel () {
    this.setData({
      pop: true
    })
  },

  handleLinkDetail (e) {
    const uid = e.currentTarget.dataset.uid
    const item = this.data.list.find(item => item.id === uid)
    wx.setStorageSync('artinfo', item)
    wx.navigateTo({
      url: `/pages/artist/detail/index?id=${uid}`
    })
  }
})