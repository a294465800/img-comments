// pages/teacher_images/teacher_images.js
const app = getApp()

Page({

  data: {
    //触底刷新控制
    flag: false,
    close: false,
    page: 1,

    images: [],
    account: 0,
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
              account: res.data.data
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
  toBottom() {
    const that = this
    let flag = that.data.flag
    let close = that.data.close
    let page = that.data.page

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
          page: page + 1,
          images: [...that.data.images, ...res],
        })
      } else {
        that.setData({
          close: true,
          flag: false,
          page: page + 1
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

})