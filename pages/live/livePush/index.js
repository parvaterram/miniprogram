// pages/live/livePush/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: '',
    open: '',
    message: '',
    liveURL: '',
    aspect: '9:16',
    mode: 'HD',
    torch: false,
    liveHeight: 300,
    fullscreen: false,
    windowHeight: 600,
    defaultHeight: 300,
    height: 250,
    list: [],
    queue: [],
    stopScroll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.live.isPushBack = true
    this.setData({
      mode: app.live.mode,
      liveURL: app.live.createRoom.push
    })
    this.setHeight()
    // this.fetchData()
    this.changeLive()
    this.initDATA()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ctx = wx.createLivePusherContext('pusher')
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
    return {
      title: app.live.data.live.title || '直播间',
      path: `/pages/live/livePlay/index?roomnum=${app.globalData.depInfo.id}`
    }
  },

  handleEmitNews (e) {
    this.setData({
      news: e.detail.value.trim()
    })
  },

  userinfo: null,
  ws: null,

  /**
   * 改变直播状态 islive
   */
  changeLive () {
    app.http({
      url: 'Live.ChangeLive',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        stream: app.live.createRoom.stream,
        status: 1
      }
    }).then(res => {
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            break
          default:
            wx.showToast({
              title: res.data.msg || '数据错误，开播失败',
              icon: 'none'
            })
        }
      } else {
        wx.showToast({
          title: res.msg || '网络错误，开播失败',
          icon: 'none'
        })
      }
    }).catch(res => {
      wx.showToast({
        title: '网络错误，开播失败',
        icon: 'none'
      })
    })
  },

