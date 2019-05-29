const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    name: '',
    role: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
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

  onNameChange (e) {
    this.setData({
      name: e.detail.value
    })
  },

  radioChange (e) {
    this.setData({
      role: e.detail.value
    })
  },

  onFinish () {
    const { name, role } = this.data
    wx.showLoading({
      title: '加载中',
    })
    if (!name) {
      wx.showToast({
        title: '请输入相册名称',
        icon: 'none'
      })
      return;
    }
    const data = {
      uid: app.globalData.depInfo.id,
      token: app.globalData.depInfo.token,
      zuopin_name: name,
      privacy: role
    }
    app.http({
      url: this.data.id ? 'Art.upd_picture' : 'Art.create_picture',
      data: this.data.id ? { ...data, zuopin_id: this.data.id} : data
    }).then(res => {
      wx.hideLoading()
      if (res.data.info.isok == 1) {
        wx.navigateBack({
          delta: 1
        })
      }
    }).catch(e => {
      wx.hideLoading()
    })
  }
})