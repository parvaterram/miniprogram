const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    all_price: '',
    input_price: '',
    poundage: '',
    json: {
      input_price: '',
      all_price: ''
    },
    name: '',
    card: '',
    card_type: '',
    phone: '',
    bankArray: ['卡号所属银行', '中国农业发展银行', '交通银行', '工商银行', '农业银行', '中国银行', '建设银行', '招商银行', '中信银行', '华夏银行', '光大银行', '民生银行', '浦发银行', '广发银行', '兴业银行', '平安银行', '徽商银行', '浙商银行', '渤海银行', '恒丰银行'],
    bankIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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
  /**
   * 金额格式化
   */
  toFormat: function (num) {
    num = parseInt(num);
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
  },
  /**
   * 金额输入获得焦点
   */
  inputOn: function (e) {
    this.setData({
      input_price: this.data.json.input_price
    })
  },
  /**
   * 金额输入失去焦点
   */
  inputOff: function (e) {
    let o_price = e.detail.value;
    this.data.json.input_price = o_price;
    let input_price = this.data.json.input_price;
    if (o_price.length > 3) {
      this.setData({
        input_price: this.toFormat(o_price)
      })
    }
    this.setData({
      poundage: (o_price * 0.005).toFixed(2)
    })
    console.log(this.data.json )
    if (input_price > this.data.json.all_price) {
      console.log(1)
      wx.showToast({
        title: '超过可提现金额',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        focus: true
      })
    }
  },
  bindCasPickerChange: function (e) {
    this.setData({
      bankIndex: e.detail.value
    })
  },
  showAll: function (e) {
    this.setData({
      input_price: this.data.all_price,
      poundage: (this.data.json.all_price * 0.005).toFixed(2)
    })
    this.data.json.input_price = this.data.all_price
  },
  getData: function () {
    var that = this
    app.http({
      url: 'Family.Family_income',
      data: {
        family_id: app.globalData.depInfo.familyid,
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      },
    }).then(res => {
      var code = res.data.code
      var data = res.data.info.test_arr
      var json = this.data.json
      if (code == 0) {
        json.all_price = data.c_price
        this.setData({
          json: json,
          all_price: this.toFormat(data.c_price)
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },
  postData: function (event) {
    var that = this
    var value = event.detail.value
    console.log(value)
    var data = {
      family_id: app.globalData.depInfo.familyid,
      uid: app.globalData.depInfo.id,
      token: app.globalData.depInfo.token,
      money: that.data.json.input_price,
      price: that.data.poundage,
      name: value.name,
      card: value.card,
      card_type: this.data.bankArray[value.card_type],
      phone: value.phone
    }
    console.log(data)
    if (this.data.json.all_price < data.money) {
      return false
    } else if (data.money <= 0 || data.price <= 0 || data.name == '' || data.card == '' || value.card_type == '' || data.phone == ''){
      wx.showToast({
        title: '请输入正确信息',
        icon: 'none',
        duration: 2000
      })
    } else {
      app.http({
        url: 'Family.Get_money',
        data: data
        
      }).then(res => {
        var code = res.data.code
        var data = res.data.info.test_arr
        var json = this.data.json
        if (code == 0) {
          wx.navigateTo({
            url: '../end/index'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(res => {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: res || '网络错误',
          icon: 'none',
          duration: 2000
        })
      })
    }
  }
})