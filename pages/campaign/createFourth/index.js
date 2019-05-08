// pages/campaign/createFourth/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campFst: {},
    campSec: {},
    campTrd: {},
    pop: false,
    agree: ''
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      campFst: app.campaign.first,
      campSec: app.campaign.second,
      campTrd: app.campaign.third
    })
    console.log(app.campaign.third)
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

  checkboxChange(e) {
    this.data.agree = e.detail.value[0]
  },

  handleImagePreview (e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.campTrd.imgList
    })
  },

  handleSubmit () {
    this.setData({
      pop: true
    })
  },

  handleEnsure () {
    if (this.data.agree) {
      this.setData({
        pop: false
      })
      const data = {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        title: this.data.campFst.camName,
        des: this.data.campFst.desc,
        goodsid: this.data.campFst.goods.shopid || '',
        pro: this.data.campFst.region[0],
        city: this.data.campFst.region[1],
        area: this.data.campFst.region[2],
        address: this.data.campFst.address,
        artists_num: this.data.campFst.artNum,
        style_type: this.data.campFst.artList.map(item => item.id).join(','),
        price_set_status: this.data.campFst.setting,
        mix_money: this.data.campFst.reward || '',
        max_money: this.data.campFst.maxReward || '',
        sta_time: this.data.campSec.enrollStartStamp,
        end_time: this.data.campSec.enrollEndStamp,
        act_start_time: this.data.campSec.campStartStamp,
        act_end_time: this.data.campSec.campEndStamp,
        pantime: JSON.stringify(this.data.campSec.period.map(item => ({
          ymd_time: item.date,
          stime: item.st,
          etime: item.et
        })))
      }
      if (this.data.campTrd.hasImg) {
        this.submitWithFile(data)
      } else {
        this.submitDetail(data)
      }
    } else {
      wx.showToast({
        title: '请阅读并同意活动发布须知',
        icon: 'none'
      })
    }
  },

  handleCancel () {
    this.setData({
      pop: false
    })
  },

  uploadFile(options) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${app.globalData.baseUrl}Activity.Uploadimg`,
        filePath: options.path,
        name: 'img',
        formData: {
          uid: app.globalData.depInfo.id,
          token: app.globalData.depInfo.token
        },
        success: rs => {
          const res = JSON.parse(rs.data)
          resolve(res)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },

  submitWithFile(params) {
    wx.showLoading({
      title: '上传中'
    })
    Promise.all(this.data.campTrd.imgList.map(item => this.uploadFile({
      path: item
    }))).then(res => {
      const ids = res.map(item => item.data.info[0].img_id)
      return app.http({
        url: 'Activity.Create_activity',
        data: {
          ...params,
          imgcover_id: ids[this.data.campTrd.coverIndex],
          img_ids: ids.join(',')
        }
      })
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            wx.navigateTo({
              url: '/pages/campaign/finish/index'
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
    }).catch(res=> {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  submitDetail (params) {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Activity.Create_activity',
      data: {
        ...params,
        imgcover_id: 88,
        img_ids: 88
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            wx.navigateTo({
              url: '/pages/campaign/finish/index'
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
  }

})