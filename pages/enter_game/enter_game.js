// enter_game.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    room_id: "1000"
  },
  roomNumberInput: function (e) {
    this.setData({
      room_id: e.detail.value
    })
  },
  update_basic_info(){

  },

  enterGame() {
    this.data.room_id
    app.globalData.room_id = this.data.room_id;
    let self = this
    wx.cloud.callFunction({
      name: 'get_basic_info',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
          var god_name = res.result.data.god
          if (god_name == app.globalData.userInfo.nickName){
            wx.navigateTo({
              url: '../god_game/god_game',
            })
          }else{
            wx.navigateTo({
              url: '../game/game',
            })
          }
      },
    })

  }
})