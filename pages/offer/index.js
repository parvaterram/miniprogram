// pages/offer/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touid: null,
    self: true, // 是否自己查看自己
    money: '',
    taxesType: '0', // 1可提供票据 0不提供票据
    lastMoney: '',
    tagList: [],
    tagSub: -1,
    offerIds: [],
    indOffer: [],
    touid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.touid = options.touid
    const self = app.globalData.depInfo.id === options.touid
    this.setData({
      self: self,
      touid: options.touid
    })
    this.fetchData()
    if (self) {
      wx.setNavigationBarTitle({
        title: '我的报价'
      })
      this.fetchOfferType()
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
    const page = getCurrentPages()
    // console.log(page)
    return false;
    wx.showModal({
      title: '提示',
      content: '确定关闭当前页面吗',
    })
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
      title: '艺人报价',
      path: `/pages/offer/index?touid=${this.data.touid}`
    }
  },

  handleEmitMoney (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastMoney = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d{0,2}?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastMoney = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    const result = val ? formatVal : this.data.lastMoney
    this.setData({
      money: result
    })
  },

  fetchData () {
    wx.showLoading({
      title: '记载中'
    })
    app.http({
      url: 'Art.Tax_des',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        touid: this.data.touid
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            const data = res.data.info 
            if (data !== '') {
              this.setData({
                taxesType: data.tax_type.toString(),
                money: data.price,
                offerIds: data.name_tax_type || [],
                indOffer: data.mix_price || []
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

  handleChooseTaxes (e) {
    this.setData({
      taxesType: e.target.dataset.index
    })
  },

  /**
   * 获取报价类型，即标签
   */
  fetchOfferType () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Art.Gettax_type'
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200 && res.data.code === 0) {
        this.setData({
          tagList: res.data.info
        })
      } else {
        wx.showToast({
          title: res.msg || res.data.msg || '数据错误',
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

  bindPickerChange (e) {
    this.setData({
      tagSub: e.detail.value
    })
  },

  handleDel (e) {
    this.setData({
      offerIds: this.data.offerIds.filter(item => item.id !== e.target.dataset.id)
    })
  },

  handleUpdate (e) {
    const tagItem = this.data.tagList[this.data.tagSub]
    if (this.data.tagSub === -1) {
      wx.showToast({
        title: '请选择类型',
        icon: 'none'
      })
    } else if (this.data.offerIds.some(item => item.id === tagItem.id)) {
      wx.showToast({
        title: '该类型已存在，请选择其他类型',
        icon: 'none'
      })
    } else {
      this.setData({
        offerIds: [...this.data.offerIds, tagItem]
      })
      console.log(this.data.offerIds)
    }
  },

  handleEdit () {
    if (this.data.money === '') {
      wx.showToast({
        title: '请填写报价金额',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '提交中，请稍后'
      })
      app.http({
        url: 'Art.Create_offer',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          touid: app.globalData.depInfo.id,
          price: this.data.money,
          tax_type: this.data.taxesType,
          type: 1,
          offce_ids: this.data.offerIds.map(item => item.id).join(',')
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              wx.showToast({
                title: '提交完成',
                icon: 'none'
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
          title: res || '网络错误',
          icon: 'none'
        })
      })
    }
  }
})