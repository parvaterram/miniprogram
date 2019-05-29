// pages/ablum/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getAlbumList()
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

  handleCreate () {
    wx.navigateTo({
      url: '/pages/ablum/create/index',
    })
  },

  getAlbumList () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Art.show_zuopin',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
      }
    }).then(res => {
      wx.hideLoading()
      if (res.data.code === 0) {
        this.setData({
          dataSource: res.data.info
        })
      }
    }).catch(e => {
      wx.hideLoading()
    })
  },

  onTap (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/ablum/detail/index?id=${id}`,
    })
  }
})