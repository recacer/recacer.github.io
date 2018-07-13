let app = getApp()
let _this
let scale = wx.getSystemInfoSync().windowWidth / 750

Page({
  data: {
    isEdit: false,
    textareaVal: null
  },
  onHide() {
    this.setData({
      isEdit: false,
      info: null
    })
  },
  onLoad(options) {
    _this = this
  },
  onShow() {
    
    if (app.DATA.shopInfo.userShopInfo && app.DATA.shopInfo.userShopInfo.shopStyle == 'default2') {
      _this.setData({
        mainColor: 'red'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#dc3250'
      })
    }else{
      _this.setData({
        mainColor: 'blue'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#0586cf'
      })
    }
    app.requestFun('/miniprogram/shop/getUserCalendarMessage', {
      userId: app.DATA.shareUser
    }, res => {
      res.data.resData.dataLunarStr = '农历' + res.data.resData.dataLunarStr.split('年')[1].split('日')[0]
      _this.setData({
        info: res.data.resData,
        num: res.data.resData.dataSolarStr.split('.')[2],
        tips: res.data.resData.tips
      })
      app.DATA.calendar = res.data.resData
      if (res.data.resData.wxQrCode && app.DATA.shareUser == app.DATA.user) {
        _this.setData({
          hasShop: true
        })
      }
    })
  },
  nextPage() {
    wx.navigateTo({
      url: '/pages/calendar/main'
    })
  },
  edit() {
    if(this.data.isEdit){
      this.setData({
        isEdit: false
      })
    }else{
      _this.setData({
        isEdit: true,
        textareaVal: app.DATA.calendar.tips
      })
      // wx.pageScrollTo({
      //   scrollTop: wx.getSystemInfoSync().windowHeight
      // })
    }
  },
  changeInput(val) {
    let key = val.detail.value
    if (/\n/.test(key) && key) {
      this.setData({
        textareaVal: key.replace(/\n+/g, '')
      })
      this.save()
      return false
    }
    this.setData({
      textareaVal: key
    })
  },
  save() {
    app.DATA.calendar.tips = this.data.textareaVal
    console.log(app.DATA.calendar)
    if (app.DATA.calendar.tips) {
      app.requestFun('/miniprogram/shop/insertUserCalendarMessage', {
        tips: app.DATA.calendar.tips,
        userId: app.DATA.user
      }, res => {
        if (res.data.status == '0000') {
          this.setData({
            isEdit: false,
            tips: app.DATA.calendar.tips
          })
        }
      })
    }
  }
})