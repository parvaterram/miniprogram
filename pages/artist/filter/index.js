// pages/artist/filter/index.js
const region = require('../../../utils/region.js')
const art = require('../../../utils/public.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [{id: 0, name: '全部'}, ...art.artType],
    typeSub: 0,
    genderList: ['全部', '男性', '女性'],
    genderSub: 0,
    mulIndex: [0, 0], // 多列选择的下标
    mulArray: [],
    citys: [],
    region: ''
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
        pid: -1,
        city: ['不限']
      }, ...region.citys]
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

  handleTypeChange (e) {
    this.setData({
      typeSub: +e.detail.value
    })
  },

  handleGenderChange (e) {
    this.setData({
      genderSub: +e.detail.value
    })
  },

  handleRegionChange(e) {
    const val = e.detail.value
    const prov = this.data.mulArray[0][val[0]]
    const city = this.data.citys[val[0]].city[val[1] || 0]
    this.setData({
      region: `${prov}-${city.slice(0, 2)}`
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

  handleSubmit () {
    const type = this.data.typeSub === 0 ? '' : this.data.typeList[this.data.typeSub].id
    const gender = this.data.genderSub || ''
    const region = this.data.region ? this.data.region === '不限-不限' ? '' : this.data.region.split('-')[1] : ''
    wx.redirectTo({
      url: `/pages/artist/search/index?type=${type}&gender=${gender}&region=${region}`
    })
  }
})