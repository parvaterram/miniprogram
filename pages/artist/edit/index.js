// pages/artist/edit/index.js
const region = require('../../../utils/region.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false, // 是否是编辑状态
    mulIndex: [0, 0], // 多列选择的下标
    mulArray: [],
    citys: [],
    name: '', // 艺名
    height: '', // 身高
    weight: '', // 体重
    chest: '', // 胸围
    waist: '', // 腰围
    arm: '', // 臂围
    shoesize: '', // 鞋码
    intro: '', // 个人简介
    region: [], // 活动区域
    cover: '', //
    coverFile: null, // 封面图片
    works: [], // 作品图片
    video: null, // 视频
    poster: '',
    videoFile: null, // 视频文件
    lastInput: '', // 上一次输入
    sub: 0 // 下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mulArray: [
        region.prov,
        ['北京市']
      ],
      citys: region.citys
    })
    this.fetchData()
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

  fetchData () {
    wx.showLoading({
      title: '加载中'
    })
    app.http({
      url: 'Art.Art_userinfo',
      data: {
        uid: app.globalData.depInfo.id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info) {
              const info = res.data.info
              this.setData({
                isEdit: true,
                name: info.art_name,
                height: info.height,
                weight: info.weight,
                chest: info.chest,
                waist: info.waist,
                arm: info.hip,
                shoesize: info.shoe_size,
                intro: info.experience,
                region: info.cityinfo.map(item => `${item.pro}-${item.city}`),
                cover: info.img_cover,
                works: info.imginfo,
                video: info.video_url,
                poster: info.video_img
              })
            } else {
              this.setData({
                isEdit: false
              })
            }
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

  handleRegionChange (e) {
    const val = e.detail.value
    const prov = this.data.mulArray[0][val[0]]
    const city = this.data.citys[val[0]].city[val[1] || 0]
    const item = `${prov}-${city.slice(0, 2)}`
    if (this.data.region.some(arg => arg === item)) {
      this.setData({
        mulIndex: e.detail.value
      })
      wx.showToast({
        title: '该区域已存在',
        icon: 'none'
      })
    } else if (this.data.region.length >= 3) {
      this.setData({
        mulIndex: e.detail.value
      })
      wx.showToast({
        title: '活动区域最多只可添加三个',
        icon: 'none'
      })
    } else {
      this.setData({
        mulIndex: e.detail.value,
        region: [...this.data.region, item]
      })
    }
  },

  handleDelCity (e) {
    const val = e.target.dataset.tag
    this.setData({
      region: this.data.region.filter(item => item !== val)
    })
  },

  handleColumnchange (e) {
    switch (e.detail.column) {
      case 0:
        this.setData({
          'mulArray[1]': this.data.citys[e.detail.value].city
        })
        break
    }
  },

  handleEmitName (e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  handleEmitHeight (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      height: val ? formatVal : this.data.lastInput
    })
  },

  handleEmitWeight (e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      weight: val ? formatVal : this.data.lastInput
    })
  },

  handleEmitChest(e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      chest: val ? formatVal : this.data.lastInput
    })
  },

  handleEmitWaist(e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      waist: val ? formatVal : this.data.lastInput
    })
  },

  handleEmitArm(e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      arm: val ? formatVal : this.data.lastInput
    })
  },

  handleEmitShoesize(e) {
    const value = e.detail.value.trim()
    !value ? this.data.lastInput = '' : void 0
    const val = value.trim().toString().match(/^\d+(\.?\d?)?$/)
    let formatVal = 0
    if (val) {
      this.data.lastInput = val[0]
      formatVal = val[0].replace(/^0*(?=\d+)/, '')
    }
    this.setData({
      shoesize: val ? formatVal : this.data.lastInput
    })
  },

  handleEmitIntro (e) {
    this.setData({
      intro: e.detail.value.trim()
    })
  },

  handleChooseCover () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        if (res.tempFiles[0].path.match(/(\.png)|(\.jpg)|(\.jpeg)$/g)) {
          this.setData({
            cover: tempFilePaths[0],
            coverFile: tempFilePaths[0]
          })
        }
      }
    })
  },

  handleDelCover (e) {
    this.setData({
      cover: '',
      coverFile: null
    })
  },

  handleChooseFile () {
    wx.chooseImage({
      count: 9 - this.data.works.length,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        const tempFiles = res.tempFiles
        let stack = []
        tempFiles.forEach((item, index) => {
          if (item.path.match(/(\.png)|(\.jpg)|(\.jpeg)$/g)) {
            if (this.data.works.length < 9) {
              ++this.data.sub
              stack.push({
                id: this.data.sub,
                url: tempFilePaths[index],
                file: tempFilePaths[index]
              })
            }
          }
        })
        stack.length > 0 && this.setData({
          works: [...this.data.works, ...stack]
        })
      }
    })
  },

  handleDel (e) {
    const val = e.target.dataset.src
    this.setData({
      works: this.data.works.filter(item => item.url !== val)
    })
  },

  handleChooseVideo () {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      success: res => {
        if (res.tempFilePath.match(/\.mp4$/g)) {
          if (res.size / 1024 / 1024 < 10) {
            this.setData({
              video: res.tempFilePath,
              videoFile: res.tempFilePath,
              poster: res.thumbTempFilePath
            })
          } else {
            wx.showToast({
              title: '视频大小超过限制',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  handleDelVideo () {
    this.setData({
      video: '',
      poster: '',
      videoFile: null
    })
  },

  checkForm () {
    if (this.data.name === '') {
      wx.showToast({
        title: '请输入艺名',
        icon: 'none'
      })
    } else if (this.data.region.length === 0) {
      wx.showToast({
        title: '至少选择一个活动区域',
        icon: 'none'
      })
    } else if (!this.data.cover) {
      wx.showToast({
        title: '请选择封面图',
        icon: 'none'
      })
    } else if (this.data.works.length === 0) {
      wx.showToast({
        title: '请选择作品图片',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  },

  handleSubmit () {
    if (this.checkForm()) {
      wx.showLoading({
        title: '上传中'
      })
      this.uploadWorks()
        .then(res => {
          const arr = res.map(item => item.data.info[0].img_id)
          return this.uploadCover(arr)
        })
        .then(res => {
          const alreadyIds = this.data.works.filter(item => !item.file).map(item => item.id)
          const formData = {
            uid: app.globalData.depInfo.id,
            token: app.globalData.depInfo.token,
            art_name: this.data.name,
            height: this.data.height,
            weight: this.data.weight,
            waist: this.data.waist,
            chest: this.data.chest,
            hip: this.data.arm,
            shoesize: this.data.shoesize,
            cityinfo: this.data.region.join(','),
            img_ids: [...alreadyIds, ...res.idsArr].join(','),
            img: res.coverImg,
            isdelmp4: this.data.videoFile ? 0 : 1
          }
          this.data.intro ? formData.experience = this.data.intro : void 0
          this.finalySubmit({
            url: this.data.isEdit ? 'Art.Update_users' : 'Art.Add_users',
            data: formData
          })
          
        }).catch(res => {
          wx.hideLoading()
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        })
    }
  },

  uploadCover (idsArr) {
    return new Promise((resolve, reject) => {
      if (this.data.coverFile) {
        wx.uploadFile({
          url: `${app.globalData.baseUrl}Shop.Uploadimg`,
          filePath: this.data.coverFile,
          name: 'kaihuhang_img',
          formData: {
            'uid': app.globalData.depInfo.id,
            'token': app.globalData.depInfo.token
          },
          success: rs => {
            const res = JSON.parse(rs.data)
            const result = {
              coverImg: res.data.info[0].kaihuhang_img,
              idsArr
            }
            resolve(result)
          },
          fail: res => {
            reject(res)
          }
        })
      } else {
        const result = {
          coverImg: this.data.cover,
          idsArr
        }
        resolve(result)
      }
    })
  },

  uploadWorks () {
    const taskList = this.data.works.filter(item => item.file)
    return Promise.all(taskList.map(item => this.uploadImgGetId({
      path: item.file
      })))
  },

  uploadImgGetId (options) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${app.globalData.baseUrl}Art.Uploadimg`,
        filePath: options.path,
        name: 'img',
        formData: {
          'uid': app.globalData.depInfo.id,
          'token': app.globalData.depInfo.token
        },
        success: rs => {
          const res = JSON.parse(rs.data)
          if (res.ret === 200 && Number(res.data.code) === 0) {
            resolve(res)
          } else {
            reject(res)
          }
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },

  finalySubmit (options) {
    if (this.data.videoFile) {
      wx.uploadFile({
        url: `${app.globalData.baseUrl}${options.url}`,
        filePath: this.data.videoFile,
        name: 'mp4',
        formData: options.data,
        success: rs => {
          const res = JSON.parse(rs.data)
          wx.hideLoading()
          if (res.ret === 200) {
            switch (+res.data.code) {
              case 0:
                wx.showToast({
                  title: '提交成功',
                  icon: 'none'
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
        },
        fail: res => {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      })
    } else {
      app.http({
        url: options.url,
        data: options.data
      }).then(res => {
        wx.hideLoading()
        if (res.ret === 200) {
          switch (+res.data.code) {
            case 0:
              wx.showToast({
                title: '提交成功',
                icon: 'none'
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
  }
})