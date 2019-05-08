// pages/live/liveEnd/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    duration: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.stream = options.stream
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

  fetchData () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Live.StopInfo',
      data: {
        stream: this.stream
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            
            this.setData({
              info: res.data.info[0],
              duration: this.convert(res.data.info[0].length)
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
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  convert (num) {
    const time = Number(num)
    if (isNaN(time)) {
      return '00:00:00'
    } else {
      const h = ~~(time / 3600)
      const m = ~~((time - h * 3600) / 60)
      const s = ~~(time - h * 3600 - m * 60)
      return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
    }
  }
})