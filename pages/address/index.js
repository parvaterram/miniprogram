// pages/address/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from === 'trade') {
      this.data.from = 'trade'
    }
    this.fetchAddressList()
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
    this.fetchAddressList()
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

  fetchAddressList () {
    app.http({
      url: 'User.Selectuserarea',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            if (res.data.info[0].length > 0) {
              this.setData({
                list: res.data.info[0]
              })
            }
          } else {
            if (res.data.info.length > 0) {
              this.setData({
                list: res.data.info
              })
            } 
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
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

  setDefault (e) {
    const id = e.detail.value[0]
    if (id) {
      app.http({
        url: 'User.Setupisture',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          id: id
        }
      }).then(res => {
        switch (+res.data.code) {
          case 0:
            this.fetchAddressList()
            break
          default:
            wx.showToast({
              title: res.data.msg || '网络错误',
              icon: 'none',
              duration: 2000
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
  },

  handleEdit (e) {
    const index = e.target.dataset.index
    const item = this.data.list.find(item => item.id === index)
    wx.setStorageSync('address', item)
    wx.navigateTo({
      url: '/pages/editAddress/index?id=' + index
    })
  },

  handleDel (e) {
    const index = e.target.dataset.index
    app.http({
      url: 'User.Delarea',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        id: index
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          this.fetchAddressList()
          break
        default:
          wx.showToast({
            title: res.data.msg || '网络错误',
            icon: 'none',
            duration: 2000
          })
      }
    }).catch(res => {
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

  handleChoose (e) {
    const item = this.data.list.find(item => item.id === e.currentTarget.dataset.id)
    if (this.data.from === 'trade') {
      const router = getCurrentPages()
      const order = router.findIndex(item => item.route === 'pages/commodity/tradeOrder/index')
      const len = router.length
      wx.setStorageSync('addrBuy', item)
      wx.navigateBack({
        delta: len - order - 1
      })
    }
  }
})