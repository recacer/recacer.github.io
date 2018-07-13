let app = getApp()
let _this
let map

Page({
  data: {
    skill: null,
    listLabel: []
  },
  onLoad() {
    _this = this
    app.requestFun('/miniprogram/shop/listSysTerritoryLabel', {
      userId: app.DATA.user
    }, res => {
      map = new Map()
      res.data.resData.listLabel.forEach((v, k) => {
        map.set(v, '')
      })
      app.requestFun('/miniprogram/shop/listUserInfoTerritoryLabel', {
        userId: app.DATA.user
      }, res => {
        res.data.resData.listLabel.forEach((v, k) => {
          map.set(v, 'active')
        })
        _this.setData({
          listLabel: [...map]
        })
      })
    })
  },
  selectFun(val) {
    let value = val.target.id;
    if (!value) return false
    let bol = true
    if (value.indexOf('active') != -1) {
      bol = false
    }
    this.addSign(value.split(',')[0], bol)
  },
  addSign(val, bol) {
    map.set(val, bol ? 'active' : '')
    _this.setData({
      listLabel: [...map]
    })
  },
  addSkill(val) {
    let key = val.detail.value
    if (key) {
      this.addSign(key.replace(/\n+|\s+/g, ''), true)
      this.setData({
        skill: null
      })
    }
  },
  save() {
    let strLabel = null
    _this.data.listLabel.forEach((v, k) => {
      if (v[1]) {
        !strLabel ? strLabel = v[0] : strLabel += ',' + v[0]
      }
    })
    if (!strLabel) {
      wx.showToast({
        title: '擅长领域至少保留一项',
        icon: 'none'
      })
      return false
    }
    app.requestFun('/miniprogram/shop/insertUserInfoTerritoryLabel', {
      userId: app.DATA.user,
      strLabel: strLabel
    }, res => {
      if (res.data.status == '0000') {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
      }
    })
  }
})