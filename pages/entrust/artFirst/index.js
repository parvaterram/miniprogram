// pages/entrust/create/index.js
const utils = require('../../../utils/arith.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    tradeName: '',
    region: [],
    address: '',
    desc: '',
    reward: '',
    brokerage: '',
    cost: '',
    lastReward: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const item = wx.getStorageSync('tradeItem')
    this.setData({
      id: options.id
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

  regionChange (e) {
    this.setData({
      region: e.detail.value
    })
  },

  handleEmitAddress (e) {
    this.setData({
      address: e.detail.value.trim()
    })
  },

  handleEmitDesc (e) {
    this.setData({
      desc: e.detail.value
    })
  },

  handleEmitQuant (e) {
    this.setData({
      quantity: e.detail.value.trim()
    })
  },

  handleEmitReward (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastReward = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d{0,2}?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastReward = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    const result = val ? formatVal : this.data.lastReward
    const brokerage = result ? utils.arith.mul(Number(result), 0.07) : ''
    this.setData({
      reward: result,
      brokerage: result ? utils.arith.mul(result, 0.07) : '',
      cost: result ? utils.arith.add(Number(result), brokerage) : ''
    })
  },

  handleNextStep () {
    if (this.checkForm()) {
      const item = {}
      item.region = this.data.region
      item.address = this.data.address
      item.desc = this.data.desc.trim()
      
      item.entType = 0
      item.reward = this.data.reward
      item.brokerage = this.data.brokerage
      item.cost = this.data.cost
      // wx.setStorageSync('entrustFirst', item)
      app.entrust.first = item
      wx.navigateTo({
        url: '/pages/entrust/artSecond/index?id=' + this.data.id,
      })
    }
  },

  checkForm () {
    if (this.data.region.length === 0) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
    } else if (this.data.address === '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
    } else if (this.data.desc === '') {
      wx.showToast({
        title: '请填写委托描述',
        icon: 'none'
      })
    } else if (+this.data.reward < 1) {
      wx.showToast({
        title: '委托酬劳不能小于1元',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  }
})