// pages/team/create/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '', // 团队名称
    contact: '', // 联系人
    phone: '', // 手机号码
    pw: '', // 管理号码
    ID: '', // 身份证
    companyName: '', // 团队企业名称
    license: '', // 营业号
    legalPerson: '', // 法人
    notice: '', // 公告
    assign: '', // 团队分成
    lastAssign: '', // 上一次的输入
    IDImgFront: null, // 证件信息正面
    personImg: null, // 创建者个人照片
    licenseImg: null, // 营业执照
    bannerImg: null, // 团队展示图
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

  handleEmitContact (e) {
    this.setData({
      contact: e.detail.value.trim()
    })
  },

  handleEmitPhone (e) {
    this.setData({
      phone: e.detail.value.trim()
    })
  },

  handleEmitPW (e) {
    this.setData({
      pw: e.detail.value.trim()
    })
  },

  handleEmitID (e) {
    this.setData({
      ID: e.detail.value.trim()
    })
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

  handleEmitNotice (e) {
    this.setData({
      notice: e.detail.value.trim()
    })
  },

  handleEmitAssign (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastAssign = '' : void 0
    const val = value.trim().toString().match(/^[01](\.\d{0,2}?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastAssign = val[0]
      formatVal = val[0]
    }
    const result = val ? formatVal : this.data.lastAssign
   
    this.setData({
      assign: Number(result) > 1 ? 1 : result 
    })
  },

  checkboxChange(e) {
    this.data.agree = e.detail.value[0]
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
              personImg: tempFilePaths[0]
            })
            break
          case '3':
            this.setData({
              licenseImg: tempFilePaths[0]
            })
            break
          case '4':
            this.setData({
              bannerImg: tempFilePaths[0]
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
          personImg: null
        })
        break
      case '3':
        this.setData({
          licenseImg: null
        })
        break
      case '4':
        this.setData({
          bannerImg: null
        })
        break
    }
  },

  handleSubmit () {
    if (this.checkForm()) {
      wx.showLoading({
        title: '上传中'
      })
      Promise.all([
        this.uploadFile({
          path: this.data.IDImgFront
        }),
        this.uploadFile({
          path: this.data.personImg
        }),
        this.uploadFile({
          path: this.data.licenseImg
        }),
        this.uploadFile({
          path: this.data.bannerImg
        })
      ]).then(([ID, person, license, banner]) => {
        if (
          ID.ret === 200 && ID.data.code === '0'
          && person.ret === 200 && person.data.code === '0'
          && license.ret === 200 && license.data.code === '0'
          && banner.ret === 200 && banner.data.code === '0'          
        ) {
          app.http({
            url: 'Family.Create_family',
            data: {
              uid: app.globalData.depInfo.id,
              token: app.globalData.depInfo.token,
              family_name: this.data.name,
              uid_name: this.data.contact,
              qq: '',
              tel: this.data.phone,
              password: this.data.pw,
              cer_no: this.data.ID,
              cer_no_img: ID.data.info[0].kaihuhang_img,
              uid_img: person.data.info[0].kaihuhang_img,
              qiye_name: this.data.companyName,
              farendaibren_name: this.data.legalPerson,
              card: this.data.license,
              card_img: license.data.info[0].kaihuhang_img,
              id: app.globalData.depInfo.id,
              family_img: banner.data.info[0].kaihuhang_img,
              des: this.data.notice,
              commission: this.data.assign
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
          wx.hideLoading()
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
    }
  },

  checkForm () {
    if (this.data.name === '') {
      wx.showToast({
        title: '请输入团队名称',
        icon: 'none'
      })
    } else if (this.data.contact === '') {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none'
      })
    } else if (!/^1[3|4|5|8|9][0-9]\d{8}$/.test(this.data.phone)) {
      wx.showToast({
        title: '联系人手机号不正确',
        icon: 'none'
      })
    } else if (this.data.pw === '') {
      wx.showToast({
        title: '管理密码不能为空',
        icon: 'none'
      })
    } else if (this.data.ID === '') {
      wx.showToast({
        title: '请输入身份证号码',
        icon: 'none'
      })
    } else if (this.data.companyName === '') {
      wx.showToast({
        title: '请输入团队企业名称',
        icon: 'none'
      })
    } else if (this.data.license === '') {
      wx.showToast({
        title: '请输入营业号',
        icon: 'none'
      })
    } else if (this.data.legalPerson === '') {
      wx.showToast({
        title: '请输入企业法人名称',
        icon: 'none'
      })
    } else if (this.data.notice === '') {
      wx.showToast({
        title: '请输入团队公告',
        icon: 'none'
      })
    } else if (this.data.assign === '' || this.data.assign < 0.01 || this.data.assign > 1) {
      wx.showToast({
        title: '请输入团队分成0.01至1之间',
        icon: 'none'
      })
    } else if (!this.data.IDImgFront) {
      wx.showToast({
        title: '请选择创建者身份证正面图片',
        icon: 'none'
      })
    } else if (!this.data.personImg) {
      wx.showToast({
        title: '请选择创建者个人图片',
        icon: 'none'
      })
    } else if (!this.data.licenseImg) {
      wx.showToast({
        title: '请选择认证企业营业执照图片',
        icon: 'none'
      })
    } else if (!this.data.bannerImg) {
      wx.showToast({
        title: '请选择团队展示图',
        icon: 'none'
      })
    } else if (!this.data.agree) {
      wx.showToast({
        title: '请阅读并同意《dep团队第三方协议》',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  },

  uploadFile(options) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${app.globalData.baseUrl}Shop.Uploadimg`,
        filePath: options.path,
        name: 'kaihuhang_img',
        formData: {
          'uid': app.globalData.depInfo.id,
          'token': app.globalData.depInfo.token
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

  fetchStatus () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Family.Familystatus',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              status: res.data.info[0].status.toString()
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
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Family.Apply_for',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
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