// pages/information/account/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankList: ['交通银行', '工商银行', '农业银行', '中国银行', '建设银行', '招商银行', '中信银行', '华夏银行', '光大银行', '民生银行', '浦发银行', '广发银行', '兴业银行', '平安银行', '徽商银行', '浙商银行', '渤海银行', '恒丰银行'],
    sub: -1,
    cardholder: '',
    cardNo: '',
    phone: ''
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
    this.setData({
      phone: e.detail.value.trim()
    })
  },

  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Huser.Walletinfo',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              cardholder: res.data.info.cardname,
              cardNo: res.data.info.card,
              phone: res.data.info.tel,
              sub: this.data.bankList.findIndex(item => item === res.data.info.cardtype)
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

  handleSubmit () {
    if (this.checkForm()) {
      wx.showLoading({
        title: '请稍后'
      })
      app.http({
        url: 'Huser.Upd_walletinfo',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          cardname: this.data.cardholder,
          card: this.data.cardNo,
          cardtype: this.data.bankList[this.data.sub],
          tel: this.data.phone
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              if (res.data.info.isok.toString() === '1') {
                wx.showToast({
                  title: '保存成功',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '保存失败',
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
          title: '网络错误',
          icon: 'none'
        })
      })
    }
  },

  checkForm () {
    if (this.data.cardholder === '') {
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