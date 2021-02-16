// game.js
// 获取应用实例
var app = getApp()

Page({
  data: {
    room_id: null,
    is_host: false,
    seats: []
  },
  onLoad() {
    console.log(app.globalData)
    this.setData({
      seats: (Array.from(Array(12).keys()).map(i => {return i+1}))
    });
    this.setData({
      room_id: app.globalData.room_id,
      is_host: app.globalData.is_host
    })
  }
})