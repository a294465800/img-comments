// pages/student_index/student_index.js
const app = getApp()

Page({

  data: {
    money: 0,
    setPay: false,
    userInfo: app.globalData.userInfo,
    image: '',
    types: ['建筑学', '城规', '美术学', '景观'],
    index: 0,

    //提交的数据
    baseUrl: '',
  },
  onLoad(options) {
    const that = this
    if (app.globalData.userInfo) {
      return false
    } else {
      app.getSetting((userInfo) => {
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },

  getMoney(e) {
    const money = e.detail.value
    this.setData({
      money
    })
  },

  //隐藏金额输入框
  hidePay() {
    this.setData({
      setPay: false
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
        wx.uploadFile({
          url: app.globalData.host + 'upload',
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: upload => {
            try {
              let data = JSON.parse(upload.data)
              console.log(upload)
              wx.hideLoading()
              that.setData({
                image: res.tempFilePaths[0],
                baseUrl: data.base_url
              })
            } catch (error) {
              wx.showModal({
                title: '提示',
                content: '上传出错',
              })
            }
          }
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
      return false
    }

    wx.showModal({
      title: '提示',
      content: '当前图片分类为：' + that.data.types[that.data.index] + '，添加资费为' + that.data.money + '元，确定提交吗？',
      success: result => {
        if (result.confirm) {
          wx.request({
            url: app.globalData.host + 'picture',
            method: 'POST',
            data: {
              url: that.data.baseUrl,
              category: that.data.index + 1,
              money: that.data.money,
              token: app.globalData._token
            },
            success: res => {
              if ('OK' == res.data.code) {
                if (that.data.money > 0) {
                  wx.request({
                    url: app.globalData.host + 'order',
                    method: 'POST',
                    data: {
                      number: res.data.data.number,
                      pic_id: res.data.data.picture_id,
                      token: app.globalData._token,
                    },
                    success: rs => {
                      if ('OK' == rs.data.code) {
                        that.requestPay(rs.data.data, () => {
                          wx.showToast({
                            title: '提交成功',
                          })
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: rs.data.message,
                          showCancel: false
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: '提交成功',
                  })
                }
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.message,
                  showCancel: false
                })
              }
            },
          })
        }
      }
    })
  },

  //支付调起
  requestPay(data, cb) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: res => {
        console.log('ok')
        typeof cb === 'function' && cb()
      },
      fail: cancel => {
        console.log('fail', cancel)
        wx.showToast({
          title: '已取消',
        })
      }
    })
  },


  //显示金额输入框
  pay() {
    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: '',
    //   paySign: '',
    // })
    this.setData({
      setPay: true
    })
  },

  //查看结果跳转
  goToResult() {
    wx.navigateTo({
      url: '/pages/student_result/student_result',
    })
  },

  //其他跳转
  goToOther() {
    wx.navigateTo({
      url: '/pages/student_other/student_other',
    })
  }

})