const art = require('../../../utils/public.js')
const utils = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    user: null,
    artType: [],
    type: 3, // 1代表商家详情，2代表艺人详情，3代表首页查看
    pop: false,
    popType: 3,
    preList: [],
    info: null,
    enrollStartDate: '',
    enrollEndDate: '',
    curSub: 0, // 轮播图第几张
    reward: '',
    lastInput: '',
    canvas: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.data.type = options.type
    
    if (app.globalData.depInfo) {
      this.setData({
        user: app.globalData.depInfo
      })
      this.fetchData()
    } else {
      wx.showLoading({
        title: '加载中'
      })
      app.requiresAuth = res => {
        this.setData({
          user: app.globalData.depInfo
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
      title: this.data.info.name || '活动详情',
      path: `/pages/campaign/detail/index?id=${this.data.id}&type=${this.data.type}`
    }
  },
  
  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Activity.Activity_dec',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        id: this.data.id,
        uid_type: this.data.type
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              info: res.data.info,
              artType: res.data.info.style_type.split(',').map(item => art.artType.find(arg => arg.id === Number(item)).name),
              preList: res.data.info.img_arr.map(item => item.img_url),
              enrollStartDate: utils.dateFormat(res.data.info.sta_btime, 'yyyy-MM-dd'),
              enrollEndDate: utils.dateFormat(res.data.info.end_btime, 'yyyy-MM-dd')
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

  handleSwiperChange(e) {
    this.data.curSub = e.detail.current
  },

  handleShowPreview(e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.preList
    })
  },

/**
 * 我要报名
 */
  handleEnroll () {
    if (this.data.user.id === this.data.info.uid) {
      this.setData({
        pop: true,
        popType: 1
      })
    } else if (this.data.user.isauth === '0') {
      this.setData({
        pop: true,
        popType: 2
      })
    } else if (this.data.user.isauth === '1') {
      if (this.data.info.isup === 0) {
        this.setData({
          pop: true,
          popType: 3
        })
      } else {
        wx.navigateTo({
          url: '/pages/campaign/enrollFinish/index'
        })
      }
    }
  },

  handleCancel () {
    this.setData({
      pop: false
    })
  },

  handleEmitReward (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      reward: val ? formatVal : this.data.lastInput
    })
  },

  handleSee () {
    wx.navigateTo({
      url: '/pages/help/becomeArtist/index'
    })
  },

  handleEnsure () {
    if (!this.data.reward || Number(this.data.reward) < 1) {
      wx.showToast({
        title: '期望酬劳不能小于1',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '请稍后'
      })
      app.http({
        url: 'Activity.Signup_activity',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          id: this.data.id,
          price: this.data.reward
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              this.setData({
                pop: false
              })
              wx.navigateTo({
                url: '/pages/campaign/enrollFinish/index'
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
          title: '网路错误',
          icon: 'none'
        })
      })
    }
  },

  handleLinkVideo () {
    wx.navigateTo({
      url: `/pages/campaign/uploadVideo/index?id=${this.data.id}&type=1`
    })
  },

  handleLinkEnroll () {
    wx.navigateTo({
      url: `/pages/campaign/enrollList/index?id=${this.data.id}&type=1`
    })
  },

  handleBuy () {
    if (app.globalData.depInfo.id === '369') {
      wx.showModal({
        title: '提示',
        content: '你还不是平台用户，是否成为我们的用户？',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/index'
            })
          }
        }
      })
    } else {
      wx.setStorageSync('artinfo', { avatar_thumb: this.data.info.avatar_thumb, art_name: this.data.info.user_nicename})
      wx.navigateTo({
        url: `/pages/commodity/tradeOrder/index?from=agent&id=${this.data.info.goodsid}&aid=${app.globalData.depInfo.id}`
      })
    }
  },

/**
 * 二维码
 */
  handleDown () {
    this.downQRcode({
      title: this.data.info.name,
      desc: this.data.info.des,
      path: `pages/campaign/detail/index?id=${this.data.id}&type=3`,
      banner: this.data.info.img_arr.find(item => item.iscon === '1').img_url
    })
  },

  downQRcode (options) {
    wx.showLoading({
      title: '请稍后'
    })
    app.fetch({
      url: app.globalData.codeUrl,
      method: 'POST',
      data: {
        mold: 1,
        title: options.name,
        desc: options.des,
        path: options.path,
        banner: options.banner
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
  },

  handleGoodsCode () {
    this.downQRcode({
      title: this.data.info.goods.goods_name,
      desc: this.data.info.goods.goods_dec,
      path: `pages/commodity/tradeDetail/index?id=${this.data.info.goodsid}&aid=${this.data.info.uid}`,
      banner: this.data.info.goods.img_url
    })
  }
})