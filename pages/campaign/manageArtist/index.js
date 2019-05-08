// pages/campaign/manageArtist/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1, // 页数
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    allp: 1, // 总页数
    tabBar: [
      {
        id: 1,
        name: '已报名'
      },
      {
        id: 2,
        name: '未开始'
      },
      {
        id: 3,
        name: '进行中'
      },
      {
        id: 4,
        name: '已完结'
      },
      {
        id: 5,
        name: '已取消'
      }
    ],
    tab: 1,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // this.setData({
    //   list: [],
    //   isDownBottom: false,
    //   p: 1,
    //   nextPage: true
    // })
    // this.fetchData()
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

  handleSwithTab(e) {
    this.setData({
      tab: e.target.dataset.index,
      list: [],
      isDownBottom: false,
      p: 1,
      nextPage: true
    })
    this.fetchData()
  },

  fetchData() {
    if (this.data.p <= this.data.allp) {
      wx.showLoading({
        title: '加载中'
      })
      app.http({
        url: 'Activity.Activity_list',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          uid_type: 2,
          p: this.data.p,
          search: this.data.tab
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              if (res.data.info.list.length > 0) {
                this.setData({
                  allp: res.data.info.all_p,
                  list: [...this.data.list, ...res.data.info.list],
                  loading: false
                })
              } else {
                this.setData({
                  nextPage: false,
                  loading: false,
                  isDownBottom: true,
                  loadText: '没有更多数据了'
                })
              }
              if (res.data.info.all_p === this.data.p) {
                this.setData({
                  nextPage: false,
                  loading: false,
                  isDownBottom: true,
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
    }
  },

  handleLinkDetail (e) {
    wx.navigateTo({
      url: `/pages/campaign/detail/index?id=${e.currentTarget.dataset.id}&type=3`
    })
  },

  handleUploadVideo (e) {
    wx.navigateTo({
      url: `/pages/campaign/uploadVideo/index?id=${e.target.dataset.id}&type=2`
    })
  },

  handleLinkTrip (e) {
    wx.navigateTo({
      url: `/pages/campaign/trip/index?id=${e.target.dataset.id}&sid=${e.target.dataset.sid}`
    })
  }
})