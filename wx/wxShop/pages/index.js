let app = getApp()
let _this

Page({
  data: {
    msgShow: false
  },
  onLoad(options) {
    _this = this

    wx.showLoading({
      title: '数据加载中'
    })
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)
    var u = options.u
    app.getUserInfo(scene != 'undefined' && scene || u != 'undefined' && u)
    // 获取用户信息
    /*wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.DATA.userInfo = res.userInfo
              let user = wx.getStorageSync('user');
              if(!user){
                app.toLogin()
              }else{
                app.DATA.user = user
              }
              wx.switchTab({
                url: '/pages/tabBar/home'
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          _this.setData({
            msgShow:true
          })
          wx.hideLoading()
        }
      }
    })*/
  }
})