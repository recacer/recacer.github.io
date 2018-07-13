let app = getApp()
let _this

Page({
  data: {
    list:[]
  },
  onLoad() {
    _this = this
    app.requestFun('/miniprogram/shop/listShopPlanService', { userId:app.DATA.user },res=>{
      _this.setData({
        list: res.data.resData.listShopPlan
      })
    })
  },
  change(val) {
    let url = '/miniprogram/shop/insertUserShopPlanService'
    if (!val.detail.value){
      url = '/miniprogram/shop/deleteUserShopPlanService'
    }
    app.requestFun(url, { userId: app.DATA.user, planServiceId: _this.data.list[val.target.id].planServiceId },res=>{
      if(res.data.status == '0000'){
        wx.showToast({
          title: '设置成功',
        })
      }
    })
  }
})