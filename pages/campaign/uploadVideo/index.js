// pages/campaign/uploadVideo/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    url: '',
    videoFile: null,
    poster: null,
    isUp: 1 // 已经上传
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.data.type = options.type
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

  handleEmitUrl (e) {
    this.setData({
      url: e.detail.value.trim()
    })
  },

  handleChooseVideo () {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      success: res => {
        if (res.tempFilePath.match(/\.mp4$/g)) {
          if (res.size / 1024 / 1024 < 50) {
            // this.setData({
            //   videoFile: res.tempFilePath,
            //   poster: res.thumbTempFilePath
            // })
            this.data.videoFile = res.tempFilePath
            this.submitFile()
          } else {
            wx.showToast({
              title: '视频大小超过限制',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  submitFile () {
    wx.showLoading({
      title: '上传中'
    })
    wx.uploadFile({
      url: `${app.globalData.baseUrl}Activity.UploadMp4`,
      filePath: this.data.videoFile,
      name: 'mp4',
      formData: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        activity_id: this.data.id,
        type: this.data.type,
        mp4type: 1
      },
      success: rs => {
        wx.hideLoading()
        const res = JSON.parse(rs.data)
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              wx.showModal({
                title: '提示',
                content: res.data.info.isok === 1 ? '上传成功' : '上传失败',
                success: function (res) {

                }
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
      },
      fail: res => {
        wx.hideLoading()
      }
    })
  },

  handleUrlUpload () {
    if (!this.data.url) {
      wx.showToast({
        title: '外链地址不能为空',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '上传中'
      })
      app.http({
        url: 'Activity.UploadMp4',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          activity_id: this.data.id,
          mp4_url: this.data.url,
          type: this.data.type,
          mp4type: 2
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch(+res.data.code) {
            case 0:
              wx.showModal({
                title: '提示',
                content: '上传成功',
                success: function (res) {
                  
                }
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
  }
})