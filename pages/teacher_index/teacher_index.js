// pages/teacher_index/teacher_index.js
const app = getApp()
Page({

  data: {
    userInfo: app.globalData.userInfo,
  },

  onLoad(options) {
    // const that = this
    // if (app.globalData.userInfo) {
    //   return false
    // } else {
    //   app.getSetting((userInfo) => {
    //     that.setData({
    //       userInfo: userInfo
    //     })
    //   })
    // }
  },

  teacherLogin(e) {
    const password = e.detail.value.password
    wx.navigateTo({
      url: '/pages/teacher_images/teacher_images',
    })
  }
})