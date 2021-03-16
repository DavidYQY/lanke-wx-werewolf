// game.js
// 获取应用实例
var app = getApp()

Page({
  data: {
    room_id: null,
    is_host: false,
    identity: null,
    board: null,
    god: null,
    seats: [],
    seat_names: [],
    seat_pic_urls: [],
    seated: false
  },

  update_basic_info(){
    let self = this
    wx.cloud.callFunction({
      name: 'get_basic_info',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
        self.setData({
          god: res.result.data.god,
          board: res.result.data.board
        })
      },
    })
  },

  update_identity_info(){
    let self = this
    wx.cloud.callFunction({
      name: 'get_player_info',
      data: {
        roomNum: this.data.room_id,
        name: app.globalData.userInfo.nickName.toString()
      },
      complete: res => {
        try{
          self.setData({
            identity: res.result.data.identity
          })
        }catch (e){
          console.log(e)
        }
      },
    })

  },

  update_player_infos(){
    let self = this
    wx.cloud.callFunction({
      name: 'get_player_infos',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
        let arr = res.result.data
        self.data.seat_pic_urls = this.fillArray("/images/empty_seat.png", 12)
        self.data.seat_names = this.fillArray("", 12)
        for (var i = 0; i < arr.length; i++) {
          var seat_num = arr[i]['seat_num']
          var url = arr[i]['image']
          var name = arr[i]['_id']
          self.data.seat_pic_urls[seat_num - 1] = url
          self.data.seat_names[seat_num - 1] = name
        }
        self.setData({
          seat_pic_urls: self.data.seat_pic_urls,
          seat_names: self.data.seat_names
        })
      },
    })
  },

  add_player_info(name, seat_num, identity, image){
    console.log(name + seat_num + identity)
    let self = this
    wx.cloud.callFunction({
      name: 'add_player_info',
      data: {
        roomNum: this.data.room_id,
        image: image,
        name: name, 
        seat_num: seat_num.toString(),
        identity: identity
      },
      complete: res => {
        console.log(res)
        console.log("upload user-info complete!")
      },
    })
  },

  onLoad() {
    let self = this

    this.setData({
      seats: (Array.from(Array(12).keys()).map(i => {return i+1})),
      seat_pic_urls: this.fillArray("/images/empty_seat.png", 12),
      seat_names: this.fillArray("", 12),
    });
    this.setData({
      room_id: app.globalData.room_id,
      is_host: app.globalData.is_host
    })
    this.refresh_all()

  },

  refresh_all (){
    this.update_basic_info()
    this.update_identity_info()
    this.update_player_infos()
  },

  sit_down(e){
    if (this.data.seated){
      return
    }

    let idx = e.currentTarget.dataset.idx
    let self = this
    wx.showModal({
      title: '提示',
      content: '将在' + (idx + 1) + "位置坐下，一旦坐下不能站起，是否继续？" ,
      success (res) {
        if (res.confirm) {
          console.log(app.globalData.userInfo)
          self.data.seated = true
          self.data.seat_pic_urls[idx] = app.globalData.userInfo.avatarUrl;
          self.setData({
            seat_pic_urls: self.data.seat_pic_urls
          })
          self.add_player_info(app.globalData.userInfo.nickName, idx + 1, null, app.globalData.userInfo.avatarUrl)
        }else if (res.cancel) {
          console.log("单击取消")
        }
      }
    })


  },

  fillArray: function (value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
  },
})