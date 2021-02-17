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
  },
  async getOpenID() {
    // 确认已经在 onLaunch 中调用过 wx.cloud.init 初始化环境
    const res2 = wx.cloud.callContainer({
      path: '/container-getopenid', // 填入容器的访问路径（云托管-服务列表-路径）
      method: 'GET',
    })
    console.log(res2)
  }
 
})