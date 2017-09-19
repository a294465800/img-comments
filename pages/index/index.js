//index.js
const app = getApp()

Page({
  data: {
    // userInfo: null,
  },

  onload() {
    app.nowLogin()
  },

  //学生入口
  goToStudent() {
    wx.navigateTo({
      url: '/pages/student_index/student_index',
    })
  },

  //教师入口
  gotToTeacher() {
    wx.navigateTo({
      url: '/pages/teacher_index/teacher_index',
    })
  }
})
