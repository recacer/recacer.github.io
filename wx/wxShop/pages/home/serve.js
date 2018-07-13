let app = getApp()

Page({
  data: {
    mainColor: 'blue'
  },
  onLoad() {
    this.setData({
      list: app.DATA.shopInfo.listShopPlan,
      mainColor: app.DATA.mainColor
    })
  },
  toWebView(val) {
    app.toWebView(val.currentTarget.id)
  },
})