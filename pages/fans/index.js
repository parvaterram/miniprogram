// pages/fans/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1, // 页数
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData()
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
    if (this.data.nextPage) {
      this.setData({
        p: ++this.data.p,
        loading: true,
        loadText: '正在加载中...'
      })
      this.fetchData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'User.GetFansList',
      data: {
        uid: app.globalData.depInfo.id,
        touid: app.globalData.depInfo.id,
        p: this.data.p
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info.length > 0) {
              this.setData({
                list: [...this.data.list, ...res.data.info],
                loading: false
              })
            } else {
              this.setData({
                nextPage: false,
                loading: false,
                isDownBottom: true,
                loadText: '没有更多数据了'
              })
            }
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

  handleFollow (e) {
    const val = e.target.dataset.id
    wx.showLoading({
      title: '请稍后'
    })
    const index = this.data.list.findIndex(item => item.id === val)

    app.http({
      url: 'User.SetAttent',
      data: {
        uid: app.globalData.depInfo.id,
        touid: val
      }
    }).then(res => {
      wx.hideLoading()
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            if (+res.data.info[0].isattent === 1) {
              wx.showToast({
                title: '关注成功',
                icon: 'none',
                duration: 2000
              })

            } else {
              wx.showToast({
                title: '已取消关注',
                icon: 'none',
                duration: 2000
              })
            }
            this.setData({
              [`list[${index}].isattention`]: Number(res.data.info[0].isattent)
            })
          } else {
            if (+res.data.info.isattent === 1) {
              wx.showToast({
                title: '关注成功',
                icon: 'none',
                duration: 2000
              })

            } else {
              wx.showToast({
                title: '已取消关注',
                icon: 'none',
                duration: 2000
              })
            }
            this.setData({
              [`list[${index}].isattention`]: Number(res.data.info.isattent)
            })
          }
          break
        default:
          wx.showToast({
            title: res.data.msg || '网络错误',
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
  }
})