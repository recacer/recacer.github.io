let app = getApp()
let _this

Page({
  data: {
    isShow:false,
  },
  onLoad(options) {
    _this = this
    if (app.DATA.shopInfo.userShopInfo && app.DATA.shopInfo.userShopInfo.userPhone){
      _this.setData({
        sharePhone: app.DATA.shopInfo.userShopInfo.userPhone
      })
    }
    
    //options.isMine 用于判断用哪个接口获取产品信息
    let url = options.isMine ? '/miniprogram/shop/getUserShopProduct' : '/miniprogram/shop/getSysProduct'
    
    app.requestFun(url, { productId: options.productId, userId: app.DATA.shareUser },res=>{
      let list = res.data.resData.product.productBrief.split(/\n/g)
      _this.setData({
        info: res.data.resData.product,
        productId: options.productId,
        list: list
      })
    })
  },
  show() {
    this.setData({
      isShow:true
    })
  }, 
  hide() {
    this.setData({
      isShow: false
    })
  },
  inputValue(val) {
    this.setData({
      [val.currentTarget.id]: val.detail.value
    })
  },
  submit() {
    let param = {
      userId: app.DATA.shareUser,
      type: 9,
      phone: _this.data.phone,
      name: _this.data.name
    }
    app.requestFun('/miniprogram/familyPlan/addUserLink',param,res=>{
      if (res.data.data.resultCode == '0000'){
        wx.showToast({
          title: '咨询成功',
          icon: 'none'
        })
      }
      
      this.setData({
        isShow: false
      })
    })
  },
  call(val) {
    wx.makePhoneCall({
      phoneNumber: val.currentTarget.id
    })
  }
})