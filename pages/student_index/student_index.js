// pages/student_index/student_index.js
Page({

  data: {
    image: '',
    types: ['建筑学', '城规', '美术学', '景观'],
    index: 0,
  },
  onLoad: function (options) {

  },

  //付费
  pay() {
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
    })
  },

  //选择图片函数
  chooseImg() {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.chooseImage({
      count: 1,
      success(res) {
        wx.hideLoading()
        that.setData({
          image: res.tempFilePaths[0]
        })
      },
    })
    wx.hideLoading()
  },

  //获取分类
  getType(e) {
    this.setData({
      index: e.detail.value
    })
  },

  //提交图片
  submit() {
    const that = this
    let image = that.data.image
    if (!image) {
      wx.showModal({
        title: '提示',
        content: '请先上传图片',
        showCancel: false
      })
    }

    wx.showModal({
      title: '提示',
      content: '当前图片分类为：' + that.data.types[that.data.index] + '，确定提交吗？',
      success: result => {
        if (result.confirm) {
          wx.showToast({
            title: '提交成功',
          })
        }
      }
    })
  }

})