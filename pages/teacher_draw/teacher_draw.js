// pages/teacher_draw/teacher_draw.js
Page({

  data: {

    //优化用户体验
    ok: false,
    flag: false,

    // picker 相关
    index: {
      detail: 0,
      again: 0,
    },
    detail: ['结构错误', '表达错误', '审题错误', '不采光', '流线错误', '不通风', '还有一些其他错误'],
    again: ['是', '否'],

    //画布属性
    height: 0,
    size: 1,
    color: 'red',
    image: {
      id: 1,
      url: 'http://www.dogwallpapers.net/wallpapers/samoyed-puppy-wallpaper.jpg'
    }
  },
  // onLoad(options) {

  // },

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

    //下载图片
    wx.downloadFile({
      url: img.url,
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
              height: calc
            })

            console.log(width, calc)
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
      }
    })

  },

  onLoad(e) {
    this.ctx = wx.createCanvasContext('image')
    const that = this
    const img = that.data.image
    that.drawImages(img)
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

    this.drawImages(this.data.image)
  },

  //保存绘图
  saveImg() {
    wx.canvasToTempFilePath({
      canvasId: 'image',
      success: res => {
        console.log(res.tempFilePath)
        wx.showToast({
          title: '保存成功',
        })
      }
    })
  },

  pickerChoose(e) {
    const name = e.currentTarget.dataset.name
    const picker = 'index.' + name
    const index = Number(e.detail.value)
    this.setData({
      [picker]: index
    })

  }

})