let app = getApp()
let _this

Page({
  data: {
    list: [],
    classify: [],
    parentId: null,
    selectChildren: null,
    childId: null
  },
  onLoad() {
    _this = this

    app.requestFun('/miniprogram/shop/listSysProductClassify', null, res => {
      let data = res.data.resData.listClassify
      _this.setData({
        classify: data,
        parentId: data[0].classifyId,
        selectChildren: data[0].children,
        childId: data[0].children[0].classifyId
      })
      app.requestFun('/miniprogram/shop/listSysProduct', {
        classifyId: _this.data.childId,
        userId: app.DATA.user
      }, res => {
        _this.setData({
          list: res.data.resData.listProduct
        })
      })
    })
  },
  toDetail(val) {
    wx.navigateTo({
      url: '/pages/create/productDetail?productId=' + val.currentTarget.id
    })
  },
  add(val) {
    app.requestFun('/miniprogram/shop/insertUserShopSysProduct', {
      sysProductId: val.currentTarget.id,
      userId: app.DATA.user
    }, res => {
      if (res.data.status == '0000') {
        app.requestFun('/miniprogram/shop/listSysProduct', {
          classifyId: _this.data.childId,
          userId: app.DATA.user
        }, res => {
          _this.setData({
            list: res.data.resData.listProduct
          })
        })
      }
    })
  },
  selectParent(val) {
    let product = val.currentTarget.dataset.product;
    if (this.data.parentId != product.classifyId) {
      this.setData({
        parentId: product.classifyId,
        selectChildren: product.children || [],
        childId: product.children && product.children[0].classifyId || product.classifyId
      })
      app.requestFun('/miniprogram/shop/listSysProduct', {
        classifyId: _this.data.childId,
        userId: app.DATA.user
      }, res => {
        _this.setData({
          list: res.data.resData.listProduct
        })
      })
    }
  },
  selectChild(val) {
    if (this.data.childId != val.currentTarget.id) {
      this.setData({
        childId: val.currentTarget.id
      })
      app.requestFun('/miniprogram/shop/listSysProduct', {
        classifyId: _this.data.childId,
        userId: app.DATA.user
      }, res => {
        _this.setData({
          list: res.data.resData.listProduct
        })
      })
    }
  }
})