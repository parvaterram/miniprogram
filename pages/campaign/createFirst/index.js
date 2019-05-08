// pages/campaign/createFirst/index.js
const app = getApp()
const art = require('../../../utils/public.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    camName: '',
    desc: '',
    region: [],
    address: '',
    goods: {},
    artNum: '',
    cost: '',
    artType: art.artType,
    artList: [],
    setting: '1',
    reward: '',
    maxReward: '',
    lastInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    if (app.route.to === 'tradeDetail') {
      app.route.to = ''
      this.setData({
        goods: app.route.meta
      })
    }
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

  handleEmitCamName (e) {
    this.setData({
      camName: e.detail.value.trim()
    })
  },

  handleEmitDesc (e) {
    this.setData({
      desc: e.detail.value
    })
  },

  regionChange (e) {
    this.setData({
      region: e.detail.value
    })
  },

  handleEmitAddress (e) {
    this.setData({
      address: e.detail.value.trim()
    })
  },

  handleConnect () {
    wx.navigateTo({
      url: '/pages/commodity/tradeList/index?from=camp'
    })
  },

  handleEmitArtNum (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      artNum: val ? formatVal : this.data.lastInput
    })
  },

  handleEmitCost (e) {
    this.setData({
      cost: e.detail.value.trim()
    })
  },

  artChange (e) {
    const cur = this.data.artType[Number(e.detail.value)]
    if (this.data.artList.length < 3) {
      if (this.data.artList.some(item => item.id === cur.id)) {
        wx.showToast({
          title: '该类型已存在',
          icon: 'none'
        })
      } else {
        this.setData({
          artList: [...this.data.artList, cur]
        })
      }
    } else {
      wx.showToast({
        title: '最多只能选择3种',
        icon: 'none'
      })
    }
  },

  handleDel (e) {
    const val = +e.target.dataset.id
    this.setData({
      artList: this.data.artList.filter(item => item.id !== val)
    })
  },

  handleSetting (e) {
    this.setData({
      setting: e.target.dataset.mold
    })
  },

  handleEmitReward (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      reward: val ? formatVal : this.data.lastInput
    })
  },

  handleEmitMaxReward (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      maxReward: val ? formatVal : this.data.lastInput
    })
  },

  handleNextStep () {
    if (this.checkForm()) {
      const item = {...this.data}
      delete item.artType
      // wx.setStorageSync('campFst', item)
      app.campaign.first = item
      wx.navigateTo({
        url: '/pages/campaign/createSecond/index'
      })
    }
  },

  checkForm () {
    if (!this.data.camName) {
      wx.showToast({
        title: '请输入活动名称',
        icon: 'none'
      })
    } else if (!this.data.desc.trim()) {
      wx.showToast({
        title: '请输入活动描述',
        icon: 'none'
      })
    } else if (this.data.region.length === 0) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
    } else if (!this.data.address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    } else if (!this.data.artNum || this.data.artNum < 1) {
      wx.showToast({
        title: '艺人名额要大于1',
        icon: 'none'
      })
    } else if (this.data.artList.length === 0) {
      wx.showToast({
        title: '艺人类型必须选择1个',
        icon: 'none'
      })
    } else if (this.data.setting === '2') {
      if (!this.data.reward || this.data.reward < 1) {
        wx.showToast({
          title: '预期酬劳必须大于1',
          icon: 'none'
        })
      } else if (!this.data.maxReward || Number(this.data.maxReward) < Number(this.data.reward || 0)) {
        wx.showToast({
          title: '最大酬劳必须大于预期酬劳',
          icon: 'none'
        })
      } else {
        return true
      }
    } else {
      return true
    }
    return false
  }
})