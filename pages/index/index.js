//index.js
const app = getApp()

Page({
  data: {
    userInfo: null,
  },

  onload() {

  },

  goToStudent() {
    wx.navigateTo({
      url: '/pages/student_index/student_index',
    })
  }
})
