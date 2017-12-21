// pages/teacher_images/teacher_images.js
const app = getApp()

Page({

  data: {
    //触底刷新控制
    flag: false,
    close: {
      1: false,
      2: false
    },
    page: {
      1: 1,
      2: 1
    },

    images: {
      1: [],
      2: []
    },
    account: 0,

    types: ['建筑学', '城规', '美术学', '景观'],
    category: 0,
    host: 'https://www.arch-seu.com/',

    navs: [
      {
        id: 1,
        name: '未批注'
      },
      {
        id: 2,
        name: '已批注'
      }
    ],
    currentState: 1
  },

  onShow(options) {
    this.imagesRequest(1, result => {
      this.setData({
        images: result
      })
    })

    wx.request({
      url: app.globalData.host + 'teacher/count',
      data: {
        token: app.globalData._token
      },
      success: res => {
        try {
          if ('OK' == res.data.code) {
            this.setData({
              account: res.data.data.count,
              category: res.data.data.category,
            })
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
            success: () => {
              wx.navigateBack()
            }
          })
        }
      }
    })
  },

  //请求封装
  imagesRequest(page, cb) {
    wx.request({
      url: app.globalData.host + 'pictures',
      data: {
        token: app.globalData._token,
        type: 2,
        page: page,
        state: this.data.currentState
      },
      success: res => {
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
            success: () => {
              wx.navigateBack()
            }
          })
        }
      }
    })
  },

  //触底刷新
  onReachBottom() {
    const that = this
    let flag = that.data.flag
    const curretState = that.data.currentState
    let close = that.data.close[curretState]
    let page = that.data.page[curretState]

    //阻止重复触发或者主动关闭
    if (flag || close) {
      return false
    }

    wx.showLoading({
      title: '加载中',
    })
    that.imagesRequest(page + 1, res => {
      if (res.length) {
        that.setData({
          flag: false,
          [`page.${currentState}`]: page + 1,
          [`images.${currentState}`]: [...that.data.images[currentState], ...res],
        })
      } else {
        that.setData({
          [`close.${currentState}`]: true,
          flag: false,
          [`page.${currentState}`]: page + 1,
        })
      }
      wx.hideLoading()
    })

    that.setData({
      flag: true
    })
  },

  //刷新页面
  refreshPage() {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    that.imagesRequest(1, res => {
      wx.hideLoading()
      that.setData({
        images: res,
        close: false,
        page: 1,
      })
    })
  },


  //点评页面跳转
  goToComment(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/teacher_comment/teacher_comment?id=' + id,
    })
  },

  //导航
  navClick(e) {
    const id = e.target.dataset.id
    const currentState = this.data.currentState
    if (!id || id == currentState) {
      return false
    }
    this.setData({
      currentState: id
    })
    this.imagesRequest(1, res => {
      that.setData({
        flag: false,
        [`close${id}`]: false,
        [`page.${id}`]: 1,
        [`images.${id}`]: [...that.data.images[id], ...res],
      })
    })
  }

})