// pages/commodity/waresIssue/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    isEdit: false,
    info: {},
    type: 2,
    sale: 0,
    region: [],
    aging: ['一个月', '三个月', '六个月', '一年'],   // 使用时效
    date: [1, 3, 6, 12],
    agingSub: -1,
    imgList: [],
    coverIndex: 0, // 默认第一张为封面
    imgIdList: [], // 图片上传后的id列表
    fileList: [], // 文件url
    imgSub: 0,  // 图片列表的下标
    name: '',
    price: '',
    primePrice: '',
    stock: '',
    intro: '',
    desc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.type = options.type
    if (options.id) {
      this.setData({
        isEdit: true
      })
      this.data.id = options.id
      this.data.sale = options.sale
      this.fetchData()
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

  fetchData () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Shop.Goodsedit',
      data: {
        uid: app.globalData.depInfo.id,
        shop_id: this.data.id
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            const info = res.data.info[0]
            this.setData({
              name: info.goods_name,
              price: info.money,
              stock: info.inventory,
              intro: info.goods_dec,
              desc: info.address,
              region: [info.pro, info.city, info.area],
              agingSub: this.data.date.findIndex(item => item === +info.expiration_time),
              imgList: info.goods_imgs,
              coverIndex: info.goods_imgs.find(item => item === info.goods_img) || 0
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
          title: res.msg|| '数据错误',
          icon: 'none'
        })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: res || '网络错误',
        icon: 'none'
      })
    })

  },

  handleEmitName (e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  handleEmitPrice(e) {
    this.setData({
      price: e.detail.value.trim()
    })
  },

  handleEmitPrimePrice (e) {
    this.setData({
      primePrice: e.detail.value.trim()
    })
  },

  handleEmitStock(e) {
    this.setData({
      stock: e.detail.value.trim()
    })
  },

  handleEmitIntro(e) {
    this.setData({
      intro: e.detail.value.trim()
    })
  },

  handleEmitDesc(e) {
    this.setData({
      desc: e.detail.value.trim()
    })
  },

  regionChange (e) {
    const val = e.detail.value
    this.setData({
      region: val
    })
  },

  agingChange (e) {
    const val = e.detail.value
    this.setData({
      agingSub: val
    })
  },

  handleChooseImage () {
    const _this = this
    wx.chooseImage({
      count: 6 - this.data.imgList.length,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        const newArr = tempFilePaths.map(item => ({
          url: item,
          file: item
        }))
        _this.setData({
          imgList: _this.data.imgList.concat(newArr)
        })
      },
    })
  },

  handleImagePreview (e) {
    const current = e.target.dataset.src
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgList // 需要预览的图片http链接列表  
    })
  },

  handleDel (e) {
    const src = e.target.dataset.src
    this.setData({
      imgList: this.data.imgList.filter(item => item.url !== src)
    })
  },

  handleSetCover (e) {
    const src = e.target.dataset.src
    const idx = this.data.imgList.findIndex(item => item.url === src)
    this.setData({
      coverIndex: idx
    })
  },