/**
 * 初始化PC的DATA
 */
  initDATA () {
    wx.showLoading({
      title: '初始化中',
    })
    app.fetch({
      data: {
        g: 'Home',
        m: 'Show',
        a: 'api',
        roomnum: app.globalData.depInfo.id,
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      app.live.data = res
      this.inituser()
      // you
    }).catch(res => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

/**
 * 初始化socket 的user
 */
  inituser () {
    const anchor = app.live.data.anchorinfoj
    app.fetch({
      data: {
        g: 'home',
        m: 'show',
        a: 'setNodeInfo',
        showid: anchor.id,
        stream: anchor.stream
      }
    }).then(res => {
      wx.hideLoading()
      if (res.error === 0) {
        this.userinfo = res.userinfo
        this.socketShook()
      } else {
        wx.showModal({
          title: '提示',
          content: '信息初始化失败，请重试'
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

  socketShook () {
    wx.request({
      url: 'https://www.depforlive.com:19969',
      method: 'GET',
      success: res => {
        console.log(res)
        if (res.data.code === 200) {
          this.socketInit()
        }
      },
      fail: res => {
        wx.showToast({
          title: '聊天服务器错误',
          icon: 'none'
        })
      }
    })
  },

  socketInit () {
    this.ws = wx.connectSocket({
      url: 'wss://www.depforlive.com:19969/',
      method: "GET",
      success: res => {
        console.log('success')
      },
      fail: res => {
        console.log('fail')
      }
    })
    
    this.ws.onOpen(() => {
      this.setData({
        open: '打开了'
      })
      const msg = {
        evt: 'conn',
        data: {
          uid: this.userinfo.id,
          roomnum: this.userinfo.roomnum,
          nickname: this.userinfo.user_nicename,
          stream: this.userinfo.stream,
          equipment: 'pc',
          token: this.userinfo.token
        }
      }
      this.ws.send({
        data: JSON.stringify(msg)
      })

      const enterChat = setInterval(() => {
        if (this.enterChat !== 1) {
          this.showMsg({
            type: 1,
            name: '系统消息',
            ct: '聊天服务器未连接，请刷新'
          })
        } else {
          const DATA = app.live.data
          if (DATA.liveinfoj && DATA.liveinfoj.islive == 1 && DATA) {
            // this.getzombie(DATA.userinfo.id, this.userinfo.stream)
          }
          clearInterval(enterChat)
        }
      }, 2000)
    })

    this.ws.onMessage(res => {
      const msg = res.data
      const message = JSON.parse(msg || null)
      // console.log(message)
      const data = message.data || {}
      switch (message.evt) {
        case 'conn':
          if (message.msg[0] === 'ok') {
            this.enterChat = 1
            const DATA = app.live.data
            if (DATA.userinfo && DATA.userinfo.id && DATA.anchorinfoj.id && DATA.userinfo.id !== DATA.anchorinfoj.id) {
              const msgStr = {
                msg: [{
                  _method_: 'requestFans',
                  action: '',
                  timeStamp: this.nowDate(),
                  ct: '',
                  msgtype: 1,
                  level: '',
                  uid: '',
                  sex: '',
                  uname: '',
                  uhead: '',
                  usign: '',
                  city: '',
                  level: ''
                }],
                retcode: '000000',
                retmsg: 'ok'
              }
              this.emitMsg('broadcast', msgStr)
            }
          }
          break
        case 'broadcastingListen':
          if (data.msg === 'stopplay') {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 5000)
            wx.showModal({
              title: '提示',
              content: '该直播间涉嫌违规，已被停播',
              success: res => {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            this.distribute(data)
          }
          break
        case 'heartbreat':
          this.emitMsg('heartbeat', 'heartbeat')
          break
        default:
          console.log(data)
      }
    })

    this.ws.onClose(res => {
      console.log('close')
    })
  },

  emitMsg (evt, msg) {
    this.ws.send({
      data: JSON.stringify({evt, data: msg})
    })
  },

  showMsg (data) {
    if (this.data.stopScroll) {
      this.setData({
        queue: [...this.data.queue, data]
      })
    } else {
      const list = [...this.data.list, data]
      this.setData({
        list: list.length > 250 ? list.slice(list.length - 100, list.length) : list
      }, () => {
        this.scrollNode()
      })
    }
  },

  distribute(data) {
    const msg = data.msg[0]
    const method = msg._method_
    switch (method) {
      // 聊天信息
      case 'SendMsg':
        this.sendMsg(msg)
        break

      // 赠送礼物
      case 'SendGift':
        this.sendGift(msg)
        break

      // 喇叭
      case 'SendHorn':
        this.sendHorn(msg)
        break

      // 系统信息
      case 'SystemNot':
        this.systemNot(msg)
        break

      // 系统信息
      case 'ShutUpUser':
        this.systemNot(msg)
        break

      // 开关播
      case 'StartEndLive':
        this.showEndRecommend(msg)
        break

      // 关播
      case 'disconnect':
        this.disconnect(msg)
        break
      // 踢人
      case 'KickUser':
        this.KickUser(msg)
        break

      // 弹幕
      case 'SendBarrage':
        this.sendBigHorn(msg)
        break

      case 'light':
        this.setLight(msg)
        break
      default:
        console.log('error')
    }
  },

  sendMsg (data) {
    const type = data.msgtype
    if (type == 0) {
      this.showMsg({
        type: 2,
        name: data.ct.user_nicename,
        ct: ''
      })
    } else if (type == 2) {
      this.showMsg({
        type: 3,
        level: Number(data.level),
        name: data.uname,
        ct: data.ct
      })
    }
  },

  sendGift(data) {
    this.showMsg({
      type: 4,
      level: +data.level,
      name: data.uname,
      giftname: data.ct.giftname,
      gifticon: `http://www.depforlive.com${data.ct.gifticon}`,
      giftcount: data.ct.giftcount
    })
  },

  systemNot(data) {
    this.showMsg({
      type: 1,
      name: '系统消息',
      ct: data.ct
    })
  },

  sendHorn(data) {

  },

  showEndRecommend(data) {
    const action = data.action
    if (action == 18) {
      // 请求接口 获取推荐
    } else {
      location.href = ''
    }
  },

  disconnect(data) {

  },

  handleSend () {
    if (this.data.news) {
      app.fetch({
        data: {
          g: 'home',
          m: 'Spend',
          a: 'isShutUp',
          showid: app.live.data.anchorinfoj.id
        }
      }).then(res => {
        if (res.info == 1) {
          wx.showModal({
            title: '提示',
            content: '你已经被禁言',
          })
        } else {
          let msg = {}
          const DATA = app.live.data
          if (res.admin === 60) {
            msg = {
              msg: [{
                _method_: 'SystemNot',
                action: '13',
                ct: this.data.news,
                msgtype: 4,
                uname: DATA.userinfo.user_nicename,
                toname: DATA.anchorinfoj.user_nicename,
                touid: DATA.anchorinfoj.id,
                uid: DATA.userinfo.id,
                level: DATA.userinfo.level
              }],
              retcode: '000000',
              retmsg: 'ok'
            }
          } else {
            msg = {
              msg: [{
                _method_: 'SendMsg',
                action: 0,
                ct: this.data.news,
                msgtype: 2,
                tougood: '',
                touid: '',
                touname: '',
                ugood: DATA.userinfo.id,
                uid: DATA.userinfo.id,
                uname: DATA.userinfo.user_nicename,
                level: DATA.userinfo.level
              }],
              retcode: '000000',
              retmsg: 'ok'
            }
          }
          this.emitMsg('broadcast', msg)
          this.setData({
            news: ''
          })
        }
      }).catch(res => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      })
    } else {
      wx.showToast({
        title: '请输入发送的内容',
        icon: 'none'
      })
    }
    
  },

  handleScroll(e) {
    console.log(e.detail.scrollTop, this.data.height, this.data.scrollTop)
    if (e.detail.scrollTop + this.data.height < this.data.scrollTop) {
      this.setData({
        stopScroll: true
      })
    } else {
      const list = [...this.data.list, ...this.data.queue]
      this.setData({
        list: list.length > 250 ? list.slice(list.length - 100, list.length) : list,
        queue: [],
        stopScroll: false
      })
    }
  },

  handleLower(e) {
    const list = [...this.data.list, ...this.data.queue]
    this.setData({
      list: list.length > 250 ? list.slice(list.length - 100, list.length) : list,
      queue: [],
      stopScroll: false
    })
  },

  handleReadNews(e) {
    this.scrollNode()
    const list = [...this.data.list, ...this.data.queue]
    this.setData({
      list: list.length > 250 ? list.slice(list.length - 100, list.length) : list,
      queue: [],
      stopScroll: false
    })
  },

  statechange (e) {
    switch (+e.detail.code) {
      case -1307:
        wx.showModal({
          title: '提示',
          content: '网络断连，且经多次重连抢救无效，请重新开播'
        })
        break
      case 1101:
        wx.showToast({
          title: '网络状况不佳，请尝试用标清直播',
        })
        break
      case 3001:
      case 3002:
      case 3003:
      case 3004:
      case 3005:
        wx.showModal({
          title: '提示',
          content: '服务器错误，请稍后再试'
        })
        break
      default:
        console.log(e)
    }
  },

  liveError (e) {
    switch (+e.detail.errCode) {
      case 10001:
        wx.showModal({
          title: '提示',
          content: '用户禁止使用摄像头'
        })
        break
      case 10002:
        wx.showModal({
          title: '提示',
          content: '用户禁止使用录音'
        })
        break
    }
  },

  nowDate () {
    const D = new Date()
    const h = D.getHours()
    const m = D.getMinutes()
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
  },

  setHeight() {
    wx.getSystemInfo({
      success: res => {
        this.data.windowHeight = res.windowHeight
        this.queryNodes(res.windowHeight, res.pixelRatio)
      }
    })
  },

  queryNodes(h, pixel) {
    let [liveH, footH] = [300, 40]
    const query = wx.createSelectorQuery()
    query.select('.live').boundingClientRect()
    query.select('.foot').boundingClientRect()
    query.exec(res => {
      const itemHeight = 50 / pixel
      const free = h - res[0].height - res[1].height
      const height = Math.floor(free / itemHeight)
      this.setData({
        liveHeight: res[0].height,
        defaultHeight: res[0].height,
        height: height * itemHeight
      })
    })
  },

  scrollNode() {
    wx.createSelectorQuery().select('.chat').boundingClientRect(res => {
      this.setData({
        scrollTop: res.height
      })
    }).exec()
  },

  play () {
    this.ctx.resume()
  },

  pause () {
    this.ctx.pause()
  },

  torch () {
    this.ctx.toggleTorch()
  },

  handleSwitchCamera () {
    this.ctx.switchCamera()
  },

  fullScreen () {
    this.setData({
      fullscreen: true,
      liveHeight: this.data.windowHeight
    })
  },

  exitfullScreen () {
    this.setData({
      fullscreen: false,
      liveHeight: this.data.defaultHeight
    })
  },

  handleShare() {
    wx.showLoading({
      title: '请稍后'
    })
    const liveData = app.live.data.live
    app.fetch({
      url: app.globalData.codeUrl,
      method: 'POST',
      data: {
        mold: 1,
        title: liveData.title,
        desc: `直播${"\n"}我在Dep发起了一个直播，想了解我的长按图片识别二维码进来吧。`,
        path: `pages/live/livePlay/index?roomnum=${liveData.uid}&from=code`,
        banner: liveData.avatar
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      wx.hideLoading()
      if (response.code === 0) {
        wx.downloadFile({
          url: response.data,
          success: res => {
            if (res.statusCode === 200) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: rs => {

                }
              })
              app.fetch({
                url: app.globalData.codeUrl,
                data: {
                  mold: 2,
                  filename: response.data
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                }
              })
            }
          }
        })
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