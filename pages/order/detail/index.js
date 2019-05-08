// pages/order/detail/index.js
const util = require('../../../utils/qr.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    type: '1',
    url: 'http://mall.depforlive.com/test/dm.html'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const item = wx.getStorageSync('orderItem')
    this.setData({
      info: item,
      type: options.type
    })
    this.createQrcode()
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

  createQrcode () {
    util.QR.draw(this.data.info.qrcodeurl, 'mycanvas', 200, 200)
  }
})