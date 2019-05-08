// pages/campaign/video/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    self: false, // 1是自身， 2不是
    campItem: null,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const item = wx.getStorageSync('campVideoList')
    const videoList = item.video_arr
    
    item.mp4 ? videoList.unshift({
      avatar_thumb: item.avatar_thumb,
      user_nicename: item.user_nicename,
      video_url: item.mp4,
      video_img: ''
    }) : void 0

    const userId = app.globalData.depInfo.id

    // const self = options.uid === userId ? true : item.art_arr.length > 0 ? item.art_arr.some(arg => arg.uid === userId) : false

    const self = options.uid === userId
    
    this.setData({
      id: options.id,
      self: self,
      campItem: item,
      list: videoList
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

  handleLinkUploadVid () {
    wx.navigateTo({
      url: `/pages/campaign/uploadVideo/index?id=${this.data.id}&type=1`
    })
  }
})