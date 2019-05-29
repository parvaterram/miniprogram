const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.id = options.id
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getImgList()
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

  handleEdit () {
    wx.navigateTo({
      url: `/pages/ablum/create/index?id=${this.data.id}`,
    })
  },

  getImgList () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Art.show_zuopin_img',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        zuopin_id: this.data.id
      }
    }).then(res => {
      wx.hideLoading()
      this.setData({
        list: res.data.info
      })
    }).catch(e => {
      wx.hideLoading()
    })
  },

  handleUpdate () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tmp = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中',
        })
        wx.uploadFile({
          url: `${app.globalData.baseUrl}Art.upload_zuopin_img`,
          filePath: tmp,
          name: 'img',
          formData: {
            uid: app.globalData.depInfo.id,
            token: app.globalData.depInfo.token,
            zuopin_id: this.data.id,
          },
          success: resp => {
            wx.hideLoading()
            const res = JSON.parse(resp.data)
            if (res.data.info.isok == 1) {
              this.getImgList()
            }
          },
          fail: e => {
            wx.hideLoading()
          }
        })
      }
    })
  },

  handleDel () {
    wx.showModal({
      title: '确定删除相册？',
      content: '',
      success: () => {
        wx.showLoading({
          title: '请稍后',
        })
        app.http({
          url: 'Art.del_picture',
          data: {
            uid: app.globalData.depInfo.id,
            token: app.globalData.depInfo.token,
            zuopin_id: this.data.id
          }
        }).then(res => {
          wx.hideLoading()
          console.log(res)
          if (res.data.isok == 1) {
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            })
            wx.navigateBack()
          }
        }).catch(e => {
          wx.hideLoading()
        })
      }
    })
  },

  handleDelItem (e) {
    const id = e.target.dataset.id
    wx.showModal({
      title: '确定删除？',
      content: '',
      success: () => {
        wx.showLoading({
          title: 'loading',
        })
        app.http({
          url: 'Art.delete_zuopin_img',
          data: {
            uid: app.globalData.depInfo.id,
            token: app.globalData.depInfo.token,
            zuopin_img_id: id
          }
        }).then(res => {
          wx.hideLoading()
          if (res.data.info.isok == 1) {
            this.getImgList()
          }
        }).catch(e => {
          wx.hideLoading()
        })
      }
    })
  },

  handlePreview (e) {
    const current = e.target.dataset.index
    const urls = this.data.list.map(item => item.url)
    wx.previewImage({
      urls,
      current
    })
  }
})