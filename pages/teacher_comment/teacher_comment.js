// pages/teacher_comment/teacher_comment.js
const app = getApp()
Page({

  data: {
    host: 'http://121.196.214.115:8080/',

    //每个 picker 的 index
    index: {
      completion: 0,
      concept: 0,
      expression: 0,
      color: 0,
      speed: 0,
    },
    //完成度
    completion: ['较高', '正常', '还需努力'],
    //概念
    concept: ['太过复杂，需简化', '有简单且不错的概念', '缺少空间概念', '与题目不符合'],
    //表达
    expression: ['较为出色', '一般', '还需要训练', '虽然手绘功底不错但是表达层次混乱', '线条太差'],
    //上色
    color: ['马克笔运用较为出色', '太过生硬', '颜色太浅，图底关系不清楚', '乱涂色', '太鲜艳，缺少逼格'],
    //速度
    speed: ['不错，继续保持', '未标明时间，不知道速度如何'],

    image: {},
  },

  onLoad(options) {
    this.getImage(options.id, result => {
      this.setData({
        image: result,
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

  //预览图片
  preImages() {
    wx.previewImage({
      urls: [this.data.host + this.data.image.url],
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
    const score = e.detail.value.score > 50 ? 50 : e.detail.value.score
    const detail = e.detail.value.detail
    if (!score || !detail) {
      wx.showModal({
        title: '提示',
        content: '请先填写评分或者意见',
        showCancel: false
      })
      return false
    }

    let save = this.data.index
    save.score = score
    save.detail = detail
    wx.setStorage({
      key: 'save',
      data: save,
    })

    //记得处理大于 50 分情况，信息先保存到 globalData

    wx.navigateTo({
      url: '/pages/teacher_draw/teacher_draw?id=' + this.data.image.id,
    })
  }
})