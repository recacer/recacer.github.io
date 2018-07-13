let app = getApp()
let _this

Page({
  data: {},
  onLoad() {
    this.setData({
      list: app.DATA.shopInfo.listProduct
    })
  },
  toProductDetail(val) {
    let url = '/pages/create/productDetail?productId=' + val.currentTarget.id + '&isMine=1'

    wx.navigateTo({
      url: url
    })
  },
})