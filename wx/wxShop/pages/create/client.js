let app = getApp()
let _this

Page({
  data: {
    selectReport: 'select1'
  },
  onLoad() {
    this.setData({
      info: app.DATA.shopInfo
    })
  },
  toWebShare(val) {
    let item = val.currentTarget.dataset.item
    app.toWebSharePlan([item.planId, item.planType])
  },
  select(val) {
    this.setData({
      selectReport: val.currentTarget.id
    })
  },
})