// pages/teacher_comment/teacher_comment.js
const app = getApp()
Page({

  data: {

    //每个 picker 的 index
    index: {
      finish: 0,
      concept: 0,
      expression: 0,
      coloring: 0,
      speed: 0,
    },
    //完成度
    finish: ['较高', '正常', '还需努力'],
    //概念
    concept: ['太过复杂，需简化', '有简单且不错的概念', '缺少空间概念', '与题目不符合'],
    //表达
    expression: ['较为出色', '一般', '还需要训练', '虽然手绘功底不错但是表达层次混乱', '线条太差'],
    //上色
    coloring: ['马克笔运用较为出色', '太过生硬', '颜色太浅，图底关系不清楚', '乱涂色', '太鲜艳，缺少逼格'],
    //速度
    speed: ['不错，继续保持', '未标明时间，不知道速度如何'],

    image: {
      id: 1,
      url: 'http://www.dogwallpapers.net/wallpapers/samoyed-puppy-wallpaper.jpg'
    }
  },

  onLoad(options) {

  },

  //预览图片
  preImages(){
    wx.previewImage({
      urls: [this.data.image.url],
    })
  },

  //picker 选择器
  pickerChoose(e) {
    const name = e.currentTarget.dataset.name
    const picker = 'index.' + name
    const index = Number(e.detail.value)
    this.setData({
      [picker]: index
    })
  },

  //下一步
  nextStep(e) {
    const score = e.detail.value.score
    const sum = e.detail.value.sum
    if (!score || !sum) {
      wx.showModal({
        title: '提示',
        content: '请先填写评分或者意见',
        showCancel: false
      })
      return false
    }

    //记得处理大于 50 分情况，信息先保存到 globalData

    wx.navigateTo({
      url: '/pages/teacher_draw/teacher_draw',
    })
  }
})