// pages/live/liveStart/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    mode: 2,
    file: null
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
    if (app.live.isPushBack) {
      app.live.isPushBack = false
      this.stopLive()
      wx.navigateTo({
        url: `/pages/live/liveEnd/index?stream=${app.live.createRoom.stream}`,
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

  handleEmitTitle (e) {
    this.setData({
      title: e.detail.value.trim()
    })
  },

  handleSetMode (e) {
    this.setData({
      mode: Number(e.target.dataset.type)
    })
  },

  handleChooseImage () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          file: res.tempFilePaths[0]
        })
      }
    })
  },

  handleDel(e) {
    this.setData({
      file: null
    })
  },

  handleImagePreview(e) {
    wx.previewImage({
      current: file,
      urls: [file]
    })
  },

  handleEnter () {
    if (!this.data.title) {
      wx.showToast({
        title: '请输入直播间标题',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '请稍后'
      })
      app.live.mode = this.data.mode === 1 ? 'SD' : 'HD'
      if (this.data.file) {
        wx.uploadFile({
          url: `${app.globalData.baseUrl}Shop.Uploadimg`,
          filePath: this.data.file,
          name: 'kaihuhang_img',
          formData: {
            'uid': app.globalData.depInfo.id,
            'token': app.globalData.depInfo.token
          },
          success: (rs) => {
            const res = JSON.parse(rs.data)
            if (res.data && res.data.code == 0) {
              this.imgUrl = res.data.info[0].kaihuhang_img
              this.submit()
            } else {
              wx.showToast({
                title: res.msg || res.data.msg || '图片上传失败，请重新再试',
                icon: 'none'
              })
            }
          },
          fail: res => {
            wx.showToast({
              title: '图片上传失败，请重新再试',
              icon: 'none'
            })
          }
        })
      } else {
        this.submit()
      }
    }
  },

  submit () {
    const info = app.globalData.depInfo
    app.http({
      url: 'Live.CreateRoom',
      data: {
        uid: info.id,
        token: info.token,
        user_nicename: encodeURIComponent(info.user_nicename),
        avatar: this.data.file ? encodeURIComponent(this.imgUrl) : encodeURIComponent(info.avatar),
        avatar_thumb: this.data.file ? encodeURIComponent(this.imgUrl) : encodeURIComponent(info.avatar_thumb),
        title: this.data.title,
        type: 0
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            app.live.createRoom = res.data.info[0]
            wx.navigateTo({
              url: '/pages/live/livePush/index',
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

  stopLive () {
    app.http({
      url: 'Live.StopRoom',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        stream: app.live.createRoom.stream
      }
    }).then(res => {

    }).catch(res => {
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  }
})