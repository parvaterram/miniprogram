// pages/campaign/createSecond/index.js
const util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curTime: 0,
    enrollStart: '', // 报名开始时间
    enrollStartStamp: 0, // 报名开始时间戳
    enrollEnd: '', // 报名结束时间
    enrollEndStamp: 0, // 报名结束时间戳
    campStart: '', // 活动开始时间
    campStartStamp: 0, // 活动开始时间戳
    campEnd: '', // 活动结束时间
    campEndStamp: 0, // 活动结束时间戳
    period: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const D = new Date()
    const y = D.getFullYear()
    const m = D.getMonth() +1
    const d = D.getDate()
    this.setData({
      curTime: this.convert(`${y}-${m}-${d}`)
    })
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

  enrollStartChange (e) {
    const val = e.detail.value
    const timeStamp = this.convert(val)
    if (timeStamp < this.data.curTime) {
      wx.showToast({
        title: '开始日期不能小于当前日期',
        icon: 'none'
      })
    } else if (this.data.enrollEnd && timeStamp > this.data.enrollEndStamp) {
      wx.showToast({
        title: '开始日期必须小于结束日期',
        icon: 'none'
      })
    } else {
      if (this.data.campStart) {
        timeStamp >= this.data.campStartStamp ? wx.showToast({
            title: '开始日期必须在活动开始日期之前',
            icon: 'none'
          }) : this.setData({
            enrollStart: val,
            enrollStartStamp: timeStamp
          })
      } else {
        this.setData({
          enrollStart: val,
          enrollStartStamp: timeStamp
        })
      }
    }
  },

  enrollEndChange (e) {
    const val = e.detail.value
    const timeStamp = this.convert(val)
    if (timeStamp < this.data.curTime) {
      wx.showToast({
        title: '结束日期不能小于当前日期',
        icon: 'none'
      })
    } else if (this.data.enrollStart && timeStamp < this.data.enrollStartStamp) {
      wx.showToast({
        title: '结束日期不能小于开始日期',
        icon: 'none'
      })
    } else {
      if (this.data.campStart) {
        timeStamp >= this.data.campStartStamp ? wx.showToast({
          title: '结束日期必须在活动开始日期之前',
          icon: 'none'
        }) : this.setData({
            enrollEnd: val,
            enrollEndStamp: timeStamp
        })
      } else {
        this.setData({
          enrollEnd: val,
          enrollEndStamp: timeStamp
        })
      }
    }
  },

  campStartChange (e) {
    const val = e.detail.value
    const timeStamp = this.convert(val)
    if (timeStamp < this.data.curTime) {
      wx.showToast({
        title: '开始日期必须大于当前日期',
        icon: 'none'
      })
    } else if (timeStamp <= (this.data.enrollEndStamp || this.data.enrollStartStamp || this.data.curTime)) {
      wx.showToast({
        title: '开始日期必须大于报名日期',
        icon: 'none'
      })
    } else if (this.data.campEnd && timeStamp > this.data.campEndStamp) {
      wx.showToast({
        title: '开始日期不能大于结束日期',
        icon: 'none'
      })
    } else {
      this.setData({
        campStart: val,
        campStartStamp: timeStamp
      })
      if (this.data.campEndStamp) {
        this.createTimeList()
      }
    }
  },

  campEndChange (e) {
    const val = e.detail.value
    const timeStamp = this.convert(val)
    if (timeStamp < this.data.curTime) {
      wx.showToast({
        title: '结束日期必须大于当前日期',
        icon: 'none'
      })
    } else if (timeStamp <= (this.data.enrollEndStamp || this.data.enrollStartStamp)) {
      wx.showToast({
        title: '结束日期必须大于报名日期',
        icon: 'none'
      })
    } else if (this.data.campStart && timeStamp < this.data.campStartStamp) {
      wx.showToast({
        title: '结束日期不能小于开始日期',
        icon: 'none'
      })
    } else {
      this.setData({
        campEnd: val,
        campEndStamp: timeStamp
      })
      if (this.data.campStartStamp) {
        this.createTimeList()
      }
    }
  },

  convert (date, time = '00:00') {
    const chipD = date.split('-')
    const chipT = time.split(':')
    return new Date(Number(chipD[0]), Number(chipD[1]) - 1, Number(chipD[2]), Number(chipT[0]), Number(chipT[1]), 0).getTime() / 1000
  },

  createTimeList () {
    let s = this.data.campStartStamp
    const e = this.data.campEndStamp
    let list = []
    while (s <= e) {
      list.push({
        date: util.dateFormat(s, 'yyyy-MM-dd'),
        timeStamp: s,
        st: '00:00',
        et: '23:59'
      })
      s += 86400
    }
    this.setData({
      period: list
    })
  },

  timeStartChange (e) {
    const id = e.target.dataset.id
    const index = this.data.period.findIndex(item => item.timeStamp === id)
    this.setData({
      [`period[${index}].st`]: e.detail.value
    })
  },

  timeEndChange (e) {
    const id = e.target.dataset.id
    const index = this.data.period.findIndex(item => item.timeStamp === id)
    this.setData({
      [`period[${index}].et`]: e.detail.value
    })
  },

  handleDel (e) {
    const id = e.target.dataset.id
    const index = this.data.period.findIndex(item => item.timeStamp === id)
    if (this.data.period.length > 1) {
      if (index === 0) {
        this.setData({
          campStart: this.data.period[1].date,
          campStartStamp: this.data.period[1].timeStamp,
          period: this.data.period.filter(item => item.timeStamp !== id)
        })
      } else if (index === this.data.period.length - 1) {
        const sub = this.data.period.length - 2
        this.setData({
          campEnd: this.data.period[sub].date,
          campEndStamp: this.data.period[sub].timeStamp,
          period: this.data.period.filter(item => item.timeStamp !== id)
        })
      } else {
        this.setData({
          period: this.data.period.filter(item => item.timeStamp !== id)
        })
      }
    } else {
      this.setData({
        campStart: '',
        campStartStamp: 0,
        campEnd: '',
        campEndStamp: 0,
        period: []
      })
    }
  },

  handleNextStep () {
    if (this.checkForm()) {
      const item = {...this.data}
      const chipD = this.data.enrollEnd.split('-')
      item.enrollEndStamp = new Date(Number(chipD[0]), Number(chipD[1]) - 1, Number(chipD[2]), 23, 59, 59).getTime() / 1000

      item.campStartStamp = this.convert(this.data.period[0].date, this.data.period[0].st)
      item.campEndStamp = this.convert(this.data.period[this.data.period.length - 1].date, this.data.period[this.data.period.length - 1].st)
      delete item.curTime
      // wx.setStorageSync('campSec', item)
      app.campaign.second = item
      wx.navigateTo({
        url: '/pages/campaign/createThird/index'
      })
    }
  },

  checkForm () {
    if (!this.data.enrollStart) {
      wx.showToast({
        title: '请选择报名开始日期',
        icon: 'none'
      })
    } else if (!this.data.enrollEnd) {
      wx.showToast({
        title: '请选择报名结束日期',
        icon: 'none'
      })
    } else if (!this.data.campStart) {
      wx.showToast({
        title: '请选择活动开始日期',
        icon: 'none'
      })
    } else if (!this.data.campEnd) {
      wx.showToast({
        title: '请选择活动结束日期',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  }


})