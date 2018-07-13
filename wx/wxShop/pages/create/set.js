let app = getApp()
let _this
const uploadImage = require('../../uploadJs/uploadAliyun.js');

Page({
  data: {
    img: '/images/upload_img.png',
    headImage: null,
    listLabel: []
  },
  onShow() {
    app.requestFun('/miniprogram/shop/listUserInfoTerritoryLabel', {
      userId: app.DATA.user
    }, res => {
      _this.setData({
        listLabel: res.data.resData.listLabel
      })
    })
  },
  onLoad() {
    _this = this
    if (app.DATA.shopInfo) {
      _this.setData(app.DATA.shopInfo.userShopInfo)
    }
  },
  navSkill() {
    wx.navigateTo({
      url: '/pages/create/skill',
    })
  },
  chooseImg() {
    var _that = this;
    wx.chooseImage({
      count: 1,
      success: res => {
        uploadImage({
          filePath: res.tempFilePaths[0],
          dir: "wechat-miniapp/",
          size: 1024 * 500,//限制500kb
          success: res => {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1200
            })
            console.log("上传成功")
            console.log(res)
            _that.setData({
              headImage: res
            })
          },
          fail: function(res) {
            console.log("上传失败")
            console.log(res)
            if (res.statusCode == 400) {
              wx.showModal({
                title: '提示',
                content: '上传文件大小超过500kb',
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
  changeInput(val) {
    if (val.currentTarget.id == 'userName' || val.currentTarget.id == 'position') {
      val.detail.value = val.detail.value.substring(0, 10)
    }
    if (val.currentTarget.id == 'companyName') {
      val.detail.value = val.detail.value.substring(0, 15)
    }
    if (val.currentTarget.id == 'userPhone') {
      val.detail.value = val.detail.value.substring(0, 11)
    }
    if (val.currentTarget.id == 'motto') {
      val.detail.value = val.detail.value.substring(0, 50)
    }
    if (val.currentTarget.id == 'career' || val.currentTarget.id == 'education') {
      val.detail.value = val.detail.value.substring(0, 200)
    }
    this.setData({
      [val.currentTarget.id]: val.detail.value
    })
  },
  save() {
    let param = _this.data
    param.userId = app.DATA.user
    if (!param.headImage) {
      wx.showToast({
        title: '请添加形象照',
        icon: 'none'
      })
      return false
    }
    if (!param.userName) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return false
    }
    if (!param.companyName) {
      wx.showToast({
        title: '请填写公司',
        icon: 'none'
      })
      return false
    }
    if (!param.position) {
      wx.showToast({
        title: '请填写职位',
        icon: 'none'
      })
      return false
    }
    if (!param.userPhone) {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none'
      })
      return false
    }
    if (this.data.listLabel.length < 1) {
      wx.showToast({
        title: '请增加擅长领域',
        icon: 'none'
      })
      return false
    }
    
    app.requestFun('/miniprogram/shop/updateUserShopInfo', _this.data, res => {
      if (res.data.status == '0000') {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
      }
    })
  },
  delSign(val) {
    if (this.data.listLabel.length < 2){
      wx.showToast({
        title: '擅长领域至少保留一项',
        icon: 'none'
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function(res) {
        if (res.confirm) {
          app.requestFun('/miniprogram/shop/deleteUserInfoTerritoryLabel', {
            userId: app.DATA.user,
            strLabel: val.currentTarget.id
          }, res => {
            app.requestFun('/miniprogram/shop/listUserInfoTerritoryLabel', {
              userId: app.DATA.user
            }, res => {
              _this.setData({
                listLabel: res.data.resData.listLabel
              })
            })
          })
        }
      }
    })
  }
})