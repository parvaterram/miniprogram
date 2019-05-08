// pages/report/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: null, // 被举报的人的uid
    type: '', // 举报来源， 1代表直播间，2代表短视频，3代表艺人,4代表不限
    desc: '',
    reportType: ['信息不实', '内容与实际不一致', '信息涉黄、涉黑、造假', '商家委托、活动需求量与实际不一致', '委托、活动超量需求', '其他'],
    sub: -1,
    imgList: [],
    imgArr: '',
    agree: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.uid = options.uid
    this.data.type = options.type
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

  reportTypeChange (e) {
    this.setData({
      sub: Number(e.detail.value)
    })
  },

  handleEmitDesc (e) {
    this.setData({
      desc: e.detail.value
    })
  },

  handleChooseImage () {
    wx.chooseImage({
      count: 3 - this.data.imgList.length,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        const newArr = tempFilePaths.map(item => ({
          url: item,
          file: item
        }))
        const tempFiles = res.tempFiles
        let stack = []
        tempFiles.forEach((item, index) => {
          if (item.path.match(/(\.png)|(\.jpg)|(\.jpeg)$/g)) {
            if (this.data.imgList.length < 3) {
              stack.push(tempFilePaths[index])
            }
          }
        })
        stack.length > 0 && this.setData({
          imgList: [...this.data.imgList, ...stack]
        })
      },
    })
  },

  handleDel(e) {
    this.setData({
      imgList: this.data.imgList.filter(item => item !== e.target.dataset.src)
    })
  },

  handleImagePreview(e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.imgList
    })
  },

  checkboxChange(e) {
    this.data.agree = e.detail.value[0]
  },

  handleSubmit () {
    if (this.checkForm()) {
      wx.showLoading({
        title: '上传中',
      })
      if (this.data.imgList.length > 0) {
        Promise.all(this.data.imgList.map(item => app.uploadFile({
          url: 'Live.Uploadimg_reurl',
          path: item,
          name: 'img'
        }))).then(res => {
          this.data.imgArr = res.map(item => item.data.info.img)
          this.submit()
        })
      } else {
        this.submit()
      }
    }
  },

  submit () {
    app.http({
      url: 'Live.SetReport',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        touid: this.data.uid,
        content: this.data.desc,
        type: this.data.type,
        imgs_json: this.data.imgArr ? JSON.stringify(this.data.imgArr) : ''
      }
    }).then(res => {
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            wx.navigateTo({
              url: '/pages/report/finish/index'
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

  checkForm () {
    if (this.data.sub === -1) {
      wx.showToast({
        title: '请选择举报类型',
        icon: 'none'
      })
    } else if (!this.data.desc.trim()) {
      wx.showToast({
        title: '请填写举报描述',
        icon: 'none'
      })
    } else if (!this.data.agree) {
      wx.showToast({
        title: '请同意确认提交即代表举报人对举报内容真实性负责',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  }
})