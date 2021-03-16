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

  clear_original_db(roomNum){
    const db = wx.cloud.database();
    const werewolf_db = db.collection(roomNum.toString());
    const _ = db.command
    return werewolf_db.where({
      _id: "basic_info"
    }).remove()
  },

  clear_original_db_cloud(roomNum){
    return wx.cloud.callFunction({
      name: 'clear_db',
      data: {
        roomNum: roomNum.toString(),
      },
    })
  },

  add_basic_info(roomNum){
    const db = wx.cloud.database();
    const werewolf_db = db.collection(roomNum.toString());
    return werewolf_db.add({
      data: {
        _id: "basic_info",
        god: app.globalData.userInfo.nickName.toString(),
        board: null
      }})
  },
  add_basic_info_cloud(roomNum){
    return wx.cloud.callFunction({
      name: 'add_basic_info',
      data: {
        roomNum: roomNum.toString(),
        god: app.globalData.userInfo.nickName.toString(),
        board: null
      },
  
    })
  },
 
  async bindGame() {
    this.data.roomNum = this.randomRoomNumber();
    var roomNum = this.data.roomNum;
    let self = this
    wx.showModal({
      title: '提示',
      content: '将要创建新房间' + roomNum + ', 覆盖已有数据，是否继续？',
      async success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          const clear = await self.clear_original_db_cloud(roomNum);
          console.log(clear)
          const add = await self.add_basic_info_cloud(roomNum);
          console.log(add)

          wx.showToast({
            title: '创建房间成功',
            icon: 'success',
            duration: 1000
          })
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

