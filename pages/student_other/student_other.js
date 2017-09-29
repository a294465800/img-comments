// pages/student_other/student_other.js
const app = getApp()
Page({

  data: {
    now: 1,
    content: {
      1: null,
      2: null,
    },
    host: 'http://121.196.214.115:8080/',
  },

  onLoad(options) {
    this.getArticle(1, res => {
      this.setData({
        'content[1]': res
      })
    })
    this.getArticle(2, res => {
      this.setData({
        'content[2]': res
      })
    })
  },

  getArticle(type, cb) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host + 'article',
      data: {
        type
      },
      success: res => {
        wx.hideLoading()
        try {
          if ('OK' == res.data.code) {
            typeof cb === 'function' && cb(res.data.data)
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
            })
          }
        } catch (error) {
          wx.showModal({
            title: '提示',
            content: '服务器错误',
            showCancel: false,
          })
        }
      }
    })
  },

  //获取当前导航
  getNow(e) {
    const now = e.currentTarget.dataset.now
    const tmp = 'content[' + now + ']'
    const article = this.data.content[now]
    if (article) {
      this.setData({
        now
      })
      return false
    }
    this.getArticle(now, res => {
      this.setData({
        [tmp]: res,
        now: now,
      })
    })
  }
})