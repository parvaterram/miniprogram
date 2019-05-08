// pages/portal/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    unionid: null,
    phone: '',
    pw: '',
    pw2: '',
    code: '',
    obtain: false, // 点击了按钮，进行验证码倒计时
    codeText: '获取验证码',
    time: 60, // 倒计时
    timer: null // 设置定时器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar()
    this.data.unionid = app.globalData.loginInfo.unionid
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

  handleEmitPhone (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  handleEmitPW (e) {
    this.setData({
      pw: e.detail.value
    })
  },

  handleEmitPW2 (e) {
    this.setData({
      pw2: e.detail.value
    })
  },

  handleEmitCode (e) {
    this.setData({
      code: e.detail.value
    })
  },

/**
 * 获取验证码
 */
  handleGetCode () {
    if (this.checkPhone()) {
      if (!this.data.obtain) {
        this.setData({
          obtain: true,
          time: 60
        })
        this.sendCode()
        let n = 60
        this.timer = setInterval(() => {
          n--
          if (n > 0) {
            this.setData({

              time: n
            })
          } else {
            clearInterval(this.timer)
            this.setData({
              codeText: '重新获取',
              obtain: false
            })
          }
        }, 1000)
      }
    } else {
      wx.showToast({
        title: '手机号输入有误！',
        icon: 'none'
      })
    } 
  },

  sendCode () {
    wx.request({
      url: `${app.globalData.baseUrl}Login.GetCode`,
      data: {
        mobile: this.data.phone
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: res => {
        switch (res.data.data.code) {
          case 0:
            wx.setStorageSync("sessionid", res.header["Set-Cookie"])
            break
          default:
            wx.showToast({
              title: res.data.data.msg || '数据错误',
              icon: 'none'
            })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },

/**
 * 正则验证手机号
 */
  checkPhone () {
    return String(this.data.phone).match(/^1[3-9][0-9]\d{8}$/) !== null
  },

  checkPW () {
    const num = this.data.pw.match(/^\d+$/)
    const letter = this.data.pw.match(/^[a-zA-Z]+$/)
    const len = this.data.pw.match(/^[a-zA-Z0-9]{6,12}$/)
    if (num) {
      wx.showToast({
        title: '密码不能是纯数字',
        icon: 'none'
      })
    } else if (letter) {
      wx.showToast({
        title: '密码不能是纯字母',
        icon: 'none'
      })
    } else if (len) {
      return true
    } else {
      wx.showToast({
        title: '密码6到12位数字与字母组合',
        icon: 'none'
      })
      return false
    }
  },

  handleSubmit () {
    if (!this.checkPhone()) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    } else if (this.checkPW()) {
      if (this.data.pw !== this.data.pw2) {
        wx.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        })
      } else if (this.data.code.trim() === '') {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
      } else {
        app.http({
          url: 'Login.UserReg_ByThird',
          data: {
            user_login: this.data.phone,
            user_pass: this.data.pw,
            user_pass2: this.data.pw2,
            code: this.data.code,
            openid: this.data.unionid,
            type: 'wx'
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': wx.getStorageSync("sessionid")
          }
        }).then(res => {
          switch (+res.data.code) {
            case 0:
              app.globalData.depInfo = res.data.info[0]
              wx.switchTab({
                url: '/pages/index/index',
              })
              break
            default:
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
          }
        }).catch(res => {
          wx.showToast({
            title: res || '网络错误',
            icon: 'none',
            duration: 2000
          })
        })
      }
    }
  }
})