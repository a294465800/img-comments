// pages/teacher_index/teacher_index.js
const app = getApp()
Page({

  data: {
    userInfo: null,
  },

  onLoad(options) {
    // app.getSetting((userInfo) => {
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
  },

  teacherLogin(e) {
    const password = e.detail.value.password
    wx.navigateTo({
      url: '/pages/teacher_images/teacher_images',
    })
  }
})