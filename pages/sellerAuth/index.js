// pages/sellerAuth/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '5', // 无申请状态
    companyName: '', // 企业名
    license: '', // 执照
    legalPerson: '', // 法人
    contacts: '', // 联系人
    region: [], // 省市区数组
    address: '', // 详细地址
    licenseImg: null, // 营业执照正面
    IDImgFront: null, // 身份证正面
    IDImgBack: null, // 身份证背面
    agree: false // 同意协议
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

  handleEmitCompanyName (e) {
    this.setData({
      companyName: e.detail.value.trim()
    })
  },

  handleEmitLicense (e) {
    this.setData({
      license: e.detail.value.trim()
    })
  },

  handleEmitLegalPerson (e) {
    this.setData({
      legalPerson: e.detail.value.trim()
    })
  },

  handleEmitContacts (e) {
    this.setData({
      contacts: e.detail.value.trim()
    })
  },

  handleRegionChange (e) {
    this.setData({
      region: e.detail.value
    })
  },

  handleEmitAddress (e) {
    this.setData({
      address: e.detail.value.trim()
    })
  },

  handleChooseFile (e) {
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
              licenseImg: tempFilePaths[0]
            })
            break
          case '2':
            this.setData({
              IDImgFront: tempFilePaths[0]
            })
            break
          case '3':
            this.setData({
              IDImgBack: tempFilePaths[0]
            })
            break
        }
      }
    })
  },

  handleDel (e) {
    switch (e.target.dataset.type) {
      case '1':
        this.setData({
          licenseImg: null
        })
        break
      case '2':
        this.setData({
          IDImgFront: null
        })
        break
      case '3':
        this.setData({
          IDImgBack: null
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
      Promise.all([
        this.uploadFile({
          url: 'Shop.Uploadimg',
          path: this.data.IDImgFront,
          name: 'kaihuhang_img',
          formData: {
            'uid': app.globalData.depInfo.id,
            'token': app.globalData.depInfo.token
          }
        }),
        this.uploadFile({
          url: 'Shop.Uploadimg',
          path: this.data.IDImgBack,
          name: 'kaihuhang_img',
          formData: {
            'uid': app.globalData.depInfo.id,
            'token': app.globalData.depInfo.token
          }
        })
      ]).then(([a, b]) => {
        if (a.ret === 200 && a.data.code === '0' && b.ret === 200 && b.data.code === '0') {
          this.uploadFile({
            url: 'Shop.Shoporc2',
            path: this.data.licenseImg,
            name: 'bs_img',
            formData: {
              'uid': app.globalData.depInfo.id,
              'token': app.globalData.depInfo.token,
              is_auth: 1,
              enter_name: this.data.companyName,
              legal_rep: this.data.legalPerson,
              business: this.data.license,
              pros: this.data.region[0],
              citys: this.data.region[1],
              areas: this.data.region[2],
              addresss: this.data.address,
              fzimg: a.data.info[0].kaihuhang_img,
              fbimg: b.data.info[0].kaihuhang_img,
              tel: this.data.contacts
            }
          }).then(res => {
            wx.hideLoading()
            if (res.ret === 200) {
              switch (+res.data.code) {
                case 0:
                  this.fetchStatus()
                  break
                default:
                  wx.showToast({
                    title: res.data.msg || '数据错误',
                    icon: 'none'
                  })
              }
            } else {
              wx.showToast({
                title: '数据错误',
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
          wx.hideLoading()
          wx.showToast({
            title: '图片上传错误，请重新上传',
            icon: 'none'
          })
        }
      }).catch(res => {
        wx.showToast({
          title: JSON.stringify(res) || '网络错误',
          icon: 'none'
        })
      })
    }
  },

  checkForm () {
    if (this.data.companyName === '') {
      wx.showToast({
        title: '请输入企业名称',
        icon: 'none'
      })
    } else if (this.data.license === '') {
      wx.showToast({
        title: '请输入三合一一页执照号',
        icon: 'none'
      })
    } else if (this.data.legalPerson === '') {
      wx.showToast({
        title: '请输入法定代表人姓名',
        icon: 'none'
      })
    } else if (!/^1[3-9][0-9]\d{8}$/.test(this.data.contacts)) {
      wx.showToast({
        title: '联系人手机号不正确',
        icon: 'none'
      })
    } else if (this.data.region.length === 0) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
    } else if (this.data.address === '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    } else if (!this.data.licenseImg) {
      wx.showToast({
        title: '请选择营业执照正面图片',
        icon: 'none'
      })
    } else if (!this.data.IDImgFront) {
      wx.showToast({
        title: '请选择法人身份证正面图片',
        icon: 'none'
      })
    } else if (!this.data.IDImgBack) {
      wx.showToast({
        title: '请选择法人身份证背面图片',
        icon: 'none'
      })
    } else if (!this.data.agree)  {
      wx.showToast({
        title: '请阅读并同意商家合作协议',
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
        url: `${app.globalData.baseUrl}${options.url}`,
        filePath: options.path,
        name: options.name,
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
      title: '加载中',
    })
    app.http({
      url: 'Shop.Shopocrstatus',
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
              icon: 'none'
            })
        }
      } else {
        wx.showToast({
          title: '数据错误',
          icon: 'none'
        })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: JSON.stringify(res) || '网络错误',
        icon: 'none'
      })
    })
  },

  handleEdit () {
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Shop.To_apply_for',
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
              status: '3'
            })
            break
          default:
            wx.showToast({
              title: res.data.msg || '网络错误',
              icon: 'none'
            })
        }
      } else {
        wx.showToast({
          title: res.msg || '网络错误',
          icon: 'none'
        })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: JSON.stringify(res) || '网络错误',
        icon: 'none'
      })
    })
  }
})