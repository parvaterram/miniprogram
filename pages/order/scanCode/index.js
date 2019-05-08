// pages/order/scanCode/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 3,
    txt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.scanCode()
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

  handleTap () {
    this.scanCode()
  }, 

  scanCode () {
    wx.scanCode({
      scanType: 'qrCode',
      success: res => {
        console.log(res)
        if (res.result.match(/www\.depforlive\.com/g)) {
          this.submit(res.result.replace(/http:/, 'https:'))
        }
      },
      fail: res => {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        })
      }
    })
  },

  submit (path) {
    wx.showLoading({
      title: '请稍后'
    })
    this.http({
      url:  path,
      method: 'GET',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info[0].isok.toString() === '1') {
              this.setData({
                status: 1
              })
            } else {
              this.setData({
                status: 2
              })
            }
            break
          case 1001:
            this.setData({
              status: 4
            })
            break
          default:
            this.setData({
              status: 5,
              txt: res.data.msg
            })
        }
      } else {
        wx.showToast({
          title: res.msg || '扫码失败',
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

  http(options) {
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        data: options.data || {},
        method: options.method || 'POST',
        header: options.header || {
          'content-type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        success: response => {
          if (response.data.ret === 200) {
            resolve(response.data)
          } else {
            reject(response.data.msg)
          }
        },
        fail: () => {
          reject('网络错误')
        }
      })
    })
    return promise
  }
})