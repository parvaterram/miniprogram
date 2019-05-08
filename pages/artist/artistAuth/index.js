// pages/artist/artistAuth/index.js
const app = getApp()
const art = require('../../../utils/public.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '', // 真实姓名
    phone: '', // 手机号码
    authType: art.artType,
    authTypeSub: -1,
    credType: ['中国公民身份证', '外籍人员工作签证'],
    credTypeSub: -1,
    credNum: '',
    IDImgFront: null, // 证件正面
    IDImgBack: null, // 证件背面
    holdID: null, // 手持证件
    holdImg: '',
    agree: false, // 同意协议
    status: '5'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchStatus()
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
      name: e.detail.value.trim()
    })
  },

  handleEmitPhone (e) {
    this.setData({
      phone: e.detail.value.trim()
    })
  },

  typeChange (e) {
    this.setData({
      authTypeSub: +e.detail.value
    })
  },

  credChange (e) {
    this.setData({
      credTypeSub: +e.detail.value
    })
  },

  handleEmitCredNum (e) {
    this.setData({
      credNum: e.detail.value.trim()
    })
  },

  handleChooseFile(e) {
    const type = e.target.dataset.type
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths

        switch (type) {
          case '1':
            this.setData({
              IDImgFront: tempFilePaths[0]
            })
            break
          case '2':
            this.setData({
              IDImgBack: tempFilePaths[0]
            })
            break
          case '3':
            this.setData({
              holdID: tempFilePaths[0]
            })
            break
        }
      }
    })
  },

  handleDel(e) {
    switch (e.target.dataset.type) {
      case '1':
        this.setData({
          IDImgFront: null
        })
        break
      case '2':
        this.setData({
          IDImgBack: null
        })
        break
      case '3':
        this.setData({
          holdID: null
        })
        break
    }
  },

  checkboxChange(e) {
    this.data.agree = e.detail.value[0]
  },

  handleSubmit () {
    if (this.checkForm()) {
      wx.showLoading({
        title: '上传中'
      })
      if (this.data.holdID) {
        this.uploadFile({
          path: this.data.holdID,
          formData: {
            'uid': app.globalData.depInfo.id,
            'token': app.globalData.depInfo.token,
            'filetype': 'handset_view'
          }
        }).then(res => {
          if (res.ret === 200) {
            switch(+res.data.code) {
              case 0:
                this.data.holdImg = res.data.info[0].handset_view
                this.submit()
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
      } else {
        this.submit()
      }
    }
  },

  submit () {
      Promise.all([
        this.uploadFile({
          path: this.data.IDImgFront,
          formData: {
            'uid': app.globalData.depInfo.id,
            'token': app.globalData.depInfo.token,
            'filetype': 'front_view'
          }
        }),
        this.uploadFile({
          path: this.data.IDImgBack,
          formData: {
            'uid': app.globalData.depInfo.id,
            'token': app.globalData.depInfo.token,
            'filetype': 'back_view'
          }
        })
      ]).then(([front, back]) => {
        if (
          front.ret === 200 && front.data.code === 0
          && back.ret === 200 && back.data.code === 0
          ) {
          app.http({
            url: 'User.Users_auth',
            data: {
              uid: app.globalData.depInfo.id,
              token: app.globalData.depInfo.token,
              cer_no: this.data.credNum,
              front_view: front.data.info[0].front_view,
              back_view: back.data.info[0].back_view,
              handset_view: this.data.holdImg,
              tel: this.data.phone,
              name: this.data.name,
              cer_type: this.data.credTypeSub,
              auth_type: this.data.authType[this.data.authTypeSub].id
            }
          }).then(res => {
            wx.hideLoading()
            if (res.ret === 200) {
              switch (+res.data.code) {
                case 0:
                  this.setData({
                    status: '0'
                  })
                  break
                default:
                  wx.showToast({
                    title: res.data.msg || '数据错误',
                    icon: 'none'
                  })
              }
            } else {
              wx.hideLoading()
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
          } else {
            wx.showToast({
              title: '图片上传错误，请重新上传',
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
    if (this.data.name === '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
    } else if (!/^1[3-9][0-9]\d{8}$/.test(this.data.phone)) {
      wx.showToast({
        title: '手机号输入不正确',
        icon: 'none'
      })
    } else if (this.data.authTypeSub === -1) {
      wx.showToast({
        title: '请选择认证类型',
        icon: 'none'
      })
    } else if (this.data.credTypeSub === -1) {
      wx.showToast({
        title: '请选择证件类型',
        icon: 'none'
      })
    } else if (this.data.credNum === '') {
      wx.showToast({
        title: '请输入证件号',
        icon: 'none'
      })
    } else if (!this.data.IDImgFront) {
      wx.showToast({
        title: '请选择证件正面图片',
        icon: 'none'
      })
    } else if (!this.data.IDImgBack) {
      wx.showToast({
        title: '请选择证件背面图片',
        icon: 'none'
      })
    } else if (!this.data.agree) {
      wx.showToast({
        title: '请阅读并同意主播协议',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  },

  uploadFile (options) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${app.globalData.baseUrl}User.Uploadorc`,
        filePath: options.path,
        name: 'file',
        formData: options.formData,
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

  fetchStatus () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'User.Users_auth_status',
      data: {
        'uid': app.globalData.depInfo.id,
        'token': app.globalData.depInfo.token
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              status: res.data.info[0].status
            })
            break
          case 1001:
            this.setData({
              status: '3'
            })
            break
          default:
            wx.showToast({
              title: res.data.msg || '数据错误',
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

  handleEdit () {
    this.setData({
      status: '3'
    })
  }

})