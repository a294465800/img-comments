// pages/teacher_index/teacher_index.js
const app = getApp()
Page({

  data: {
    userInfo: app.globalData.userInfo,
  },

  onLoad(options) {
  },

  teacherLogin(e) {
    const password = e.detail.value.password
    wx.request({
      url: app.globalData.host + 'teacher/login',
      method: 'POST',
      data: {
        code: password,
      },
      success: res => {
        try {
          if ('OK' == res.data.code) {
            app.globalData._token = res.data.token
            wx.navigateTo({
              url: '/pages/teacher_images/teacher_images',
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
          })
        }
      }
    })
  }
})