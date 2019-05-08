// pages/artistDetail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    uid: null,
    info: {},
    from: null,
    notOwn: true,
    self: false, // 是否是自己进来
    follow: 0,
    isshop: '0',
    startDateMix: 0, // 控件日期范围
    startDateMax: 0, // 控件日期范围
    endDateMix: 0, // 控件日期范围
    endDateMax: 0, // 控件日期范围
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    avail: true, // 结束时间是否可点
    pop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.imgList = Array.apply(null, {length: 9}).map(item => ({}))
    // const info = wx.getStorageSync('artinfo')
    this.data.id = options.id
    this.data.from = options.from
    if (options.from === 'cache') {
      this.setData({
        info: wx.getStorageSync('artinfo')
      })
    } else if (options.from === 'self') { // 自己 进来
      this.setData({
        self: true
      })
      this.fetchDetail()
    } else {
      this.fetchDetail()
    }

    if (app.globalData.depInfo) {
      this.setData({
        notOwn: app.globalData.depInfo.id !== this.data.id
      })
      this.fetchIsSeller()
      this.isatten()
    } else {
      app.requiresAuth = res => {
        this.setData({
          notOwn: app.globalData.depInfo.id !== this.data.id
        })
        this.fetchIsSeller()
        this.isatten()
      }
    }

    this.setDate()
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
    if (this.data.from === 'self') {
      this.fetchDetail()
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
    return {
      title: this.data.info.art_name || '艺人详情',
      path: `/pages/artist/detail/index?id=${this.data.id}`
    }
  },

  setDate () {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    this.setData({
      startDateMix: `${year}-${month}-${day + 1}`,
      startDateMax: `${year}-${month + 2}-${day}`
    })
  },

/**
 * 自己进入,获取信息
 */
  fetchDetail () {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Art.Art_userinfo',
      data: {
        uid: this.data.id
      }
    }).then(res => {
      wx.hideLoading()
      switch (res.data.code) {
        case 0:
          if (res.data.info) {
            this.setData({
              info: res.data.info
            })
          } else if (this.data.from === 'self') {
            wx.showModal({
              title: '提示',
              content: '你还没有添加过艺人信息，点击下面的编辑按钮进行编辑'
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
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },


  handleShowPswp (e) {
    const current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.info.imginfo.map(item => item.url)
    })
  },

/**
 * 查是当前进来的用户 是否是商家
 */
  fetchIsSeller () {
    app.http({
      url: 'User.GetBaseInfo',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            this.setData({
              isshop: res.data.info[0].isshop
            })
          } else {
            this.setData({
              isshop: res.data.info.isshop
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
    }).catch(res => {
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

/**
 * 是否关注
 */
  isatten () {
    if (this.data.from === 'self') {
      return false
    }
    app.http({
      url: 'User.IsAttent',
      data: {
        uid: app.globalData.depInfo.id,
        touid: this.data.id
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            this.setData({
              follow: res.data.info[0].isattent
            })
          } else {
            this.setData({
              follow: res.data.info.isattent
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
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

/**
 * 点击关注
 */
  handleFollow () {
    app.http({
      url: 'User.SetAttent',
      data: {
        uid: app.globalData.depInfo.id,
        touid: this.data.id
      }
    }).then(res => {
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
              follow: res.data.info[0].isattent
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
              follow: res.data.info.isattent
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
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

  handleOffer () {
    if (this.data.isshop === '0') {
      wx.showModal({
        title: '提示',
        content: '你还不是商家，你可以去查看如何成为商家？',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/help/becomeSeller/index'
            })
          }
        }
      })
    } else {
      wx.showLoading({
        title: '加载中'
      })
      app.http({
        url: 'Art.Check_redprice',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          touid: this.data.id
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              const uid = this.data.id
              if (res.data.info.isok.toString() === '0') {
                wx.navigateTo({
                  url: `/pages/offer/redPacket/index?touid=${uid}`
                })
              } else {
                wx.navigateTo({
                  url: `/pages/offer/index?touid=${uid}`
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
    }
  },

  handleInvite () {
    this.setData({
      pop: true
    })
  },

  handleCancel () {
    this.setData({
      pop: false
    })
  },

  handleEnsure () {
    if (this.data.isshop === '0') {
      wx.showModal({
        title: '提示',
        content: '你还不是商家，你可以去查看如何成为商家？',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/help/becomeSeller/index'
            })
          }
        }
      })
    } else {
      if (this.checkForm()) {
        const startD = this.data.startDate.split('-')
        const startT = this.data.startTime.split(':')
        const endD = this.data.endDate.split('-')
        const endT = this.data.endTime.split(':')
        const sts = new Date(+startD[0], +startD[1] - 1, +startD[2], +startT[0], +startT[1], 0).getTime()
        const ets = new Date(+endD[0], +endD[1] - 1, +endD[2], +endT[0], +endT[1], 0).getTime()
        this.submit({
          startTime: sts / 1000,
          endTime: ets / 1000
        })
      }
    }
  },

  startDateChange(e) {
    const val = e.detail.value
    const chip = val.split('-')
    this.setData({
      startDate: val,
      avail: false,
      endDateMix: val,
      endDateMax: `${chip[0]}-${Number(chip[1]) + 1}-${chip[2]}`
    })
  },

  startTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  endDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  endTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  handleEndDateTap(e) {
    if (this.data.avail) {
      wx.showToast({
        title: '请先选择开始日期',
        icon: 'none',
        duration: 2000
      })
    }
  },

  checkForm () {
    if (this.data.startDate === '') {
      wx.showToast({
        title: '请选择执行开始日期',
        icon: 'none'
      })
    } else if (this.data.startTime === '') {
      wx.showToast({
        title: '请选择执行开始时间',
        icon: 'none'
      })
    } else if (this.data.endDate === '') {
      wx.showToast({
        title: '请选择执行结束日期',
        icon: 'none'
      })
    } else if (this.data.endTime === '') {
      wx.showToast({
        title: '请选择执行结束时间',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  },

  submit (options) {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Shop.Checklives',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        start_time: options.startTime,
        end_time: options.endTime,
        lives_uid: this.data.id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info[0].isok === 1) {
              const item = {}
              item.startDate = this.data.startDate
              item.startTime = this.data.startTime
              item.endDate = this.data.endDate
              item.endTime = this.data.endTime
              item.startStamp = options.startTime
              item.endStamp = options.endTime
              item.sellMirror = 0
    
              app.entrust.second = item
              app.entrust.third = res.data.info
              this.setData({
                pop: false
              })
              wx.navigateTo({
                url: '/pages/entrust/artFirst/index?id=' + 73, // 写死73id 商品
              })
            } else {
              wx.showToast({
                title: '该艺人于时段内无法受理邀约，请重新选择。',
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
        title: '网络错误',
        icon: 'none'
      })
    })
  }
})