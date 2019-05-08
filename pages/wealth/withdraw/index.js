// pages/wealth/withdraw/index.js
const utils = require('../../../utils/arith.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankList: ['交通银行', '工商银行', '农业银行', '中国银行', '建设银行', '招商银行', '中信银行', '华夏银行', '光大银行', '民生银行', '浦发银行', '广发银行', '兴业银行', '平安银行', '徽商银行', '浙商银行', '渤海银行', '恒丰银行'],
    sub: -1,
    bill: '2', // 1有票， 2无票
    balance: '', // 余额
    sum: '', // 提现数
    poundage: '', // 手续费
    actualFee: '', // 实际费用
    cardholder: '', // 持卡人
    cardNo: '', // 卡号
    phone: '', // 手机号
    lastInput: '' // 上一次输入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const info = wx.getStorageSync('wealth')
    this.setData({
      balance: Number(info.total_price),
      cardholder: info.cardname,
      cardNo: info.card,
      phone: info.tel,
      sub: this.data.bankList.findIndex(item => item === info.cardtype)
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

  handleSwitchBill (e) {
    const val = e.target.dataset.bill
    if (this.data.sum) {
      const poundage = utils.arith.mul(Number(this.data.sum), (val === '1' ? 0.04 : 0.1))
      this.setData({
        bill: val,
        poundage,
        actualFee: utils.arith.sub(Number(this.data.sum), poundage)
      })
    } else {
      this.setData({
        bill: val
      })
    }
  },

  handleEmitSum (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    const res = val ? formatVal : this.data.lastInput
    const result = Number(res) > this.data.balance ? this.data.balance : res
    const poundage = utils.arith.mul(Number(result), (this.data.bill === '1' ? 0.04 : 0.1))
    this.setData({
      sum: result,
      poundage,
      actualFee: utils.arith.sub(Number(result), poundage)
    })
  },

  handleEmitCardholder (e) {
    this.setData({
      cardholder: e.detail.value.trim()
    })
  },

  handleEmitCardNo (e) {
    this.setData({
      cardNo: e.detail.value.trim()
    })
  },

  handleBankChange (e) {
    this.setData({
      sub: +e.detail.value
    })
  },

  handleEmitPhone (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      phone: val ? formatVal : this.data.lastInput
    })
  },

  handleSubmit () {
    if (this.checkForm()) {
      wx.showLoading({
        title: '请稍后'
      })
      app.http({
        url: 'Huser.Get_money',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          price: this.data.sum,
          cardname: this.data.cardholder,
          card: this.data.cardNo,
          cardtype: this.data.bankList[this.data.sub],
          tel: this.data.phone,
          wx_openid: app.globalData.loginInfo.openid,
          has_tax: this.data.bill === '1' ? 1 : 0
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              wx.navigateTo({
                url: `/pages/wealth/finish/index?sum=${this.data.sum}&fee=${this.data.poundage}&account=${this.data.actualFee}&bill=${this.data.bill}`
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
    }
  },

  checkForm() {
    if (!this.data.sum || this.data.sum < 0) {
      wx.showToast({
        title: '提现的金额要大于0',
        icon: 'none'
      })
    } else if (this.data.cardholder === '') {
      wx.showToast({
        title: '请输入持卡人姓名',
        icon: 'none'
      })
    } else if (this.data.cardNo === '') {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      })
    } else if (this.data.sub === -1) {
      wx.showToast({
        title: '请选择开户行',
        icon: 'none'
      })
    } else if (!/^1[3|4|5|8|9][0-9]\d{8}$/.test(this.data.phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  }
})