const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    animationData: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    this.getData()
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
  getData: function () {
    var that = this
    app.http({
      url: 'Family.Showfamilycheckapply',
      data: {
        family_id: app.globalData.depInfo.familyid,
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      },
    }).then(res => {
      var date = res.data.info[0];
      console.log(date)
      that.setData({
        list: date
      })
      
    }).catch(res => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },
  examine: function (event) {
    var index = event.currentTarget.dataset['index'];
    var option = event.currentTarget.dataset['option'];
    var aid = event.currentTarget.dataset['aid'];
    var that = this;
    console.log()
    app.http({
      url: 'Family.Checkuserapply',
      data: {
        aid: aid,
        family_id: app.globalData.depInfo.familyid,
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        is_ok: option
      },
    }).then(res => {
      console.log(res)
      var date = res.data.code;
      if (date == 0) {
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 2000
        })
        this.getData()
      }else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },
  err: function (event) {
    var index = event.currentTarget.dataset['index'];
    var list = this.data.list
    this.data.list[index].images = '/assets/img/default.png'
    console.log(this.data.list[index])
    this.setData({
      list: list
    })
  }
})