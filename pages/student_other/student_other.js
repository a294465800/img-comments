// pages/student_other/student_other.js
Page({

  data: {
    now: 0,
    content: [
      '这是第一篇文章',
      '这是第二篇文章',
    ]
  },

  onLoad: function (options) {

  },

  //获取当前导航
  getNow(e) {
    const now = e.currentTarget.dataset.now
    this.setData({
      now: now,
    })
  }
})