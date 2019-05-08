// pages/entrust/check/index.js
const utils = require('../../../utils/arith.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    first: {},
    second: {},
    third: [],
    isCheck: false,
    pop: false,
    agree: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    const fst = app.entrust.first
    console.log(app.entrust.first)
    console.log(app.entrust.third)
    const thd = app.entrust.third.map(item => {
      /*
      let actualCost = 0
      if (item.istax === 0) {
        const extra = utils.arith.add(fst.taxes, fst.brokerage)
        actualCost = utils.arith.add(+fst.reward, extra)
      } else {
        actualCost = utils.arith.add(+fst.reward, fst.brokerage)
      }
      */
      const actualCost = utils.arith.add(+fst.reward, fst.brokerage)
      return { ...item, actualCost }
    })
    this.setData({
      first: fst,
      second: app.entrust.second,
      third: thd
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

  checkboxChange (e) {
    this.data.agree = e.detail.value[0]
  },

  handleCancel (e) {
    this.setData({
      pop: false
    })
  },

  handleEnsure (e) {
    if (this.data.agree) {
      this.submit()
    } else {
      wx.showToast({
        title: '请阅读并同意《委托协议》',
        icon: 'none'
      })
    }
  },

  handleCreate (e) {
    this.setData({
      pop: true
    })
  },

  submit () {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Shop.Create_entrust',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        pro: this.data.first.region[0],
        city: this.data.first.region[1],
        area: this.data.first.region[2],
        address: this.data.first.address,
        shopid: this.data.id,
        ent_type: this.data.first.entType,
        sta_pay_price: this.data.first.reward,
        commission_price: this.data.first.brokerage,
        prosta_time: this.data.second.startStamp,
        proend_time: this.data.second.endStamp,
        d_paythan: this.data.second.sellMirror,
        des: this.data.first.desc,
        touids: this.data.third.map(item => item.uid).join(',')
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info[0].isok === 1) {
              wx.navigateTo({
                url: '/pages/entrust/complete/index'
              })
            } else {
              wx.showToast({
                title: res.data.msg || '创建失败',
                icon: 'none'
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
  }
})