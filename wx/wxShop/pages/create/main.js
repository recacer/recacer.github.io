let app = getApp()

Page({
  data: {
    shopName: null,
    shopStyle: 'default1'
  },
  onLoad() {
    if (app.DATA.shareUser == app.DATA.user && app.DATA.shopInfo && app.DATA.shopInfo.userShopInfo && app.DATA.shopInfo.userShopInfo.shopName){
      this.setData({
        shopName: app.DATA.shopInfo.userShopInfo.shopName,
        shopStyle: app.DATA.shopInfo.userShopInfo.shopStyle
      })
    }
  },
  setName(val) {
    let value = val.detail.value.replace(/\s+/g, '')
    this.setData({
      shopName: value.substring(0, 10)
    })
  },
  save() {
    if (!this.data.shopName){
      wx.showToast({
        title: '请输入店名',
        icon: 'none'
      })
      return false
    }
    let param = {
      userId: app.DATA.user,
      shopName: this.data.shopName,
      shopStyle: this.data.shopStyle,
    }
    app.requestFun('/miniprogram/shop/createUserShop',param,(res)=>{
      wx.navigateBack({
        delta: -1
      })
    })
  },
  change(res) {
    this.setData({
      shopStyle: res.currentTarget.id
    })
  }
})