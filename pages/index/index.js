//index.js
//获取应用实例
const app = getApp()
const art = require('../../utils/public.js')

Page({
  data: {
    bannerList: [],
    authType: art.artType,
    tab: '1',
    p: 1,
    kw: '',
    list: [],
    areaList: [],
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...',
    isDownBottom: false,
    motto: 'Hello World',
    userInfo: {},
    isAuth: false, // 是否弹出授权窗口
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.showTabBar()
    this.fetchBanner()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({
      list: [],
      areaList: []
    })
    this.fetchData()
    if (!app.globalData.logined) {
      app.userAuth = res => {
        if (!app.globalData.isAuth) {
          this.setData({
            isAuth: true
          })
        }
      }
    } else {
      if (!app.globalData.isAuth) {
        this.setData({
          isAuth: true
        })
      }
    }

    if (app.globalData.depInfo) {
      this.selectRedHot()
    } else {
      app.requiresAuth = res => {
        this.selectRedHot()
      }
    }
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  handleGetUserInfo (e) {
    this.setData({
      isAuth: false
    })
    wx.showLoading({
      title: '请稍后'
    })
    app.http({
      url: 'Wx.DecryptData',
      data: {
        sessionKey: app.globalData.loginInfo.session_key,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
    }).then(res => {
      wx.hideLoading()
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            app.globalData.loginInfo = res.data.info
            app.globalData.depInfo = null
            app.isBindDepAccount()
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
        icon: 'none',
        duration: 2000
      })
    })
  },

  onPullDownRefresh () {
    this.setData({
      p: 1,
      nextPage: true,
      list: [],
      areaList: []
    })
    this.fetchData()
  },

  onReachBottom () {
    if (this.data.nextPage) {
      this.setData({
        p: ++this.data.p,
        loading: true,
        loadText: '正在加载中...'
      })
      this.fetchData()
    }
  },

  handleEmitKW (e) {
    this.setData({
      kw: e.detail.value.trim()
    })
  },

  handleSearch () {
    wx.navigateTo({
      url: '/pages/artist/search/index?kw=' + this.data.kw
    })
  },

  fetchData () {
    if (!this.data.nextPage) {
      return false
    }
    this.setData({
      loading: false
    })
    app.http({
      url: 'Art.Index_news',
      data: {p: this.data.p}
    }).then(res => {
      wx.stopPullDownRefresh()
      if (res.data.info.length > 0) {
        let arr = []
        res.data.info.forEach(item => {
          arr.push(item.cityinfo ? item.cityinfo.map(item => item.city).join(' ') : '')
        })
        const list = res.data.info.map(item => {
          const type = art.artType.find(arg => arg.id === Number(item.auth_type))
          return {...item, artType: type ? type.name : ''}
        })
        this.setData({
          list: [...this.data.list, ...list],
          areaList: this.data.areaList.concat(arr)
        })
      } else {
        this.setData({
          nextPage: false,
          isDownBottom: true,
          loading: false,
          loadText: '没有更多数据了'
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

  handleLinkDetail (e) {
    const index = e.currentTarget.dataset.idx
    const item = this.data.list.find(arg => arg.uid === index)
    wx.setStorageSync('artinfo', item)
    wx.navigateTo({
      url: `/pages/artist/detail/index?id=${index}&from=cache`
    })
  },

  /**
   * 取消授权
   */
  handleCancelAuth () {
    this.setData({
      isAuth: false
    })
  },

  authTypeChange (e) {
    const val = Number(e.detail.value)
    wx.navigateTo({
      url: `/pages/artist/search/index?type=${this.data.authType[val].id}`
    })
  },

  handleFilter (e) {
    wx.navigateTo({
      url: `/pages/artist/filter/index`
    })
  },

  fetchBanner () {
    app.http({
      url: 'Home.Wx_getSlide'
    }).then(res => {
      if (res.ret === 200) {
        switch (res.data.code) {
          case 0:
            this.setData({
              bannerList: res.data.info
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
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  handleSwiperChange (e) {

  },

/**
 * slide_cid: 5推广主播， 4公众号文章推广，3推广活动
 */
  handleBannerTap (e) {
    const item = this.data.bannerList.find(item => item.slide_cid === e.target.dataset.cid)
    console.log(item)
    switch (item.slide_cid) {
      case '3':
        wx.navigateTo({
          url: `/pages/campaign/detail/index?id=${item.slide_content}&type=3`
        })
        break
      case '4':
        app.articleSrc = item.slide_content
        wx.navigateTo({
          url: '/pages/article/index',
        })
        break
      case '5':
        wx.navigateTo({
          url: `/pages/artist/detail/index?id=${item.slide_content}`
        })
        break
      default:
        wx.showToast({
          title: '数据错误',
          icon: 'none'
        })
    }
  },

  /**
   * 查询红点
   */
  selectRedHot () {
    app.http({
      url: 'Shop.get_status_goodsnum',
      data: {
        uid: app.globalData.depInfo.id,
        token: app.globalData.depInfo.token,
        type: 2,
        goods_type: 2,
        use_type: 0
      }
    }).then(res => {
      if (res.ret === 200) {
        switch (+res.data.code) {
          case 0:
            if (res.data.info[0].numss > 0) {
              app.hasRedHot = true
              wx.showTabBarRedDot({
                index: 4
              })
              app.redHotNum = res.data.info[0].numss
            }
            break
          default:
            break
        }
      }
    }).catch(res => {
      
    })
  }
})
