// pages/commodity/waresDetail/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: null,
    aid: null, // 艺人id
    id: 0,
    name: '',
    info: '',
    imgList: [],
    preList: [],
    curSub: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    if (app.globalData.depInfo) {
      this.setData({
        uid: app.globalData.depInfo.id,
        aid: options.aid || ''
      })
      this.fetchData()
    } else {
      app.requiresAuth = res => {
        this.setData({
          uid: app.globalData.depInfo.id,
          aid: options.aid || ''
        })
        this.fetchData()
      }
    }
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
    return {
      title: this.data.info.goods_name || '商品详情',
      path: `pages/commodity/tradeDetail/index?id=${this.data.id}&aid=${this.data.aid}`
    }
  },

  handleSwiperChange (e) {
    this.data.curSub = e.detail.current
  },

  handleShowPreview (e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.preList
    })
  },

  fetchData () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Shop.Goodsedit',
      data: {
        uid: this.data.aid || app.globalData.depInfo.id,
        shop_id: this.data.id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              imgList: res.data.info[0].goods_imgs,
              info: res.data.info[0]
            })
            this.data.preList = res.data.info[0].goods_imgs.map(item => item.url)
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
  },

  handleBuy () {
    wx.setStorageSync('goodsDetail', this.data.info)
    wx.navigateTo({
      url: `/pages/commodity/tradeOrder/index?from=detail&id=${this.data.id}&aid=${this.data.info.uid}`
    })
  },

  handleShare () {
    wx.showLoading({
      title: '请稍后'
    })
    app.fetch({
      url: app.globalData.codeUrl,
      method: 'POST',
      data: {
        mold: 1,
        title: this.data.info.goods_name,
        desc: this.data.info.goods_dec,
        path: `pages/commodity/tradeDetail/index?id=${this.data.id}&aid=${this.data.info.uid}`,
        banner: this.data.info.goods_img
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      wx.hideLoading()
      if (response.code === 0) {
        wx.downloadFile({
          url: response.data,
          success: res => {
            if (res.statusCode === 200) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: rs => {
                  wx.showModal({
                    title: '提示',
                    content: '图片保存到你手机相册，你可以从相册选取图片分享到朋友圈'
                  })
                }
              })
              app.fetch({
                url: app.globalData.codeUrl,
                data: {
                  mold: 2,
                  filename: response.data
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                }
              })
            }
          }
        })
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
})