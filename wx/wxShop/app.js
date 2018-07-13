let _this

App({
  onLaunch() {
    _this = this
  },
  DATA: {
    mainColor: 'blue',
    isMine: true
  },
  requestFun(url, param, successFun, errorFun) {
    wx.showLoading({
      title: '数据加载中'
    })
    let URL = 'https://wxprogram.ailibuli.cn' + url
    console.log(URL, param)
    //url test http://ayminiapp.vipgz1.idcfengye.com
    wx.request({
      url: URL,
      data: param,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        if(res.data.status != '0000'){
          wx.showToast({
            title: '错误码:' + res.data.status +' ' + res.data.message,
            icon: 'none'
          })
        }
        return successFun(res)
      },
      fail: function (err) {
        console.log(err)
        wx.hideLoading()
        if (typeof errorFun == 'function'){
          return errorFun(err)
        }
      }
    })
  },
  toLogin(userId) {
    _this = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        _this.requestFun('/miniprogram/user/login', { code: res.code }, (res) => {
          if (res.data.status == '0000') {
            wx.setStorageSync('user', res.data.resData.userId)
            _this.DATA.user = res.data.resData.userId
            !userId && (_this.DATA.shareUser = res.data.resData.userId)
            wx.switchTab({
              url: '/pages/tabBar/home'
            })
          }
         }, (err)=> {
            wx.showToast({
              title: JSON.stringify(err),
              icon: 'none'
            })
           //_this.toLogin(userId)
        })
      }
    })
  },
  getUserInfo(userId) {
    _this = this
    userId && (_this.DATA.shareUser = userId)
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        console.log('session_key 未过期')
        if(wx.getStorageSync('user')){
          _this.DATA.user = wx.getStorageSync('user')
          !userId && (_this.DATA.shareUser = _this.DATA.user)
          wx.switchTab({
            url: '/pages/tabBar/home'
          })
        }else{
          _this.toLogin(userId)
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log('session_key 已经失效')
        // 登录
        _this.toLogin(userId)
      }
    })
  },
  calendarFun(res,fn) {
    let ctx = wx.createCanvasContext('canvas')
    let scale = wx.getSystemInfoSync().windowWidth / 750

    ctx.drawImage('/images/calendar_' + this.DATA.mainColor + '.png', 0, 0, 640 * scale, 985 * scale)
    ctx.setTextAlign('center')
    ctx.setTextBaseline('top')
    
    ctx.setFontSize(380 * scale)
    ctx.setFillStyle(this.DATA.mainColor == 'blue' ? '#3596db' : '#dc3250')
    ctx.fillText(res.dataSolarStr.split('.')[2], 320 * scale, 115 * scale)

    //日期
    ctx.setFontSize(24 * scale)
    ctx.setFillStyle('#282828')
    ctx.fillText(res.dataSolarStr + ' ' + res.weekStr, 320 * scale, 105 * scale)
    ctx.fillText(res.dataLunarStr + '  【' + res.dayStr + '年】', 320 * scale, 145 * scale)
    
    //理财小知识
    if(res.tips){
      ctx.setFontSize(26 * scale)
      let arr = res.tips.split('')
      let fontArr = []
      let newWord = ''
      for (let i = 0; i < arr.length; i++) {
        if (ctx.measureText(newWord).width < 510 * scale) {
          newWord += arr[i]
        } else {
          fontArr.push(newWord)
          newWord = arr[i]
        }
      }
      newWord && fontArr.push(newWord)
      for (let j = 0; j < fontArr.length; j++) {
        ctx.fillText(fontArr[j], 320 * scale, (610 + j * 35) * scale)
      }
    }
    
    //姓名 公司 职位
    if (res.userName){
      ctx.setFontSize(30 * scale)
      ctx.setTextAlign('left')
      ctx.fillText(res.userName, 351 * scale, 777 * scale)
      if (res.companyName.length > 10){
        res.companyName = res.companyName.substring(0,9) +'...'
      }
      ctx.setFontSize(24 * scale)
      ctx.fillText(res.companyName, 351 * scale, 820 * scale)
      ctx.fillText(res.position, 351 * scale, 860 * scale)
    }

    if (res.imgUrl || res.wxQrCode){
      // ctx.setTextAlign('left')
      // ctx.setFontSize(20 * scale)
      // ctx.setFillStyle('#999')
      // ctx.fillText('扫码进入门店', 175 * scale, 885 * scale)

      if (res.imgUrl) {
        ctx.drawImage(res.imgUrl, 150 * scale, 767 * scale, 150 * scale, 150 * scale)
        ctx.draw()
        typeof fn == 'function' && fn()
      } else {
        wx.showLoading({
          title: '数据加载中'
        })
        _this.DATA.calendar = res
        wx.downloadFile({
          url: res.wxQrCode,
          success: (res) => {
            console.log(res)
            wx.hideLoading()
            if (res.statusCode === 200) {
              _this.DATA.calendar.imgUrl = res.tempFilePath
              ctx.drawImage(res.tempFilePath, 150 * scale, 767 * scale, 150 * scale, 150 * scale)
              ctx.draw()
              typeof fn == 'function' && fn()
            }
          }
        })
      }
    }else{
      ctx.draw()
      typeof fn == 'function' && fn()
    }
  },
  toWebView(val) {
    _this.DATA.link = 'https://wxprogram.ailibuli.cn/wx';
    switch (val) {
      case 'e126be64d3294398be6414f35fc8b98b':
        //保障规划
        _this.DATA.link += '/project/preIndex.html?userId=' + _this.DATA.shareUser
        break;
      case 'f25ea9fe65ea44619af9ffb50f0831b3':
        //教育规划
        _this.DATA.link += '/education/preIndex.html?userId=' + _this.DATA.shareUser
        break;
      case 'b77b0001493a4e8a8cfe94202bba1253':
        //养老规划
        _this.DATA.link += '/provide/preIndex.html?userId=' + _this.DATA.shareUser
        break;
      case '2c7273f72bbd412aad88a2dd8fefc8cf':
        //税务筹划
        _this.DATA.link += '/tax.html?userId=' + _this.DATA.shareUser
        break;
      case 'bcb120651ac0458595645cd43bddc742':
        //风险防范
        _this.DATA.link += '/precaution.html?userId=' + _this.DATA.shareUser
        break;
      case '14c5aba3e37d40e4b31ca0c565b70f79':
        //保单体检
        _this.DATA.link += '/examination.html?userId=' + _this.DATA.shareUser
        break;
      case '34a8792e6b6446778a088901c7043efd':
        //资产体检
        _this.DATA.link += '/property.html?userId=' + _this.DATA.shareUser
        break;
      case 'dda30d6bd80540e087f662d10f46d1dd':
        //保单比对
        _this.DATA.link += '/comparison.html?userId=' + _this.DATA.shareUser
        break;
    }
    if (_this.DATA.isMine){
      _this.DATA.link += '&isShare=1'
    }
    console.log(_this.DATA.link)
    wx.navigateTo({
      url: '/pages/view/web'
    })
  },
  toWebSharePlan(arr) {
    _this.DATA.shareLink = 'https://wxprogram.ailibuli.cn/wx';
    switch (arr[1]) {
      case '保障规划':
        //保障规划
        _this.DATA.shareLink += '/project/report.html?userId=' + _this.DATA.shareUser + '&clientId=' + arr[0]
        break;
      case '教育规划':
        //教育规划
        _this.DATA.shareLink += '/education/report.html?userId=' + _this.DATA.shareUser + '&clientId=' + arr[0]
        break;
      case '养老规划':
        //养老规划
        _this.DATA.shareLink += '/provide/report.html?userId=' + _this.DATA.shareUser + '&clientId=' + arr[0]
        break;
    }
    console.log(_this.DATA.shareLink)
    wx.navigateTo({
      url: '/pages/view/webShare'
    })
  },
  changeStyle(bol) {
    if (bol) {
      this.DATA.mainColor = 'red'
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#dc3250'
      })
      wx.setTabBarStyle({
        selectedColor: "#fa5a69"
      })
      wx.setTabBarItem({
        index: 0,
        text: '首页',
        selectedIconPath: 'images/tab_home_red.png'
      })
      wx.setTabBarItem({
        index: 1,
        text: '日历',
        selectedIconPath: 'images/tab_calendar_red.png'
      })
      wx.setTabBarItem({
        index: 2,
        text: '我的',
        selectedIconPath: 'images/tab_edit_red.png'
      })
    } else {
      this.DATA.mainColor = 'blue'
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#0586cf'
      })
      wx.setTabBarStyle({
        selectedColor: "#0586cf"
      })
      wx.setTabBarItem({
          index: 0,
          text: '首页',
          selectedIconPath: 'images/tab_homes.png'
        })
        wx.setTabBarItem({
          index: 1,
          text: '日历',
          selectedIconPath: 'images/tab_calendars.png'
        })
        wx.setTabBarItem({
          index: 2,
          text: '我的',
          selectedIconPath: 'images/tab_edits.png'
        })
    }
  }
})