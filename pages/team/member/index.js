const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    animationData: '',
    list: [],
    nowName: '',
    nowIndex: '',
    offer:'',
    ratio: '',
    price: 0,
    tax_price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getData()
    console.log(app.globalData)
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
  show: function (event) {
    var name = event.currentTarget.dataset['name']
    var index = event.currentTarget.dataset['index']
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(-500).step()
    this.setData({
      animationData: animation.export(),
      showModal: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        nowName: name,
        nowIndex: index
      })
    }.bind(this), 100)
  },
  hide: function (event) {
    this.setData({
      showModal: false,
      offer: '',
      ratio: '',
      tax_price: 0,
      price: 0
    })
  },
  postData: function (event) {
    let that = this;
    let index = this.data.nowIndex;
    let offer = this.data.offer;
    let ratio = this.data.ratio;
    if (offer == 0 || ratio == 0) {
      wx.showToast({
        title: '请输入报价或税务比例！',
        icon: 'none',
        duration: 2000
      })
    }else{
      app.http({
        url: 'Art.Create_offer',
        data: {
          token: app.globalData.depInfo.token,
          uid: app.globalData.depInfo.id,
          touid: this.data.list[index].uid,
          tax_type: 0,
          type: 3,
          price: this.data.offer,
          tax_price: this.data.tax_price
        }
      }).then(res => {
        console.log(res)
        var msg = res.data.msg;
        var code = res.data.code;
        if (code == 0) {
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
          this.getData()
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
        }
        that.setData({
          showModal: false,
          offer: '',
          ratio: '',
          tax_price: 0,
          price: 0
        })
      }).catch(res => {
        wx.showToast({
          title: res || '网络错误',
          icon: 'none',
          duration: 2000
        })
      })
    }
  },
  getData: function () {
    var that = this;
    app.http({
      url: 'Family.Familymembers',
      data: {
        family_id: app.globalData.depInfo.familyid
      }
    }).then( res => {
      var date = res.data.info[0];
      console.log(date)
      that.setData({
        list: date
      })
      wx.hideLoading()
    }).catch(res => {
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },
  err: function (event) {
    var index = event.currentTarget.dataset['index'];
    var list = this.data.list
    this.data.list[index].images = '/assets/img/default.png'
    // console.log(this.data.list[index])
    this.setData({
      list: list
    })
  },
  inputIn1: function (e) {
    let offer = e.detail.value;
    this.data.offer = offer;
    this.ride()
  },
  inputIn2: function (e) {
    let ratio = e.detail.value;
    this.data.ratio = ratio;
    this.ride()
  },
  ride: function (e) {
    let offer = parseInt(this.data.offer);
    let ratio = this.data.ratio;
    let tax_price = (offer * ratio).toFixed(2);
    let price = (offer + (offer * ratio)).toFixed(2);
    this.setData({
      tax_price: tax_price,
      price: price
    })
  }
})