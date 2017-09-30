// pages/student_result/student_result.js
const app = getApp()

Page({

  data: {

    //触底刷新控制
    flag: false,
    close: false,
    host: 'http://121.196.214.115:8080/',

    //目录
    category: ['建筑学', '城规', '美术学', '景观'],

    //接口数据
    images: [],
    page: 1,
  },

  onLoad(options) {
    this.getImages(1, (result) => {
      this.setData({
        images: result
      })
    })
  },

  //请求封装
  getImages(page, cb) {
    wx.request({
      url: app.globalData.host + 'pictures',
      data: {
        token: app.globalData._token,
        type: 1,
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

  //查看图片具体信息
  getMoreInfo(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/student_specific/student_specific?id=' + id,
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    const that = this
    that.getImages(1, result => {
      wx.stopPullDownRefresh()
      that.setData({
        images: result,
        close: false,
        page: 1,
      })
    })
  },

  //触底刷新
  onReachBottom() {
    const that = this
    const flag = that.data.flag
    const close = that.data.close
    const page = that.data.page
    if (flag || close) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    that.getImages(page + 1, result => {
      wx.hideLoading()
      if (result.length) {
        that.setData({
          images: [...that.data.images, ...result],
          flag: false,
          page: page + 1
        })
      } else {
        that.setData({
          close: true,
          flag: false,
          page: page + 1
        })
      }
    })
    that.setData({
      flag: true
    })
  },
})