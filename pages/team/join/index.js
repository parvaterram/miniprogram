const app = getApp()

Page({
  data: {
    showModal: false,
    animationData: '',
    list: [],
    familyid: ''
  },
  onLoad: function () {
    this.getData()
    console.log(app.globalData.id)
  },
  preventTouchMove:function(e) {
　　
　},
  show: function (event) {
    var familyid = event.currentTarget.dataset['id'];
    this.setData({
      familyid: familyid
    })
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
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hide: function (event) {
    this.setData({
      showModal: false
    })
  },
  getData: function () {
    var that = this;
    app.http({
      url: 'Family.Familylist',
    }).then( res => {
      console.log(res);
      var date = res.data.info[0];
      that.setData({
        list: date
      })
    }).catch(res => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },
  postData: function () {
    var that = this;
    app.http({
      url: 'Family.Familyapply',
      data: {
        family_id: that.data.familyid,
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      },
    }).then( res => {
      var date = res.data.info[0];
      console.log(res)
      switch (date) {
        case 1001:
          wx.showToast({
            title: '已经申请过或者已经加入过家族',
            icon: 'none',
            duration: 2000
          })
          break;
        case 1002:
          wx.showToast({
            title: '只可以加入一个家族',
            icon: 'none',
            duration: 2000
          })
          break;
        case 1003:
          wx.showToast({
            title: '该家族设置了限制无法申请',
            icon: 'none',
            duration: 2000
          })
          break;
        case 400:
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 2000
          })
          break;
        case 200:
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000
          })
          break;
      }
      that.setData({
        showModal: false
      })
    }).catch(res => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  }
})
