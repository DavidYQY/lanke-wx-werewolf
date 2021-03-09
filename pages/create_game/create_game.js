// create_game.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    roomNum: null
  },
  randomRoomNumber() {
    //return Math.floor(1000 + Math.random() * 9000).toString();
    return 1000;
  },

  bindGame() {
    this.data.roomNum = this.randomRoomNumber();
    var roomNum = this.data.roomNum;
    const db = wx.cloud.database();
    const werewolf_db = db.collection('werewolf-dev');
    werewolf_db.where({ _id: roomNum.toString()}).get({
      success: function(res) {
        // res.data 包含该记录的数据
        if (res.data.length == 0){
          // 没有这条记录
          const db = wx.cloud.database();
          const werewolf_db = db.collection('werewolf-dev');
          werewolf_db.add({
            data:{
              _id: roomNum.toString(),
              god: app.globalData.userInfo.nickName.toString()
            }
          })
        }

        wx.showModal({
          title: '提示',
          content: '创建成功！房间号为' + roomNum,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '../god_game/god_game',
              })
              app.globalData.room_id = roomNum;
              app.globalData.is_host = true;
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
     })
  }


})

