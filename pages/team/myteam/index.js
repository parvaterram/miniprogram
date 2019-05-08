const app = getApp()
var utils = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    info: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info: app.globalData.depInfo
    })
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
  goList: function () {
    wx.navigateTo({
      url: '../list/index'
    })
  },
  goMember: function () {
    wx.navigateTo({
      url: '../member/index'
    })
  },
  goProfit: function () {
    wx.navigateTo({
      url: '../profit/index'
    })
  },
  getData: function () {
    let that = this
    app.http({
      url: 'Family.Familyoneinfo',
      data: {
        family_id: this.data.info.familyid
      }
    }).then( res => {
      if (res.data.code == 0) {
        let data = res.data.info.family_info
        data.addtime = utils.dateFormat(data.addtime, 'yyyy-MM-dd')
        that.setData({
          list: data
        })
      }else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
        wx.showToast({
          title: res || '网络错误',
          icon: 'none',
          duration: 2000
        })
      })
  },
  err: function (event) {
    var list = this.data.list
    list.show_image = '/assets/img/default.png'
    this.setData({
      list: list
    })
  },
})