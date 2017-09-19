// pages/teacher_index/teacher_index.js
Page({

  data: {

  },

  onLoad(options) {

  },

  teacherLogin(e) {
    const password = e.detail.value.password
    wx.navigateTo({
      url: '/pages/teacher_images/teacher_images',
    })
  }
})