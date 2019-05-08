// pages/live/liveList/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kw: '',
    t: '1',
    p: 1, // 页数
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    allp: 1, // 总页数
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.t === '2') {
      wx.setNavigationBarTitle({
        title: '代言中'
      })
    }
    this.data.t = options.t || '1'
    this.setData({
      kw: options.kw || ''
    })
    this.fetchData()
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
    if (this.data.nextPage) {
      this.setData({
        p: ++this.data.p,
        loading: true,
        loadText: '正在加载中...'
      })
      this.fetchData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  handleEmitKW (e) {
    this.setData({
      kw: e.detail.value.trim()
    })
  },

  handleSearch () {
    this.setData({
      p: 1,
      nextPage: true,
      isDownBottom: false,
      list: []
    })
    this.fetchData()
  },

  fetchData () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: this.data.t === '1' ? 'Home.Wx_liveslist' : 'Home.Entrust_lives_list',
      data: {
        key: this.data.kw,
        p: this.data.p
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info.length > 0) {
              this.setData({
                loading: false,
                list: [...this.data.list, ...res.data.info]
              })
            } else {
              this.setData({
                nextPage: false,
                isDownBottom: true,
                loading: false,
                loadText: '没有更多数据了'
              })
            }
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

  handleLinkDetail (e) {
    wx.navigateTo({
      url: `/pages/artist/detail/index?id=${e.currentTarget.dataset.uid}`,
    })
  },

  handleLinkRoom (e) {
    wx.navigateTo({
      url: `/pages/live/livePlay/index?roomnum=${e.target.dataset.uid}&from=code`,
    })
  }
})