// pages/teacher_draw/teacher_draw.js
const app = getApp()
let timer = null
Page({

  data: {

    //优化用户体验
    ok: false,
    flag: false,

    // picker 相关
    index: {
      issue: 0,
      redo: 1,
    },
    issue: ['结构错误', '表达错误', '审题错误', '不采光', '流线错误', '不通风', '还有一些其他错误', '无明显错误'],
    redo: ['是', '否'],

    remark: '',

    //画布属性
    height: 0,
    size: 1,
    color: 'red',
    image: null,

    //提交信息
    baseUrl: '',
    host: 'https://www.arch-seu.com/',

    //下载图片缓存
    downLoadImg: ''
  },

  onLoad(options) {
    this.getImage(options.id, result => {
      this.ctx = wx.createCanvasContext('image')
      this.drawImages(this.data.host + result.url)
      this.setData({
        image: result,
        baseUrl: result.url,
      })
    })
  },

  onHide() {
    // clearTimeout(timer)
  },

  //获取图片封装
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

  //绘制图片封装
  drawImages(img) {
    const that = this
    function errorFnc() {
      wx.showModal({
        title: '提示',
        content: '图片不存在',
        showCancel: false,
        success: rs => {
          wx.navigateBack()
        }
      })
    }

    if (that.data.downloadImg) {
      wx.getImageInfo({
        src: that.data.downloadImg,
        success: res => {
          const width = res.width
          const height = res.height
          if (!width || !height) {
            errorFnc()
          }
          let calc = Math.round(300 / width * height)
          that.setData({
            height: calc,
          })
          that.ctx.drawImage(that.data.downloadImg, 0, 0, 300, calc)
          that.ctx.draw()
          that.setData({
            ok: true,
            flag: false,
          })
        },
        fail: error => {
          that.setData({
            ok: true,
            flag: false,
          })
          errorFnc()
        }
      })
    } else {

      //下载图片
      wx.downloadFile({
        url: img,
        success: imgDown => {
          //获取图片尺寸，然后绘制
          wx.getImageInfo({
            src: imgDown.tempFilePath,
            success: res => {
              const width = res.width
              const height = res.height
              if (!width || !height) {
                errorFnc()
              }
              let calc = Math.round(300 / width * height)
              that.setData({
                height: calc,
                downLoadImg: imgDown.tempFilePath
              })
              that.ctx.drawImage(imgDown.tempFilePath, 0, 0, 300, calc)
              that.ctx.draw()
              that.setData({
                ok: true,
                flag: false,
              })
            },
            fail: error => {
              that.setData({
                ok: true,
                flag: false,
              })
              errorFnc()
            }
          })
        },
      })
    }

  },

  //开始绘制
  stratDraw(e) {
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y

    //设置画笔颜色
    this.ctx.setStrokeStyle(this.data.color)

    //设置画笔大小
    this.ctx.setLineWidth(this.data.size)

    // 让线条圆润 
    this.ctx.setLineCap('round')

    //开始画图
    this.ctx.beginPath()
  },

  //绘制中
  moveDraw(e) {
    //获取移动坐标
    let startX1 = e.changedTouches[0].x
    let startY1 = e.changedTouches[0].y

    this.ctx.moveTo(this.startX, this.startY)
    this.ctx.lineTo(startX1, startY1)

    this.ctx.stroke()
    //在原来画布的内容基础上画图
    this.ctx.draw(true)

    this.startX = startX1
    this.startY = startY1

  },

  //绘制结束
  endDraw(e) {

  },

  //设置画笔大小
  getPensize(e) {
    const size = e.currentTarget.dataset.size
    this.setData({
      size
    })
  },

  //设置画笔颜色
  getPenColor(e) {
    const color = e.currentTarget.dataset.color
    this.setData({
      color
    })
  },

  //重置
  resetImg() {
    //阻止重复触发
    if (this.data.flag) {
      return false
    }
    this.setData({
      ok: false,
      flag: true,
    })

    this.drawImages(this.data.host + this.data.image.url)
  },

  //保存绘图
  saveImg() {
    const that = this
    wx.canvasToTempFilePath({
      canvasId: 'image',
      success: res => {
        wx.uploadFile({
          url: 'https://www.arch-seu.com/upload',
          filePath: res.tempFilePath,
          name: 'file',
          success: res => {
            try {
              let data = JSON.parse(res.data)
              that.setData({
                baseUrl: data.base_url
              })
              wx.showToast({
                title: '保存成功',
              })
            } catch (error) {
              wx.showModal({
                title: '提示',
                content: '服务器错误',
              })
            }
          }
        })
      }
    })
  },

  // picker 选择
  pickerChoose(e) {
    const name = e.currentTarget.dataset.name
    const picker = 'index.' + name
    const index = Number(e.detail.value)
    this.setData({
      [picker]: index
    })

  },

  //remark
  getRemark(e) {
    const value = e.detail.value
    this.setData({
      remark: value
    })
  },

  //提交
  submitComment() {
    const that = this
    let submitInfo = {}
    if (!this.data.remark && this.data.index.issue > 5) {
      wx.showModal({
        title: '提示',
        content: '具体内容不能为空！',
        showCancel: false
      })
      return false
    }
    wx.getStorage({
      key: 'save',
      success(res) {
        submitInfo = res.data

        submitInfo.pic_url = that.data.baseUrl
        submitInfo.token = app.globalData._token
        submitInfo.remark = that.data.remark
        let result = Object.assign(submitInfo, that.data.index)

        wx.request({
          url: app.globalData.host + 'picture/' + that.data.image.id + '/mark',
          method: 'POST',
          data: result,
          success: res => {
            try {
              if ('OK' == res.data.code) {
                wx.removeStorage({
                  key: 'save',
                })
                wx.showToast({
                  title: '提交成功',
                  complete: () => {
                    wx.navigateBack({
                      delta: 2
                    })
                  }
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
      },
    })
  }

})