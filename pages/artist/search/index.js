//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    p: 1,
    kw: '', // 关键词
    type: '', // 类型
    gender: '', // 性别
    region: '', // 地区
    list: [],
    areaList: [],
    nextPage: true, // 是否还有下一页
    loading: false,
    loadText: '正在加载中...'
  },
  
  onLoad: function (options) {
    console.log(options)
    this.setData({
      kw: options.kw || '',
      type: options.type || '',
      gender: options.gender || '',
      region: options.region || ''
    })
    this.fetchData()
  },

  onPullDownRefresh () {
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
      kw: e.detail.value
    })
  },

  handleSearch () {
    this.setData({
      p: 1,
      nextPage: true,
      list: [],
      areaList: []
    })
    this.fetchData()
  },

  fetchData () {
    app.http({
      url: 'Art.Index_news',
      data: {
        p: this.data.p,
        keyword: this.data.kw,
        sex: this.data.gender,
        city: this.data.region,
        type: this.data.type
      }
    }).then(res => {
      if (Array.isArray(res.data.info) && res.data.info.length > 0) {
        let arr = []
        res.data.info.forEach(item => {
          arr.push(item.cityinfo ?item.cityinfo.map(item => item.city).join(' ') : '')
        })
        this.setData({
          list: this.data.list.concat(res.data.info),
          areaList: this.data.areaList.concat(arr)
        })
      } else {
        this.setData({
          nextPage: false,
          loading: false,
          isDownBottom: true,
          loadText: '没有更多数据了'
        })
      }
    }).catch(res => {
      wx.showToast({
        title: '网络错误',
        icon: 'none',
        duration: 2000
      })
    })
  },

  handleLinkDetail(e) {
    const index = e.currentTarget.dataset.idx
    const item = this.data.list.find(arg => arg.id === index)
    wx.setStorageSync('artinfo', item)
    wx.navigateTo({
      url: `/pages/artist/detail/index?id=${index}&from=cache`
    })
  }
})
