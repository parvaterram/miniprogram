// pages/editAddress/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    add: false,
    name: '',
    phone: '',
    region: [],
    desc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      const item = wx.getStorageSync('address')
      this.setData({
        id: options.id,
        add: true,
        name: item.name,
        phone: item.number,
        region: [item.pro, item.city, item.area],
        desc: item.address
      })
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
  
  },

  handleEmitName (e) {
    this.setData({
      name: e.detail.value
    })
  },

  handleEmitPhone (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  handleRegion (e) {
    this.setData({
      region: e.detail.value
    })
  },

  handleEmitDesc (e) {
    this.setData({
      desc: e.detail.value
    })
  },

  checkForm () {
    if (this.data.name.trim() === '') {
      wx.showToast({
        title: '收件人不能为空',
        icon: 'none',
        duration: 1000
      })
    } else if (!/^1[3|4|5|8|9][0-9]\d{8}$/.test(this.data.phone.trim())) {
      wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.region.length === 0) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.desc.trim() === '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1000
      })
    } else {
      return true
    }
    return false
  },

  handleAddAddress () {
    if (this.checkForm()) {
      app.http({
        url: 'User.Addarea',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          name: this.data.name,
          number: this.data.phone,
          pro: this.data.region[0],
          city: this.data.region[1],
          area: this.data.region[2],
          address: this.data.desc
        }
      }).then(res => {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 2000,
              success: res => {
                setTimeout(() => {
                  wx.navigateBack()
                }, 2000)
              }
            })
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
          title: res,
          icon: 'none',
          duration: 2000
        })
      })
    }
  },

  handleEdit () {
    if (this.checkForm()) {
      app.http({
        url: 'User.Updatearea',
        data: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token,
          id: this.data.id,
          name: this.data.name,
          number: this.data.phone,
          pro: this.data.region[0],
          city: this.data.region[1],
          area: this.data.region[2],
          address: this.data.desc
        }
      }).then(res => {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000,
              success: res => {
                setTimeout(() => {
                  wx.navigateBack()
                }, 2000)
              }
            })
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
          title: res,
          icon: 'none',
          duration: 2000
        })
      })
    }
  },

  handleSubmit () {
    if (!this.data.add) {
      this.handleAddAddress()
    } else {
      this.handleEdit()
    }
  }
})