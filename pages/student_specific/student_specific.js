// pages/student_specific/student_specific.js
const app = getApp()
Page({
  data: {
    ok: true,
    image: {
      id: 1,
      url: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/02/02/ChMkJlbKxZyISG9yAAgIhmkacPAAALHYgNs0jkACAie534.jpg',
      teacher: '张起灵',
      avatar: 'http://y3.ifengimg.com/cmpp/2015/06/13/08/08999aef-3d44-4015-8964-1c652bfe39b3_size138_w400_h599.jpg',
      comment: '这是一张很有灵性的图片，十分的有意思，给你满分！',
      score: 37,
      intro: '该老师从盗墓笔记毕业，十分有实力！',
    }
  },

  onLoad(options) {
    this.getImage(options.id, result => {
      this.setData({
        image: result
      })
    })
  },

  //请求封装
  getImage(id, cb) {
    wx.request({
      url: app.globalData.host + 'picture/' + id,
      data: {
        token: app.globalData._token,
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

})