// pages/createEntrust/date/index.js
const utils = require('../../../utils/arith.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id: 0,
      goodsPrice: {}, // 上一步编辑的数据价钱
      startDateMix: 0, // 控件日期范围
      startDateMax: 0, // 控件日期范围
      endDateMix: 0, // 控件日期范围
      endDateMax: 0, // 控件日期范围
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
      avail: true, // 结束时间是否可点
      sell: ['3%', '5%', '7%', '10%', '20%', '30%', '40%', '50%'],
      sellMirror: [0.03, 0.05, 0.07, 0.1, 0.2, 0.3, 0.4, 0.5],
      sellSub: -1,
      assignArt: '',
      assignPlat: '',
      left: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const item = wx.getStorageSync('tradeItem')
    this.setData({
      id: options.id,
      goodsPrice: Number(item.money),
      startDateMix: `${year}-${month}-${day}`,
      startDateMax: `${year}-${month + 2}-${day}`
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

  startDateChange (e) {
    const val = e.detail.value
    const chip = val.split('-')
    this.setData({
      startDate: val,
      avail: false,
      endDateMix: val,
      endDateMax: `${chip[0]}-${Number(chip[1]) + 1}-${chip[2]}`
    })
  },

  startTimeChange (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  endDateChange (e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  endTimeChange (e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  handleEndDateTap (e) {
    if (this.data.avail) {
      wx.showToast({
        title: '请先选择开始日期',
        icon: 'none',
        duration: 2000
      })
    }
  },

  sellchange (e) {
    const val = Number(e.detail.value)
    const scale = this.data.sellMirror[val]
    const assignArt = utils.arith.mul(this.data.goodsPrice, scale)
    const assignPlat = utils.arith.mul(this.data.goodsPrice, 0.05)
    const left = utils.arith.sub(this.data.goodsPrice, utils.arith.add(assignArt, assignPlat))
    this.setData({
      sellSub: val,
      assignArt,
      assignPlat,
      left
    })
  },
  
  handleNextStep () {
    if (this.checkForm()) {
      const startD = this.data.startDate.split('-')
      const startT = this.data.startTime.split(':')
      const endD = this.data.endDate.split('-')
      const endT = this.data.endTime.split(':')
      const sts = new Date(+startD[0], +startD[1] - 1, +startD[2], +startT[0], +startT[1], 0).getTime()
      const ets = new Date(+endD[0], +endD[1] - 1, +endD[2], +endT[0], +endT[1], 0).getTime()
      const item = {}
      item.startDate = this.data.startDate
      item.startTime = this.data.startTime
      item.endDate = this.data.endDate
      item.endTime = this.data.endTime
      item.startStamp = sts / 1000
      item.endStamp = ets / 1000
      item.sell = this.data.sell[this.data.sellSub]
      item.sellMirror = this.data.sellMirror[this.data.sellSub]
      item.assignArt = this.data.assignArt
      item.assignPlat = this.data.assignPlat
      item.left = this.data.left
      // wx.setStorageSync('entrustSecond', item)
      app.entrust.second = item
      wx.navigateTo({
        url: '/pages/entrust/assigns/index?id=' + this.data.id,
      })
    }
  },

  checkForm () {
    if (this.data.startDate === '') {
      wx.showToast({
        title: '请选择执行开始日期',
        icon: 'none'
      })
    } else if (this.data.startTime === '') {
      wx.showToast({
        title: '请选择执行开始时间',
        icon: 'none'
      })
    } else if (this.data.endDate === '') {
      wx.showToast({
        title: '请选择执行结束日期',
        icon: 'none'
      })
    } else if (this.data.endTime === '') {
      wx.showToast({
        title: '请选择执行结束时间',
        icon: 'none'
      })
    } else if (this.data.sellSub === -1) {
      wx.showToast({
        title: '请选择推购分成',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  }
})