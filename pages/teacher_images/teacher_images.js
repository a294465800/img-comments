// pages/teacher_images/teacher_images.js
const app = getApp()

Page({

  //触底刷新控制
  flag: false,
  close: false,
  page: 1,

  data: {
    images: [
      {
        id: 1,
        url: 'http://pic.jj20.com/up/allimg/611/021913130921/130219130921-7.jpg',
        status: 1
      },
      {
        id: 2,
        url: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/09/ChMkJlf8ljeIa5fKABQp0_GXxjYAAWzegKsIMwAFCnr514.jpg',
        status: 0,
      },
      {
        id: 3,
        url: 'http://img02.tooopen.com/images/20160128/tooopen_sy_155639767824.jpg',
        status: 0,
      },
      {
        id: 4,
        url: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/09/ChMkJlf8ljeIa5fKABQp0_GXxjYAAWzegKsIMwAFCnr514.jpg',
        status: 1,
      },
      {
        id: 5,
        url: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/09/ChMkJlf8ljeIa5fKABQp0_GXxjYAAWzegKsIMwAFCnr514.jpg',
        status: 0,
      },
      {
        id: 6,
        url: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/09/ChMkJlf8ljeIa5fKABQp0_GXxjYAAWzegKsIMwAFCnr514.jpg',
        status: 0,
      }
    ],
  },

  onLoad(options) {
    this.imagesRequest(1, result => {
      this.setData({
        images: result
      })
    })
  },


  //请求封装
  imagesRequest(page, cb) {
    wx.request({
      url: app.globalData.host + 'pictures',
      data: {
        token: app.globalData._token,
        type: 2,
        page: page,
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

  //触底刷新
  toBottom() {
    const that = this
    let flag = that.data.flag
    let close = that.data.close
    let page = that.data.page
    console.log(1)

    //阻止重复触发或者主动关闭
    if (flag || close) {
      return false
    }
    console.log(2)
    setTimeout(() => {
      wx.showLoading({
        title: '加载中',
      })
      that.imagesRequest(page + 1, res => {
        if (res.length) {
          that.setData({
            flag: false,
            page: page + 1,
            images: [...that.data.images, ...res],
          })
        } else {
          that.setData({
            close: true,
            flag: false,
            page: page + 1
          })
        }
        wx.hideLoading()
      })
    }, 0)

    that.setData({
      flag: true
    })
  },

  //刷新页面
  refreshPage() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 1000)
  },


  //点评页面跳转
  goToComment(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/teacher_comment/teacher_comment?id=' + id,
    })
  },

})