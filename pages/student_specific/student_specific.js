// pages/student_specific/student_specific.js
const app = getApp()
Page({
  data: {
    image: null,

    //点评键值
    completion: ['较高', '正常', '还需努力'],
    //概念
    concept: ['太过复杂，需简化', '有简单且不错的概念', '缺少空间概念', '与题目不符合'],
    //表达
    expression: ['较为出色', '一般', '还需要训练', '虽然手绘功底不错但是表达层次混乱', '线条太差'],
    //上色
    color: ['马克笔运用较为出色', '太过生硬', '颜色太浅，图底关系不清楚', '乱涂色', '太鲜艳，缺少逼格'],
    //速度
    speed: ['不错，继续保持', '未标明时间，不知道速度如何'],
    //细节标记
    issue: ['结构错误', '表达错误', '审题错误', '不采光', '流线错误', '不通风', '还有一些其他错误'],
    //重做
    redo: ['是', '否'],
    host: 'http://121.196.214.115:8080/',
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