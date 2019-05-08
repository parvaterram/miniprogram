// pages/campaign/enrollList/index.js
const app = getApp()
const art = require('../../../utils/public.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, // 活动id
    type: '2', // 1商家， 2用户
    quota: 0,
    enroll: 0,
    chosen: 0,
    p: 1, // 页数
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    artType: art.artType,
    tabBar: [
      {
        id: 0,
        name: '全部'
      },
      {
        id: 1,
        name: '已入选'
      }
    ],
    tab: 0,
    pop: false,
    price: '',  // 报价
    artName: '', // 艺人名称
    sid: '', // 录用的id
    employ: 1, // 1录用 2解除录用
    reward: '', // 商家报价过的酬劳
    lastInput: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      type: options.type
    })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  handleSwithTab(e) {
    const id = e.target.dataset.index
    if (id === 1) {
      this.setData({
        tab: id,
        list: this.data.rawList.filter(item => item.signup_status.toString() === '4')
      })
    } else {
      this.setData({
        tab: id,
        list: this.data.rawList
      })
    }
  },

  handlePay () {
    wx.navigateTo({
      url: `/pages/campaign/pay/index?id=${this.data.id}`
    })
  },

  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Activity.Signup_list',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        id: this.data.id,
        type: this.data.tab === 0 ? '' : 4
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            const list = res.data.info.list.length > 0 ? res.data.info.list.map(item => ({
              ...item,
              artType: this.data.artType.find(arg => arg.id.toString() === item.auth_type.toString()).name
            })) : []
            this.setData({
              rawList: list,
              list: list,
              quota: res.data.info.num,
              enroll: res.data.info.all_up_num,
              chosen: res.data.info.up_num
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

  handleEmitPrice (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      price: val ? formatVal : this.data.lastInput
    })
  },

  handleRelieve (e) {
    this.setData({
      employ: 2,
      sid: e.target.dataset.id,
      artName: e.target.dataset.name,
      reward: e.target.dataset.reward || 0,
      pop: true
    })
  },

  handleEmploy (e) {
    this.setData({
      employ: 1,
      sid: e.target.dataset.id,
      artName: e.target.dataset.name,
      pop: true
    })
  },

  handleCancel () {
    this.setData({
      pop: false
    })
  },

  handleEnsure () {
    if (!this.data.price || this.data.price < 1) {
      wx.showToast({
        title: '录用酬劳不能小于1',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '请稍后'
      })
      app.http({
        url: 'Activity.Shop_isup',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          sid: this.data.sid,
          price: this.data.price
        }
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              this.setData({
                pop: false
              })
              this.fetchData()
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