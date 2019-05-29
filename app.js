//app.js
App({
  onLaunch: function () {
    wx.clearStorageSync()
    // 登录
    wx.login({
      success: res => {
        this.http({
          url: 'Wx.Getusers',
          data: {
            code: res.code
          }
        }).then(res => {
          if (res.data.code === 0) {
            this.globalData.loginInfo = res.data.info
            if (res.data.info.unionid) {
              this.globalData.isAuth = true
              this.isBindDepAccount()
            } else {
              this.globalData.depInfo = {}
              this.globalData.depInfo.tourist = true
              this.globalData.depInfo.id = '369'
              this.globalData.depInfo.token = '5a7ba04b0ee0237d37331639fcbf93aa'
              this.globalData.depInfo.avatar_thumb = 'http://www.depforlive.com/default_thumb.jpg'
              this.globalData.isAuth = false
              if (this.userAuth) {
                this.userAuth()
              }
            }
            this.globalData.logined = true
          } else {
            wx.showToast({
              title: res.data.msg || '登录失败，请重新登录',
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(res => {
          wx.showModal({
            title: '提示',
            content: res || '登陆失败，请重新登陆',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
  },
  getuserInfo () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo'
          })
        }
      }
    })
  },

  hasRedHot: false, // tabBar有红点
  redHotNum: 0,
  portal: null, // 个人数据

  globalData: {
    codeUrl: 'https://www.depforlive.com/web/qrcode/QRCode.php',
    logined: false,
    isAuth: false,
    baseUrl: 'https://www.depforlive.com/api/public/?service=',
    userInfo: null,
    loginInfo: null,
    depInfo: null,
    baseInfo: null
  },
  route: {
    to: '',
    form: '',
    meta: {}
  },

  // 委托字段
  entrust: {
    first: null,
    second: null,
    third: null,
    fourth: null
  },

  // 活动字段
  campaign: {
    first: null,
    second: null,
    third: null,
    fourth: null
  },

  // 直播全局字段
  live: {
    mode: 'HD',
    createRoom: {},
    data: {},
    videoUrl: null,
    videoPoster: null,
    isPushBack: false // 是否是开播退出
  },
  isBindDepAccount () {
    this.http({
      url: 'Login.UserLoginByThird',
      data: {
        openid: this.globalData.loginInfo.unionid || this.globalData.loginInfo.unionId,
        type: 'wx'
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          this.globalData.depInfo = res.data.info[0]
          if (this.requiresAuth) {
            this.requiresAuth(this.globalData.depInfo)
          }
          break
        case 1001:
          wx.showToast({
            title: res.data.msg || '账号禁用',
            icon: 'none',
            duration: 2000
          })
          break
        case 1002:
          this.globalData.depInfo = {}
          this.globalData.depInfo.tourist = true
          this.globalData.depInfo.id = '369'
          this.globalData.depInfo.token = '5a7ba04b0ee0237d37331639fcbf93aa'
          this.globalData.depInfo.avatar_thumb = 'http://www.depforlive.com/default_thumb.jpg'
          break
        default:
          wx.showToast({
            title: res.data.msg || '账号错误',
            icon: 'none',
            duration: 2000
          })
      }
    }).catch(res => {
      wx.showToast({
        title: '登录错误',
        icon: 'none',
        duration: 2000
      })
    })
  },
  http (options) {
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl}${options.url}`,
        data: options.data || {},
        method: options.method || 'POST',
        header: options.header || {
          'content-type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        success: response => {
          if (response.data.ret === 200) {
            resolve(response.data)
          } else {
            reject(response.data.msg)
          }
        },
        fail: () => {
          reject('网络错误')
        }
      })
    })
    return promise
  },
  fetch (options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url || 'https://www.depforlive.com/index.php',
        data: options.data,
        method: options.method || 'GET',
        header: options.header || {
          'content-type': 'application/json'
        },
        success: res => {
          resolve(res.data)
        },
        fail: () => {
          reject('网络错误')
        }
      })
    })
  },
  uploadFile (options) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${this.globalData.baseUrl}${options.url}`,
        filePath: options.path,
        name: options.name,
        formData: options.data || {
          'uid': this.globalData.depInfo.id,
          'token': this.globalData.depInfo.token
        },
        success: rs => {
          const res = JSON.parse(rs.data)
          if (res.ret === 200) {
            resolve(res)
          } else {
            wx.showToast({
              title: res.msg || '数据错误',
              icon: 'none'
            })
            reject(res)
          }
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }
})