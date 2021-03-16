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

  enterGame() {
    this.data.room_id
    app.globalData.room_id = this.data.room_id;
    let self = this
    app.globalData.is_back = true

    wx.cloud.callFunction({
      name: 'get_current_info',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
        console.log((res.result.data.locked == 'true'))
        app.globalData.is_locked = (res.result.data.locked == 'true')
        console.log(app.globalData.is_locked)
        
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

    


  }
})