let app = getApp()
let _this
const uploadImage = require('../../uploadJs/uploadAliyun.js');

Page({
  data: {
    productId:null
  },
  onLoad(options) {
    _this = this
    if (options.productId){
      wx.setNavigationBarTitle({
        title: '修改产品'
      })
      _this.data.productId = options.productId
      app.requestFun('/miniprogram/shop/getUserShopProduct', { productId: options.productId,userId:app.DATA.user },res=>{
        _this.setData(res.data.resData.product)
      })
    }
  },
  coverClick() {
    this.chooseImg('productCover',1024*500)
  },
  detailClick() {
    this.chooseImg('productDetailsUrl')
  },
  chooseImg(ele,size) {
    var _that = this;
    wx.chooseImage({
      count: 1,
      success: res => {
        uploadImage({
          filePath: res.tempFilePaths[0],
          dir: "wechat-miniapp/",
          size: size,
          success:res=> {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1200
            })
            console.log("上传成功")
            console.log(res)
            _that.setData({
              [ele]: res
            })
          },
          fail:res=> {
            console.log("上传失败")
            console.log(res)
            if (res.statusCode == 400) {
              wx.showModal({
                title: '提示',
                content: size ? '上传文件大小超过500kb' : '上传文件大小超过2M',
                showCancel: false
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '未知错误请与管理员联系~',
                showCancel: false
              })
            }
          }
        })
      }
    })
  },
  changeInput(value) {
    this.setData({
      [value.target.id]: value.detail.value
    })
  },
  add() {
    let param = _this.data
    param.userId = app.DATA.user
    if (!param.productName) {
      wx.showToast({
        title: '请填写产品名称',
        icon: 'none'
      })
      return false
    }
    if (!param.productCover) {
      wx.showToast({
        title: '请选择产品封面图片',
        icon: 'none'
      })
      return false
    }
    if (!param.productBrief) {
      wx.showToast({
        title: '请填写产品简介',
        icon: 'none'
      })
      return false
    }
    if (!param.productDetailsUrl) {
      wx.showToast({
        title: '请选择产品详情图片',
        icon: 'none'
      })
      return false
    }
    app.requestFun(_this.data.productId ? '/miniprogram/shop/updateUserShopProduct' : '/miniprogram/shop/insertUserShopProduct',param,res=>{
      if(res.data.status == '0000'){
        wx.navigateBack({
          delta: _this.data.productId ? 1 : 2
        })
      }
    })
  }
})