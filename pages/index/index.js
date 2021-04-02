// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    pageInfo: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
  },
  // 事件处理函数
  /*
  onLoad() {
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }*/
    onLoad() {
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗

    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        console.log(app.globalData.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  bindCreateGame() {
    console.log(this.data.hasUserInfo)
    if (!this.data.hasUserInfo){
      this.getUserProfile()
      return
    }
    wx.navigateTo({
      url: '../create_game/create_game'
    })
  },
  bindEnterGame() {
    if (!this.data.hasUserInfo){
      this.getUserProfile()
      return
    }
    wx.navigateTo({
      url: '../enter_game/enter_game'
    })
  }
})
