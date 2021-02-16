// enter_game.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    room_id: null
  },
  roomNumberInput: function (e) {
    this.setData({
      room_id: e.detail.value
    })
  },
  enterGame() {
    const db = wx.cloud.database();
    db.collection("werewolf-dev").where({
      room_id: this.data.room_id
    }).get({
      success: function(res) {
        console.log(res.data)
        app.globalData.room_id = res.data[0].room_id;
        wx.navigateTo({
          url: '../game/game',
        })
      }
    })
  }
 
})