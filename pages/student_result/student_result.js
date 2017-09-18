// pages/student_result/student_result.js
const app = getApp()

Page({

  data: {
    images: [
      {
        id: 1,
        url: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/02/02/ChMkJlbKxZyISG9yAAgIhmkacPAAALHYgNs0jkACAie534.jpg',
        name: '小狗狗'
      },
      {
        id: 2,
        url: 'http://www.51pptmoban.com/d/file/2014/03/18/1d058a5416734d40c388983734f73517.jpg',
        name: '小兔兔'
      }
    ]
  },

  onLoad(options) {

  },

  //查看图片具体信息
  getMoreInfo(e) {
    const id = e.currentTarget.dataset.id
    console.log(e, id)
    wx.navigateTo({
      url: '/pages/student_specific/student_specific?id=' + id,
    })
  }
})