/**
 * 提交数据
 */
  handleSubmit () {
    if (!this.data.isEdit) {
      if (this.checkForm()) {
        this.data.imgIdList = []
        this.data.imgSub = 0
        wx.showLoading({
          title: '上传中',
        })
        this.data.fileList = this.data.imgList.filter(item => item.file)
        this.uploadImage()
      }
    } else {
      if (this.checkForm()) {
        wx.showLoading({
          title: '上传中',
        })
        this.data.imgSub = 0
        const former = this.data.imgList.filter(item => !item.file).map(item => item.id)
        this.data.fileList = this.data.imgList.filter(item => item.file)
        this.data.imgIdList = former
        this.uploadImage()
      }
    }
  },

  checkForm () {
    if (this.data.name === '') {
      wx.showToast({
        title: '请填写商品名称',
        icon: 'none'
      })
    } else if (this.data.price === '') {
      wx.showToast({
        title: '请填写商品促销价格',
        icon: 'none'
      })
    } else if (!this.data.primePrice) {
      wx.showToast({
        title: '请填写商品原价',
        icon: 'none'
      })
    } else if (this.data.stock === '') {
      wx.showToast({
        title: '请填写商品库存',
        icon: 'none'
      })
    } else if (this.data.intro === '') {
      wx.showToast({
        title: '请填写商品简介',
        icon: 'none'
      })
    } else if (this.data.region.length === 0) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
    } else if (this.data.desc === '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
    } else if (this.data.agingSub === -1) {
      wx.showToast({
        title: '请选择使用时效',
        icon: 'none'
      })
    } else if (this.data.imgList.length === 0) {
      wx.showToast({
        title: '请选择商品图片',
        icon: 'none'
      })
    } else if (!this.data.imgList[this.data.coverIndex]) {
      wx.showToast({
        title: '请选择商品图片中的一张设为封面图片',
        icon: 'none'
      })
    } else {
      return true
    }
    return false
  },

  uploadImage () {
    wx.uploadFile({
      url: `${app.globalData.baseUrl}Shop.Uploadshopimg`,
      filePath: this.data.fileList[this.data.imgSub].file,
      name: 'img',
      formData: {
        'uid': app.globalData.depInfo.id,
        'token': app.globalData.depInfo.token
      },
      success: rs => {
        const res = JSON.parse(rs.data)
        if (res.ret === 200) {
          if (res.data.isok === '1') {
            this.data.imgSub++
            this.data.imgIdList.push(res.data.id)
            if (this.data.imgSub < this.data.fileList.length) {
              this.uploadImage()
            } else {
              this.submitForm()
            }
          } else {
            wx.showToast({
              title: res.msg || '上传失败',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: res.msg || '网络错误，2008',
            icon: 'none'
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: '网络错误，2008',
          icon: 'none'
        })
      }
    })
  },

  submitForm () {
    let url = 'Shop.Addgoods'
    const data = {
      uid: app.globalData.depInfo.id,
      token: app.globalData.depInfo.token,
      type: this.data.type,
      inventory: this.data.stock,
      moneys: this.data.price,
      o_money: this.data.primePrice,
      goodsname: this.data.name,
      goodsimgid: this.data.imgIdList[this.data.coverIndex],
      postage: 0,
      decs: this.data.intro,
      imgids: this.data.imgIdList.join('-'),
      pros: this.data.region[0],
      citys: this.data.region[1],
      areas: this.data.region[2],
      addresss: this.data.desc,
      expiration_times: this.data.date[this.data.agingSub]
    }
    if (this.data.isEdit) {
      url = 'Shop.Goodseditpost'
      data.shopid = this.data.id
      data.isgo = this.data.sale
    }
    app.http({
      url: url,
      data: data
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            const info = res.data.info
            if (Array.isArray(info)) {
              if (+info[0].isok === 1) {
                if (this.data.isEdit) {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'none',
                    duration: 2000,
                    success(res) {
                      setTimeout(() => {
                        wx.navigateTo({
                          url: '/pages/commodity/tradeList/index'
                        })
                      }, 2000)
                    }
                  })
                } else {
                  wx.showToast({
                    title: '创建成功',
                    icon: 'none',
                    duration: 2000,
                    success(res) {
                      setTimeout(() => {
                        wx.navigateTo({
                          url: '/pages/commodity/tradeSubmit/index'
                        })
                      }, 2000)
                    }
                  })
                }
              } else {
                wx.showToast({
                  title: res.data.msg || '创建失败',
                  icon: 'none'
                })
              }
            } else {
              if (+info.isok === 1) {
                if (this.data.isEdit) {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'none',
                    duration: 2000,
                    success(res) {
                      setTimeout(() => {
                        wx.navigateTo({
                          url: '/pages/commodity/tradeList/index'
                        })
                      }, 2000)
                    }
                  })
                } else {
                  wx.showToast({
                    title: '创建成功',
                    icon: 'none',
                    duration: 2000,
                    success(res) {
                      setTimeout(() => {
                        wx.navigateTo({
                          url: '/pages/commodity/tradeSubmit/index'
                        })
                      }, 2000)
                    }
                  })
                }
              } else {
                wx.showToast({
                  title: res.data.msg || '创建失败',
                  icon: 'none'
                })
              }
            }
            break
          default:
            wx.showToast({
              title: res.data.msg || '网络错误，2012',
              icon: 'none'
            })
        }
      } else {
        wx.showToast({
          title: res.msg || '网络错误，2010',
          icon: 'none'
        })
      }
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: res || '网络错误，2011',
        icon: 'none'
      })
    })
  }
})