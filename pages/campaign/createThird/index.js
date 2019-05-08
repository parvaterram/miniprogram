// pages/campaign/createThird/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    coverIndex: 0 // 默认第一张为封面
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
    wx.chooseImage({
      count: 6 - this.data.imgList.length,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        const newArr = tempFilePaths.map(item => ({
          url: item,
          file: item
        }))
        const tempFiles = res.tempFiles
        let stack = []
        tempFiles.forEach((item, index) => {
          if (item.path.match(/(\.png)|(\.jpg)|(\.jpeg)$/g)) {
            if (this.data.imgList.length < 6) {
              stack.push(tempFilePaths[index])
            }
          }
        })
        stack.length > 0 && this.setData({
          imgList: [...this.data.imgList, ...stack]
        })
      },
    })
  },

  handleDel (e) {
    this.setData({
      imgList: this.data.imgList.filter(item => item !== e.target.dataset.src)
    })
  },

  handleSetCover (e) {
    const idx = this.data.imgList.findIndex(item => item === e.target.dataset.src)
    this.setData({
      coverIndex: idx
    })
  },

  handleImagePreview (e) {
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接  
      urls: this.data.imgList // 需要预览的图片http链接列表  
    })
  },

  handleNextStep () {
    if (this.data.imgList.length > 0) {
      if (this.checkForm()) {
        const item = { ...this.data }
        item.hasImg = true
        // wx.setStorageSync('campTrd', item)
        app.campaign.third = item
        wx.navigateTo({
          url: '/pages/campaign/createFourth/index'
        })
      }
    } else {
      const item = { ...this.data }
      item.hasImg = false
      // wx.setStorageSync('campTrd', item)
      app.campaign.third = item
      wx.navigateTo({
        url: '/pages/campaign/createFourth/index'
      })
    }
  },

  checkForm () {
    if (!this.data.imgList[this.data.coverIndex]) {
      wx.showToast({
        title: '请选择其中一张图片作封面图片',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  }
})