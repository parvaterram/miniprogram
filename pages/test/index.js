// pages/test/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvas: false,
    imagePath: null,
    url: '',
    code: '',
    toView: '',
    scrollTop: 0,
    err: null,
    list: [],
    queue: [],
    stopScroll: false,
    test: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.socketConnect()
    this.setData({
      test: options.id || ''
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
  onShareAppMessage: function (e) {
    console.log(e)
    return {
      title: '测试特么',
      path: '/pages/test/index?id=586'
    }
  },

  formSubmit (e) {
    console.log(e)
  },

  formReset (e) {
    console.log(e)
  },

  scrollBottom () {
    this.scrollNode()
    const list = [...this.data.list, ...this.data.queue]
    this.setData({
      list: list.length > 30 ? list.slice(list.length - 20, list.length) : list,
      queue: [],
      stopScroll: false
    })
  },

  srun() {
    let n = 0
    this.timer = setInterval(() => {
      console.log(this.data.list, this.data.queue, this.data.stopScroll)
      if (!this.data.stopScroll) {
        const list = [...this.data.list, ++n]
        this.setData({
          list: list.length > 30 ? list.slice(list.length - 20, list.length) : list
        }, () => {
          this.scrollNode()
        })
        // this.scrollNode()
      } else {
        this.setData({
          queue: [...this.data.queue, ++n]
        })
      }
    }, 1000)
  },
  clear() {
    clearInterval(this.timer)
  },

  scroll (e) {
    
    if (e.detail.scrollTop + this.sViewH < this.data.scrollTop) {
      this.setData({
        stopScroll: true
      })
    } else {
      this.setData({
        stopScroll: false
      })
    }
  },

  lower (e) {
    console.log('lower')
    // this.data.stopScroll = false
    const list = [...this.data.list, ...this.data.queue]
    this.setData({
      list: list.length > 30 ? [] : [],
      stopScroll: false
    })
  },

  scrollNode () {
    wx.createSelectorQuery().select('.chat').boundingClientRect(res => {
      this.setData({
        scrollTop: res.height
      })
    }).exec()
  },

  statechange (e) {
    this.setData({
      code: e.detail.code
    })
  },

  liveErr (e) {
    this.setData({
      err: e
    })
  },

  testSocket () {
    wx.request({
      url: 'https://www.depforlive.com:19969',
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.code === 200) {
          this.connSocket()
        }
      },
      fail: res => {
        console.log('failllll')
      }
    })
  },

  connSocket () {
    const ws = wx.connectSocket({
      url: 'wss://www.depforlive.com:19969/',
      method: "GET",
      success: res => {
        console.log('success')
      },
      fail: res => {
        console.log('fail')
      }
    })
  },


  socketConnect () {
    wx.connectSocket({
      url: 'wss://www.depforlive.com:19967',
    })
    wx.onSocketOpen(res => {
      console.log('WebSocket连接已打开！')
      console.log(res)
    })
  },

  handleNext () {
    wx.navigateTo({
      url: '/pages/test/web/index'
    })
  },

  test () {
    let n = 0
    this.timer = setInterval(() => {
      this.setData({
        list: [...this.data.list, ++n]
      })
    }, 1000)
  },

  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = 200;
      size.h = 200;
    } catch (e) {
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    util.QR.draw(url, canvasId, cavW, cavH);
    // setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  handleStream () {
    wx.showLoading({
      title: '请稍后'
    })
    wx.request({
      url: 'https://www.depforlive.com/web/wxacode.php',
      method: 'POST',
      data: {
        path: 'pages/campaign/detail/index?id=34&type=3'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: res => {
        console.log(res)
        // const base = wx.arrayBufferToBase64(res.data)
        // const ctx = wx.createCanvasContext('canvas')
        
        // ctx.drawImage(`data:image/jpg;base64,${base}`, 0, 0, 430, 430)
        // ctx.draw()
        // this.drawCanvas(base)
        this.setData({
          canvas: true
        })
        const img = res.data.data
        wx.downloadFile({
          url: img.replace(/^http:/, 'https:'),
          success: res => {
            if (res.statusCode === 200) {
              this.drawCanvas(res.tempFilePath)
            }
          }
        })
      }
    })
  },

  drawCanvas (base) {
    const avatar = 'http://www.depforlive.com/data/upload/20180806/5b67d3862ac48.jpg'
    const cover = 'http://www.depforlive.com/api/upload//activity/20180815/05876729142578967.jpg'
    let [tmp, w, h] = ['', 0, 0]
    // wx.getImageInfo({
    //   src: cover.replace(/^http:/, 'https:'),
    //   success: res => {
    //     console.log(res)
    //     tmp = res.path
    //     w = res.width
    //     h = res.height
    //   }
    // })
    this.getImgInfo(cover).then(res => {
      tmp = res.path
      w = res.width
      h = res.height


      this.drawCont(avatar, res, base)


    }).catch(res => {
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  getImgInfo (url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url.replace(/^http:/, 'https:'),
        success: res => {
          resolve(res)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },

  drawCont (img, cover, base) {
    this.getImgInfo(img).then(res => {
      const [cw, ch] = [cover.width, cover.height]
      let [s, cfw, cfh, sx, sy] = [0, 0, 0, 50, 90]
      if (cw > ch) {
        if (cw / ch < 1.5) {
          s = 433 / ch
          cfw = ~~(cw * s)
          cfh = ~~(ch * s)
          sx = ~~((750 - cfw) / 2)
        } else {
          s = 650 / cw
          cfw = ~~(cw * s)
          cfh = ~~(ch * s)
          sx = ~~((750 - cfw) / 2)
          sy = ~~((433 - cfh) / 2)
        }
      } else {
        s = 433 / ch
        cfw = ~~(cw * s)
        cfh = ~~(ch * s)
        sx = ~~((750 - cfw) / 2)
      }
      let [w, h] = [0, 0]
      if (res.width > res.height) {
        w = res.height
        h = res.height
      } else {
        w = res.width
        h = res.width
      }

      const ctx = wx.createCanvasContext('canvas')
      const canvas = ctx.canvas
      

      ctx.save()
      ctx.fillStyle = '#f2f2f2'
      ctx.fillRect(0, 0, 750, 880)
      ctx.restore()

      // ctx.save()
      // ctx.beginPath()
      // ctx.arc(80, 40, 30, 0, 2 * Math.PI)
      // ctx.clip()
      // ctx.drawImage(res.path, 0, 0, w, h, 50, 10, 60, 60)
      // ctx.restore()


      ctx.save()
      ctx.textBaseline = "bottom"
      ctx.setFontSize(24)
      ctx.fillStyle = "#101010"
      ctx.fillText("活动名称", 50, 54)
      ctx.restore()

      
      ctx.save()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(50, 90, 650, 433)

      ctx.drawImage(cover.path, 0, 0, cw, ch, sx, sy, cfw, cfh)
      ctx.restore()
      
      ctx.save()
      ctx.setFontSize(24)
      ctx.fillStyle = "#101010"
      const txt = '金桔果实含有丰富的维生素C、金桔甙等成分'
      const metrics = ctx.measureText(txt).width
      const len = Math.ceil(metrics / 288)
      const startY = Math.floor((13 - len) / 2)
      for (let i = 0, t = 13; i < len; i++) {
        const text = txt.slice(t - 13, t)
        ctx.fillText(text, 50, 553 + ((i + startY) * 24))
        t += 13
      }
      ctx.restore()

      ctx.save()
      ctx.drawImage(base, 0, 0, 430, 430, 400, 543, 300, 300)
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750,
          height: 880,
          destWidth: 750,
          destHeight: 880,
          canvasId: 'canvas',
          success:  res => {
            wx.hideLoading()
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: res => {
                this.setData({
                  canvas: false
                })
              }
            })
          }
        })
      })
    })
  },


})