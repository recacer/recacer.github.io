let app = getApp()

Page({
  data: {},
  onLoad() {
    this.setData({
      info: app.DATA.shopInfo,
      career: app.DATA.shopInfo.userShopInfo.career || '',
      education: app.DATA.shopInfo.userShopInfo.education || '',
      honor: app.DATA.shopInfo.userShopInfo.honor || '',
      mainColor: app.DATA.mainColor,
      isMine:app.DATA.user == app.DATA.shareUser
    })
  }
})