// pages/campaign/index/index.js
const app = getApp()
const utils = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: [
      {
        id: 1,
        name: '未开始'
      },
      {
        id: 2,
        name: '进行中'
      },
      {
        id: 3,
        name: '已结束'
      }
    ],
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
    this.setData({
      list: []
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
    this.setData({
      p: 1,
      nextPage: true,
      isDownBottom: false,
      list: []
    })
    this.fetchData()
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

  handleSearch() {
    wx.navigateTo({
      url: '/pages/campaign/search/index?kw=' + this.data.kw
    })
  },

  fetchData () {
    if (this.data.p <= this.data.allp) {
      wx.showLoading({
        title: '加载中'
      })
      app.http({
        url: 'Activity.Act_index',
        data: {
          city: '',
          status: '',
          p: this.data.p
        }
      }).then(res => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              if (res.data.info.list.length > 0) {
                const list = res.data.info.list.map(item => ({
                  ...item,
                  startTime: utils.dateFormat(item.act_start_time, 'yyyy-MM-dd')
                }))
                this.setData({
                  allp: res.data.info.all_p,
                  list: [...this.data.list, ...list],
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

  statusChange (e) {
    const val = Number(e.detail.value)
    wx.navigateTo({
      url: `/pages/campaign/search/index?status=${this.data.status[val].id}`
    })
  },

  handleFilter () {
    wx.navigateTo({
      url: `/pages/campaign/filter/index`
    })
  },

  handleLinkDetail (e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.list.find(item => item.id === id)
    wx.setStorageSync('campItem', {
      avatar_thumb: item.avatar_thumb,
      user_nicename: item.user_nicename,
      shopid: item.uid
    })
    wx.navigateTo({
      url: `/pages/campaign/detail/index?id=${id}&type=3`
    })
  }
})