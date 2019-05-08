// pages/endorsing/index.js
const app = getApp()
const region = require('../../utils/region.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mulArray: [],
    citys: '',
    goodsKW: '',
    list: [],
    p: 1, // 页数
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    allp: 1, // 总页数
    city: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mulArray: [
        ['不限', ...region.prov],
        ['不限']
      ],
      citys: [{
        pid: 0,
        city: ['不限']
      }, ...region.citys]
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
      list: [],
      isDownBottom: false,
      loading: true,
      loadText: '正在加载中...',
      nextPage: true
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

  handleEmitGoodsKW(e) {
    this.setData({
      goodsKW: e.detail.value.trim()
    })
  },

  handleColumnchange(e) {
    switch (e.detail.column) {
      case 0:
        this.setData({
          'mulArray[1]': this.data.citys[e.detail.value].city
        })
        break
    }
  },

  handleRegionChange(e) {
    const val = e.detail.value
    const prov = this.data.mulArray[0][val[0]]
    const city = this.data.citys[val[0]].city[val[1] || 0]
    this.setData({
      city: city,
      list: [],
      p: 1,
      nextPage: true,
      isDownBottom: false
    })
    this.fetchData()
  },

  handleSearchGoods () {
    this.setData({
      list: [],
      p: 1,
      nextPage: true,
      isDownBottom: false
    })
    this.fetchData()
  },

  /**
 * 请求列表 代言墙
 */
  fetchData () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Shop.Wx_entrust_goods',
      data: {
        key: this.data.goodsKW,
        city: this.data.city === '不限' ? '' : this.data.city,
        p: this.data.p
      }
    }).then(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
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
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  handleBuy(e) {
    wx.navigateTo({
      url: `/pages/commodity/tradeOrder/index?id=${e.target.dataset.id}&aid=${e.target.dataset.aid}`,
    })
  },

  handleLinkGoodsDetail(e) {
    wx.navigateTo({
      url: `/pages/commodity/tradeDetail/index?id=${e.currentTarget.dataset.id}&aid=${e.currentTarget.dataset.aid}`,
    })
  },
})