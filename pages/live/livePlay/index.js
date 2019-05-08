// pages/live/liveRoom/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: '',
    test: '',
    system: 'android', // 系统版本
    coin: 0, // 嘚米余额
    news: '',
    liveURL: '',
    scrollTop: 0,
    height: 250,
    list:[],
    queue: [], // 消息的队列
    giftList: [], // 礼物的列表
    giftPop: false, // 礼物的弹窗
    iptToggle: true, // 输入框显示或隐藏
    current: 0, // 礼物的滑块 第几块
    giftselected: '', // 选中的礼物
    goodsList: [], // 代言的商品列表
    goodsPop: false, // 商品的弹窗
    stopScroll: false, // 停止自动滚屏
    isFull: false, // 是否全屏
    isStop: false, // 是否播放暂停
    isPlayback: false, // 是否回放
    videoUrl: null, // 回放地址
    videoPoster: null, // video poster
    isOwn: false, // 是否是自己看自己
    follow: '0', // 关注
    instance: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo()
    this.roomnum = options.roomnum
    this.data.from = options.from

    if (app.globalData.depInfo) {
      if (options.islive === '0') {
        this.setData({
          isPlayback: true,
          videoUrl: app.live.videoUrl,
          videoPoster: app.live.videoPoster
        })
        if (!app.live.videoUrl) {
          wx.showModal({
            title: '提示',
            content: '暂无回放记录',
          })
        }
      }
      this.fetchGoodsList()
    } else {
      app.requiresAuth = res => {
        if (options.islive === '0') {
          this.setData({
            isPlayback: true,
            videoUrl: app.live.videoUrl,
            videoPoster: app.live.videoPoster
          })
          if (!app.live.videoUrl) {
            wx.showModal({
              title: '提示',
              content: '暂无回放记录',
            })
          }
        }
        this.fetchGoodsList()
      }
    }
    this.setHeight()

    if (app.globalData.depInfo) {
      this.setData({
        isOwn: app.globalData.depInfo.id === this.roomnum
      })
      if (this.data.from === 'code') {
        this.fetchLiveOnes()
      } else {
        this.initDATA()
      }
      this.isatten()

      this.ctx = wx.createLivePlayerContext('player')
      this.ctx.play()
    } else {
      app.requiresAuth = res => {
        this.setData({
          isOwn: app.globalData.depInfo.id === this.roomnum
        })
        if (this.data.from === 'code') {
          this.fetchLiveOnes()
        } else {
          this.initDATA()
        }
        this.isatten()

        this.ctx = wx.createLivePlayerContext('player')
        this.ctx.play()
      }
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
/*
    if (app.globalData.depInfo) {
      this.setData({
        isOwn: app.globalData.depInfo.id === this.roomnum
      })
      if (this.data.from === 'code') {
        this.fetchLiveOnes()
      } else {
        this.initDATA()
      }
      this.isatten()
   
      this.ctx = wx.createLivePlayerContext('player')
      this.ctx.play()
    } else {
      app.requiresAuth = res => {
        this.setData({
          isOwn: app.globalData.depInfo.id === this.roomnum
        })
        if (this.data.from === 'code') {
          this.fetchLiveOnes()
        } else {
          this.initDATA()
        }
        this.isatten()
      
        this.ctx = wx.createLivePlayerContext('player')
        this.ctx.play()
      }
    }
    */
    if (this.data.instance) {
      this.socketInit()
    }
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
    if (this.ws) {
      this.ws.close({
        code: 1000
      })
    }
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
      path: `/pages/live/livePlay/index?roomnum=${this.roomnum}&from=code`
    }
  },

  fetchLiveOnes () {
    wx.showLoading({
      title: '加载中',
    })
    app.http({
      url: 'Home.Wx_liveslist',
      data: {
        uidkey: this.roomnum,
        p: 1
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            const item = res.data.info[0] || {}
            if (item.islive === '0') {
              app.live.videoUrl = item.return_video.mp4_url
              app.live.videoPoster = item.return_video.CoverURL
              this.setData({
                isPlayback: true,
                videoUrl: app.live.videoUrl,
                videoPoster: app.live.videoPoster
              })
              if (!app.live.videoUrl) {
                wx.showModal({
                  title: '提示',
                  content: '暂无回放记录',
                })
              }
            }
            this.initDATA()
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

  play () {
    this.ctx.play()
    this.setData({
      isStop: false
    })
  },

  pause () {
    this.ctx.pause()
    this.setData({
      isStop: true
    })
  },

  fullScreen () {
    this.ctx.requestFullScreen()
    this.setData({
      isFull: true
    })
  },

  exitfullScreen () {
    this.ctx.exitFullScreen()
    this.setData({
      isFull: false
    })
  },

/**
 * 获取系统类型
 */
  getSystemInfo () {
    wx.getSystemInfo({
      success: res => {
        const sys = res.system.match(/iOS/)
        if (sys) {
          this.setData({
            system: 'ios'
          })
        }
      }
    })
  },

  handleEmitNews(e) {
    this.setData({
      news: e.detail.value.trim()
    })
  },

  userinfo: null,
  ws: null,

  /**
 * 初始化PC的DATA
 */
  initDATA() {
    wx.showLoading({
      title: '初始化中',
    })
    app.fetch({
      data: {
        g: 'Home',
        m: 'Show',
        a: 'api',
        roomnum: this.roomnum,
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token
      }
    }).then(res => {
      app.live.data = res

      this.inituser()
      let arr = []
      arr[0] = res.giftinfoj.slice(0, 8)
      arr[1] = res.giftinfoj.slice(8, 16)
      res.giftinfoj.length > 16 ? arr[2] = res.giftinfoj.slice(16, 24) : void 0

      this.setData({
        giftList: arr,
        coin: res.userinfo.coin,
        liveURL: res.live.pull
      })
      
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
  inituser() {
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

  socketShook() {
    wx.request({
      url: 'https://www.depforlive.com:19969',
      method: 'GET',
      success: res => {
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

  socketInit() {
    this.ws = wx.connectSocket({
      url: 'wss://www.depforlive.com:19969/',
      method: "GET",
      success: res => {
        // this.data.instance = true
      },
      fail: res => {
        wx.showToast({
          title: '聊天服务器连接失败，请重新进来',
          icon: 'none'
        })
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
      this.setData({

      })
    })
  },

  emitMsg(evt, msg) {
    this.ws.send({
      data: JSON.stringify({ evt, data: msg })
    })
  },

  showMsg(data) {
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

  distribute (data) {
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

  sendMsg(data) {
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
        level: +data.level,
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
    if (!this.data.instance || data.ct !== '直播内容包含任何低俗、暴露和涉黄内容，账号会被封禁；安全部门会24小时巡查哦～') {
      this.showMsg({
        type: 1,
        name: '系统消息',
        ct: data.ct
      })
      this.data.instance = true
    }
  },

  sendHorn(data) {

  },

/**
 * 获取推荐，待do
 */
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

  handleSend() {
    if (this.checkLogin()) {
      if (this.data.news) {
        const news = this.data.news
        this.setData({
          news: ''
        })
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
                  ct: news,
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
                  ct: news,
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
    }
  },

  emitChatMsg (evt, msg) {
    this.ws.send({
      data: JSON.stringify({
        evt,
        data: msg
      })
    })
  },

  nowDate () {
    const D = new Date()
    const h = D.getHours()
    const m = D.getMinutes()
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
  },


  setHeight () {
    wx.getSystemInfo({
      success: res => {
        this.queryNodes(res.windowHeight, res.pixelRatio)
      }
    })
  },

  queryNodes (h, pixel) {
    let [liveH, footH] = [300, 40]
    const query = wx.createSelectorQuery()
    query.select('.live').boundingClientRect()
    query.select('.foot').boundingClientRect()
    query.exec(res => {
      const itemHeight = 50 / pixel
      const free = h - res[0].height - res[1].height
      const height = Math.floor(free / itemHeight)
      this.setData({
        height: height * itemHeight
      })
    })
  },

  handleScroll (e) {
    // console.log(e.detail.scrollTop, this.data.height, this.data.scrollTop)
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

  handleLower (e) {
    const list = [...this.data.list, ...this.data.queue]
    this.setData({
      list: list.length > 250 ? list.slice(list.length - 100, list.length) : list,
      queue: [],
      stopScroll: false
    })
  },

  handleReadNews (e) {
    this.scrollNode()
    const list = [...this.data.list, ...this.data.queue]
    this.setData({
      list: list.length > 250 ? list.slice(list.length - 100, list.length) : list,
      queue: [],
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

  handletouchmove (e) {

  },

  fetchGoodsList () {
    app.http({
      url: 'Shop.Appgoodslist',
      data: {
        uid: this.roomnum,
        p: 1
      }
    }).then(res => {
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            this.setData({
              goodsList: res.data.info.ent
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
      wx.showToast({
        title: '网络错误，获取商品失败',
      })
    })
  },


  /**分隔 */

/**
 * 检测是否是游客
 */
  checkLogin () {
    if (app.globalData.depInfo.id === '369') {
      wx.showModal({
        title: '提示',
        content: '你还没绑定手机号，是否去绑定手机号？',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/index'
            })
          }
        }
      })
      return false
    } else {
      return true
    }
  },

  handleSwiperChange (e) {
    // console.log(e)
    this.data.current = e.detail.cerrent
  },
  
  handleShowgiftList () {
    this.setData({
      iptToggle: false,
      giftPop: true
    })
  },

  handleHideGiftList (e) {
    this.setData({
      iptToggle: true,
      giftPop: false
    })
  },

  handleSelectGift (e) {
    this.setData({
      giftselected: e.currentTarget.dataset.id
    })
  },

  handleSendGift () {
    if (this.checkLogin()) {
      if (this.data.giftselected) {
        const item = app.live.data.giftinfoj.find(item => item.id === this.data.giftselected)
        const data = app.live.data
      
        if (data.anchorinfoj.id === data.userinfo.id) {
          wx.showToast({
            title: '不允许给自己送礼物',
            icon: 'none'
          })
          return false
        }

        if (!data.live || data.live.islive === '0') {
          wx.showToast({
            title: '主播未开播，不能送礼物',
            icon: 'none'
          })
          return false
        }

        if (Number(item.needcoin) > Number(data.userinfo.coin)) {
          wx.showModal({
            title: '提示',
            content: '抱歉，你的嘚米余额不足，请充值',
            success: res => {

            }
          })
          return false
        }

        app.fetch({
          url: 'https://www.depforlive.com/index.php?g=home&m=Spend&a=sendGift',
          data: {
            touid: data.anchorinfoj.id,
            giftid: this.data.giftselected,
            showid: data.live.showid || 0
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': `AJ1sOD_uid=${app.globalData.depInfo.id}; AJ1sOD_token=${app.globalData.depInfo.token}`
          }
        }).then(res => {
          if (res.errno == 0) {
            app.live.data.userinfo.level = res.level
            app.live.data.userinfo.coin = res.coin
            this.setData({
              coin: res.coin
            })

            const msg = {
              retcode: '000000',
              retmsg: 'ok',
              msg: [{
                _method_: 'SendGift',
                evensend: res.evensend,
                action: '0',
                ct: res.gifttoken,
                msgtype: 1,
                level: res.level,
                uid: res.uid,
                timestamp: this.nowDate(),
                uname: data.userinfo.user_nicename,
                uhead: data.userinfo.avatar
              }]
            }
            this.emitMsg('broadcast', msg)
            this.setData({
              iptToggle: true,
              giftPop: false
            })
          } else {
            wx.showToast({
              title: res.msg || '数据错误',
              icon: 'none'
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
          title: '请选择礼物',
          icon: 'none'
        })
      }
    }
  },

  handleShowShop () {
    this.setData({
      iptToggle: true,
      giftPop: false,
      goodsPop: true
    })
  },

  handleFocus () {
    if (this.data.goodsPop) {
      this.setData({
        goodsPop: false
      })
    }
  },

/**
 * 隐藏商品列表
 */
  handleHideGoods () {
    this.setData({
      goodsPop: false
    })
  },

/**
 * 点击live-player 关闭
 */
  handleClose () {
    if (this.data.giftPop) {
      this.setData({
        iptToggle: true,
        giftPop: false
      })
    }
    if (this.data.goodsPop) {
      this.setData({
        goodsPop: false
      })
    }
  },

/**
 * 购买商品
 */
  handleBuy (e) {
    wx.setStorageSync('artinfo', {
      avatar_thumb: app.live.data.anchorinfoj.avatar_thumb,
      art_name: app.live.data.anchorinfoj.user_nicename
    })
    wx.navigateTo({
      url: `/pages/commodity/tradeOrder/index?id=${e.currentTarget.dataset.id}&aid=${app.live.data.anchorinfoj.id}`,
    })
  },

  handleReport () {
    if (this.checkLogin()) {
      wx.navigateTo({
        url: `/pages/report/index?uid=${this.roomnum}&type=1`,
      })
    }
  },

  handleRecharge () {
    wx.navigateTo({
      url: `/pages/live/recharge/index?coin=${this.data.coin}`,
    })
  },

  handleShare () {
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
        path: `pages/live/livePlay/index?roomnum=${this.roomnum}&from=code`,
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
                  wx.showModal({
                    title: '提示',
                    content: '图片保存到你手机相册，你可以从相册选取图片分享到朋友圈'
                  })
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
  },

/**
 * 是否关注
 */
  isatten () {
    if (this.data.isOwn) {
      return false
    }
    app.http({
      url: 'User.IsAttent',
      data: {
        uid: app.globalData.depInfo.id,
        touid: this.roomnum
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            this.setData({
              follow: res.data.info[0].isattent
            })
          } else {
            this.setData({
              follow: res.data.info.isattent
            })
          }
          break
        default:
          wx.showToast({
            title: res.data.msg || '网络错误',
            icon: 'none',
            duration: 2000
          })
      }
    }).catch(res => {
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

  /**
   * 点击关注
   */
  handleFollow() {
    app.http({
      url: 'User.SetAttent',
      data: {
        uid: app.globalData.depInfo.id,
        touid: this.roomnum
      }
    }).then(res => {
      switch (+res.data.code) {
        case 0:
          if (Array.isArray(res.data.info)) {
            if (+res.data.info[0].isattent === 1) {
              wx.showToast({
                title: '关注成功',
                icon: 'none',
                duration: 2000
              })

            } else {
              wx.showToast({
                title: '已取消关注',
                icon: 'none',
                duration: 2000
              })
            }
            this.setData({
              follow: res.data.info[0].isattent
            })
          } else {
            if (+res.data.info.isattent === 1) {
              wx.showToast({
                title: '关注成功',
                icon: 'none',
                duration: 2000
              })

            } else {
              wx.showToast({
                title: '已取消关注',
                icon: 'none',
                duration: 2000
              })
            }
            this.setData({
              follow: res.data.info.isattent
            })
          }
          break
        default:
          wx.showToast({
            title: res.data.msg || '网络错误',
            icon: 'none',
            duration: 2000
          })
      }
    }).catch(res => {
      wx.showToast({
        title: res || '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  }
})