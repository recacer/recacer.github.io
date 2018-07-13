//获取应用实例
const app = getApp()
let _this

Page({
  data: {
    mainColor: 'blue'
  },
  onLoad(options) {
    _this = this
  },
  onShow() {
    if (app.DATA.user == app.DATA.shareUser) {
      _this.setData({
        isMine: true
      })
      app.DATA.isMine = true
    }

    app.requestFun('/miniprogram/shop/queryUserShopHomePage', { userId: app.DATA.shareUser }, (res) => {
      if (res.data.resData){
        _this.setData({
          info: res.data.resData
        })
        app.DATA.shopInfo = res.data.resData
        console.log({'app.DATA.shopInfo数据':app.DATA.shopInfo})
        if (app.DATA.shopInfo.userShopInfo && app.DATA.shopInfo.userShopInfo.shopName) {
          wx.setNavigationBarTitle({
            title: app.DATA.shopInfo.userShopInfo.shopName
          })
        }
        if (app.DATA.shopInfo.userShopInfo && app.DATA.shopInfo.userShopInfo.shopStyle == 'default2'){
          _this.setData({
            mainColor: 'red'
          })
          app.changeStyle(1)
        }else{
          _this.setData({
            mainColor: 'blue'
          })
          app.changeStyle()
        }

      }
    })
  },
  toDetail() {
    wx.navigateTo({
      url: '/pages/home/peopleDetail',
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
      success: function (res) {
        if (res.confirm) {
          app.requestFun('/miniprogram/shop/deleteUserInfoTerritoryLabel', { userId: app.DATA.user, strLabel: val.currentTarget.id }, res => {
            app.requestFun('/miniprogram/shop/queryUserShopHomePage', { userId: app.DATA.shareUser }, (res) => {
              _this.setData({
                info: res.data.resData
              })
              app.DATA.shopInfo = res.data.resData
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
  toWebView(val) {
    app.toWebView(val.currentTarget.id)
  },
  create() {
    app.DATA.isOpenShop = true
    wx.switchTab({
      url: '/pages/tabBar/create'
    })
  },
  onShareAppMessage: function () {
    let name
    try{
      name = app.DATA.shopInfo.userShopInfo.shopName
    }catch(err){
      name = '财富超级店'
    }
    return {
      title: name,
      path: '/pages/index?u=' + app.DATA.user
    }
  }
})
