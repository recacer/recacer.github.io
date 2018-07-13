let app = getApp()
let _this

Page({
  data: {
    mainColor: 'blue',
    info: null
  },
  onLoad() {
    _this = this
  },
  onShow() {
    if (app.DATA.isOpenShop){
      this.setData({
        isOpenShop: true
      })
    }
    app.requestFun('/miniprogram/shop/queryCreateUserShopHomePage', {
      userId: app.DATA.user
    }, res => {
      if (res.data.resData.isOpenShop == 'Y'){
        //开店成功才替换店铺信息
        if (app.DATA.user != app.DATA.shareUser){
          app.DATA.shareUser = app.DATA.user
        }
        if (!_this.data.isOpenShop){
          _this.setData({
            isOpenShop: true
          })
        }
        app.DATA.shopInfo = res.data.resData
        if (app.DATA.shopInfo.userShopInfo.shopStyle == 'default2') {
          app.DATA.mainColor = 'red'
          _this.setData({
            mainColor: 'red'
          })
          wx.setTabBarStyle({
            selectedColor: "#f73f3f"
          })
          wx.setTabBarItem({
            index: 0,
            text: '首页',
            selectedIconPath: 'images/tab_home_red.png'
          })
          wx.setTabBarItem({
            index: 1,
            text: '日历',
            selectedIconPath: 'images/tab_calendar_red.png'
          })
          wx.setTabBarItem({
            index: 2,
            text: '我的',
            selectedIconPath: 'images/tab_edit_red.png'
          })
        } else {
          app.DATA.mainColor = 'blue'
          _this.setData({
            mainColor: 'blue'
          })
          wx.setTabBarStyle({
            selectedColor: "#0586cf"
          })
          wx.setTabBarItem({
            index: 0,
            text: '首页',
            selectedIconPath: 'images/tab_homes.png'
          })
          wx.setTabBarItem({
            index: 1,
            text: '日历',
            selectedIconPath: 'images/tab_calendars.png'
          })
          wx.setTabBarItem({
            index: 2,
            text: '我的',
            selectedIconPath: 'images/tab_edits.png'
          })
        }
      } 
      _this.setData({
        info: res.data.resData
      })
    })
  },
  onHide() {
    this.setData({
      info: null
    })
  },
  main() {
    wx.navigateTo({
      url: '/pages/create/main',
    })
  },
  set() {
    if (_this.data.info.isOpenShop == 'N') {
      wx.showToast({
        title: '请先创建门店',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/create/set',
    })
  },
  light() {
    if (_this.data.info.isOpenShop == 'N') {
      wx.showToast({
        title: '请先创建门店',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/create/light',
    })
  },
  add() {
    if (_this.data.info.isOpenShop == 'N') {
      wx.showToast({
        title: '请先创建门店',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/create/add',
    })
  },
  client() {
    wx.navigateTo({
      url: '/pages/create/client',
    })
  },
  openShop() {
    this.setData({
      isOpenShop: true
    })
  },
  delSign(val) {
    if (this.data.info.listLabel.length < 2) {
      wx.showToast({
        title: '擅长领域至少保留一项',
        icon: 'none'
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function(res) {
        if (res.confirm) {
          app.requestFun('/miniprogram/shop/deleteUserInfoTerritoryLabel', {
            userId: app.DATA.user,
            strLabel: val.currentTarget.id
          }, res => {
            app.requestFun('/miniprogram/shop/queryCreateUserShopHomePage', {
              userId: app.DATA.user
            }, res => {
              _this.setData({
                info: res.data.resData
              })
              if (app.DATA.user == app.DATA.shareUser){
                app.DATA.shopInfo = res.data.resData
              }
            })
          })
        }
      }
    })
  },
  toProductDetail(val) {
    let url = '/pages/create/productDetail?productId=' + val.currentTarget.id + '&isMine=1'

    wx.navigateTo({
      url: url
    })
  },
  edit(val) {
    wx.navigateTo({
      url: '/pages/create/addProduct?productId=' + val.currentTarget.id
    })
  },
  toWebView(val) {
    app.toWebView(val.currentTarget.id)
  },
})