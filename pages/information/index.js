// pages/information/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    avatar_thumb: '',
    prompt: true,
    promptVal: '',
    genderList: ['男', '女'],
    maxLen: 8
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const info = wx.getStorageSync('userInfo')
    this.setData({
      info: info,
      avatar_thumb: info.avatar_thumb
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

  handleChooseImage () {
    const _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success (res) {
        wx.showLoading({
          title: '请稍后'
        })
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: `${app.globalData.baseUrl}User.UpdateAvatar`,
          name: 'file',
          filePath: tempFilePaths[0],
          formData: {
            'uid': app.globalData.depInfo.id,
            'token': app.globalData.depInfo.token
          },
          success: function (rs) {
            const res = JSON.parse(rs.data)
            switch (+res.data.code) {
              case 0:
                if (Array.isArray(res.data.info)) {
                  _this.setData({
                    avatar_thumb: res.data.info[0].avatar_thumb
                  })
                } else {
                  _this.setData({
                    avatar_thumb: res.data.info.avatar_thumb
                  })
                }
                break
              default:
                wx.showToast({
                  title: res.data.msg || '数据错误',
                  icon: 'none',
                  duration: 2000
                })
            }
          },
          complete () {
            wx.hideLoading()
          }
        })
      }
    })
  },

  handleNicename () {
    this.setData({
      prompt: false,
      maxLen: 8,
      promptVal: this.data.info.user_nicename
    })
  },

  handleSign () {
    this.setData({
      prompt: false,
      maxLen: 20,
      promptVal: this.data.info.signature
    })
  },

  handleEmitPrompt (e) {
    this.setData({
      promptVal: e.detail.value
    })
  },

  handleCancel () {
    this.setData({
      prompt: true
    })
  },

  handleEnsure () {
    this.setData({
      prompt: true
    })
    let info = {}
    this.data.maxLen === 8 ? info.user_nicename = this.data.promptVal : info.signature = this.data.promptVal
    this.handleSubmit(info)
  },

  handleSubmit (info) {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'User.UpdateFields',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        fields: JSON.stringify(info)
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          this.fetchData()
          break
        default:
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg || '数据错误',
            icon: 'none',
            duration: 2000
          })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

  fetchData() {
    app.http({
      url: 'User.GetBaseInfo',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      wx.hideLoading()
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            this.setData({
              info: res.data.info[0]
            })
            wx.setStorageSync('userInfo', res.data.info[0])
          } else {
            this.setData({
              info: res.data.info
            })
            wx.setStorageSync('userInfo', res.data.info)
          }
          break
        default:
          wx.showToast({
            title: res.data.msg || '数据错误',
            icon: 'none',
            duration: 2000
          })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

  dateChange (e) {
    const val = e.detail.value
    let info = {}
    info.birthday = val
    this.handleSubmit(info)
  },

  genderChange (e) {
    const index = e.detail.value
    let info = {}
    info.sex = index + 1
    this.handleSubmit(info)
  }
})