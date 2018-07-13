let app = getApp()
let _this

Page({
  data: {
    list:null
  },
  onLoad() {
    _this = this
  },
  onShow() {
    app.requestFun('/miniprogram/shop/listUserShopProduct', { userId: app.DATA.user }, res => {
      _this.setData({
        list: res.data.resData.listProduct
      })
    })
  },
  click(val) {
    let arr = val.currentTarget.id.split(',')
    console.log(arr)
    //arr[0] 第几个按钮 arr[1] id arr[2] 排序序号
    switch(arr[0]){
      case "1":
        //上移
        if(arr[2] == 1){
          return false
        }
        app.requestFun('/miniprogram/shop/upSortUserShopProduct', { productId:arr[1],userId:app.DATA.user },res=>{
          if(res.data.status == '0000'){
            app.requestFun('/miniprogram/shop/listUserShopProduct', { userId: app.DATA.user }, res => {
              _this.setData({
                list: res.data.resData.listProduct
              })
            })
          }
        })
        break
      case "2":
        //下移
        if (arr[2] == _this.data.list.length) {
          return false
        }
        app.requestFun('/miniprogram/shop/downSortUserShopProduct', { productId: arr[1], userId: app.DATA.user }, res => {
          if (res.data.status == '0000') {
            app.requestFun('/miniprogram/shop/listUserShopProduct', { userId: app.DATA.user }, res => {
              _this.setData({
                list: res.data.resData.listProduct
              })
            })
          }
        })
        break
      case "3":
        //编辑
        wx.navigateTo({
          url: '/pages/create/addProduct?productId='+arr[1]
        })
        break
      case "4":
        //删除
        wx.showModal({
          title: '提示',
          content: '确定删除？',
          success: function (res) {
            if (res.confirm) {
              app.requestFun('/miniprogram/shop/deleteUserShopProduct', { productId: arr[1], userId: app.DATA.user }, res => {
                if (res.data.status == '0000') {
                  app.requestFun('/miniprogram/shop/listUserShopProduct', { userId: app.DATA.user }, res => {
                    _this.setData({
                      list: res.data.resData.listProduct
                    })
                  })
                }
              })
            }
          }
        })
        break
    }
  },
  toProductDetail(val) {
    let url = '/pages/create/productDetail?productId=' + val.currentTarget.id + '&isMine=1'

    wx.navigateTo({
      url: url
    })
  },
})