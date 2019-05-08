// pages/wealth/compete/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sum: 0, // 提现金额
    fee: 0,  // 手续费用
    account: 0, // 实际到账
    bill: '2' // 1有票 2无票
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      sum: options.sum,
      fee: options.fee,
      account: options.account,
      bill: options.bill
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

  handleClose () {
    wx.navigateBack({
      delta: 2
    })
  }
})