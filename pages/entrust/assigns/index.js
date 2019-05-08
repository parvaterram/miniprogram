// pages/createEntrust/assigns/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    secStep: {}, // 第二部的数据
    list: [],
    artList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const item = wx.getStorageSync('entrustSecond')
    this.data.id = options.id
    this.data.secStep = item
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
      list: [],
      artList: []
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

  handleChooose (e) {
    const id = e.target.dataset.id
    const taxes = e.target.dataset.taxes
    const cur = this.data.list.find(item => item.uid === id)
    if (this.data.artList.length < 3) {
      cur.selected ? this.data.artList = this.data.artList.filter(item => item.uid !== id) : this.data.artList.push(cur)
      this.setData({
        list: this.data.list.map(item => {
          return item.uid === id ? { ...item, selected: !cur.selected } : item
        })
      })
    } else {
      if (cur.selected) {
        this.data.artList = this.data.artList.filter(item => item.uid !== id)
        this.setData({
          list: this.data.list.map(item => {
            return item.uid === id ? { ...item, selected: !cur.selected } : item
          })
        })
      } else {
        wx.showToast({
          title: '最多只可选择三个',
          icon: 'none'
        })
      }
    }
  },

  fetchData () {
    wx.showLoading({
      title: '正在加载'
    })
    app.http({
      url: 'Shop.Getlives',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        start_time: this.data.secStep.startStamp,
        end_time: this.data.secStep.endStamp
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              list: res.data.info[0]
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
  },

  handleNextStep () {
    if (this.data.artList.length === 0) {
      wx.showToast({
        title: '至少要选择一个艺人',
        icon: 'none'
      })
    } else {
      // wx.setStorageSync('entrustThird', this.data.artList)
      app.entrust.third = this.data.artList
      wx.navigateTo({
        url: '/pages/entrust/check/index?id=' + this.data.id,
      })
    }
  }
})