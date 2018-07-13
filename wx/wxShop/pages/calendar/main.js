let app = getApp()
let _this

Page({
  data: {},
  onLoad() {
    _this = this
    if (app.DATA.shopInfo.userShopInfo && app.DATA.shopInfo.userShopInfo.shopStyle == 'default2') {
      _this.setData({
        mainColor: 'red'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#dc3250'
      })
    } else {
      _this.setData({
        mainColor: 'blue'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#0586cf'
      })
    }
    app.calendarFun(app.DATA.calendar,()=>{
      _this.setData({
        canLongtap: true
      })
    })
  },
  longtap() {
    if (!this.data.canLongtap) return false
    let scale = wx.getSystemInfoSync().windowWidth / 750;

    wx.showLoading({
      title: '正在生成图片...',
      mask: true,
    });

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'canvas',
      success: res => {
        console.log(res.tempFilePath)
        wx.hideLoading()
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '已保存到系统相册',
              icon: 'none'
            })
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
          }
        })
      }
    })
  }
})