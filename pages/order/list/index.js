// pages/order/list/index.js
const app = getApp()
const utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1, // 1代表商家， 2代表用户
    p: 1, // 页数
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    tabBar: [
      // {
      //   id: "0",
      //   name: '未发货'
      // },
      // {
      //   id: "1",
      //   name: '已发货'
      // },
      {
        id: "0",
        name: '未使用'
      },
      {
        id: "1",
        name: '已使用'
      },
      {
        id: "2",
        name: '已失效'
      }
    ],
    tab: '0',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list: [],
      type: options.type
    })
    if (options.type === '2') {
      wx.setNavigationBarTitle({
        title: '我的订单'
      })
    }
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

  handleSwithTab(e) {
    this.setData({
      tab: e.target.dataset.index,
      list: [],
      p: 1,
      nextPage: true
    })
    this.fetchData()
  },

  handleViewDetail(e) {
    wx.navigateTo({
      url: '/pages/order/detail/index?id=1&type=1',
    })
  },

  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Shop.Order_list',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        type: this.data.type,
        goods_type: 2,
        use_type: this.data.tab
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info.length > 0) {
              const stack = res.data.info.map(item => {
                return {
                  ...item,
                  createTime: utils.dateFormat(item.addtime),
                  endTime: utils.dateFormat(item.code_endtime)
                }
              })
              this.setData({
                list: [...this.data.list, ...stack],
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
        title: res || '网络错误',
        icon: 'none'
      })
    })
  },

  handleViewDetail (e) {
    const item = this.data.list.find(item => item.id === e.currentTarget.dataset.id)
    wx.setStorageSync('orderItem', item)
    wx.navigateTo({
      url: `/pages/order/detail/index?id=${e.target.dataset.id}&type=${this.data.type}`
    })
  }
})