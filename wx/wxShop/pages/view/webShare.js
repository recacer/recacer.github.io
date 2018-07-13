let app = getApp()
let _this

Page({
  data: {},
  onLoad(options) {
    console.log(options)
    if (options.url){
      let url = options.url + '?userId=' + options.userId + '&clientId=' + options.clientId
      if(options.isShare){
        url += '&isShare=1'
      }
      this.setData({
        src: url
      })
    }else{
      this.setData({
        src: app.DATA.shareLink
      })
    }
    
  },
  getMessage(data) {
    console.log(data)
    app.DATA.shareMsg = data.detail.data[0]
  },
  onShareAppMessage: function (res) {
    console.log(res)
    return {
      title: app.DATA.shareMsg.title,
      path: '/pages/view/webShare?url=' + app.DATA.shareMsg.url.replace('?','&') + '&isShare=1'
    }
  }
})