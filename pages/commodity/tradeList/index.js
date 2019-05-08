// pages/commodity/waresManage/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: true,
    from: '',
    p: 1,
    list: [],
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.fetchData()
    this.setData({
      from: options.from || ''
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
    this.setData({
      P: 1,
      nextPage: true,
      list: []
    })
    this.fetchData()
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
    this.setData({
      P: 1,
      nextPage: true,
      first: false,
      list: []
    })
    this.fetchData()
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
    if (!this.data.nextPage) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Shop.Goodsshelves',
      data: {
        uid: app.globalData.depInfo.id,
        p: this.data.p
      }
    }).then(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info[0].data.length > 0) {
              this.setData({
                list: this.data.list.concat(res.data.info[0].data)
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
        this.data.first = false
      } else {
        wx.showToast({
          title: res.msg || '数据错误',
          icon: 'none'
        })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: res || '网络错误，2011',
        icon: 'none'
      })
    })
  },

  handleDel (e) {
    const id = e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          })
          app.http({
            url: 'Shop.Del_goods_list',
            data: {
              uid: app.globalData.depInfo.id,
              token: app.globalData.depInfo.token,
              ids: id
            }
          }).then(res => {
            wx.hideLoading()
            if (res.ret === 200) {
              switch (+res.data.code) {
                case 0:
                  if (res.data.info[0].isok === '1') {
                    this.setData({
                      list: this.data.list.filter(item => item.shopid !== id)
                    })
                  } else {
                    wx.showToast({
                      title: res.data.msg || '删除失败',
                      icon: 'none'
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
              title: res || '网络错误，2011',
              icon: 'none'
            })
          })
        }
      }
    })
  },



  handleEdit (e) {
    const id = e.target.dataset.id
    const type = e.target.dataset.type
    const sale = e.target.dataset.sale
    const item = this.data.list.find(item => item.id === id)
    wx.setStorageSync('goodsItem', item)
    wx.navigateTo({
      url: '/pages/commodity/tradeIssue/index?type=' + type + '&id=' + id + '&sale=' + sale
    })
  },

  handleSale (e) {
    const id = e.target.dataset.id
    const isgo = this.data.list.find(item => item.shopid === id).isgo
    wx.showLoading({
      title: '请稍后',
    })
    app.http({
      url: 'Shop.Isgo_goods',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        id: id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info[0].isok === '1') {
              this.setData({
                list: this.data.list.map(item => {
                  return item.shopid === id ? { ...item, isgo: isgo === '0' ? '1' : '0'} : item
                })
              })
            } else {
              wx.showToast({
                title: res.data.msg || '删除失败',
                icon: 'none'
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
        title: res || '网络错误，2011',
        icon: 'none'
      })
    })
  },

  handleEntrust (e) {
    const id = e.target.dataset.id
    const item = this.data.list.find(item => item.shopid === id)
    wx.setStorageSync('tradeItem', item)
    wx.navigateTo({
      url: '/pages/entrust/info/index?id=' + id
    })
  },

  handleLinkDetail (e) {
    const id = e.currentTarget.dataset.id
    
    if (this.data.from) {
      const item = this.data.list.find(item => item.shopid === id)
      app.route.to = 'tradeDetail'
      app.route.meta = item
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/commodity/tradeDetail/index?id=' + id
      })
    }
  }
})