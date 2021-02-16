// create_game.js
// 获取应用实例
const app = getApp()

Page({
  data: {

  },
  randomRoomNumber() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  },
  bindGame() {
    var roomNum = this.randomRoomNumber();
    const db = wx.cloud.database();
    db.collection("werewolf-dev").add({
      data: {
        room_id: roomNum
      },
      success: function(res) {
        app.globalData.room_id = roomNum;
        app.globalData.is_host = true;
        wx.navigateTo({
          url: '../game/game',
        })
      }
    })
  }
})