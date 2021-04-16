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
    seated: false,
    seat_num: null,
    period: null,
    poll_result: "烂柯游艺社\n北美最专业的狼人杀社团\n本社于2019年3月创立于哈佛大学，最初在波士顿地区举行线下活动。 烂柯的名字出自南朝梁任昉《述异记》：晋代王质观战棋弈，流连忘返，以至于斧子柄都烂掉了。 我们取名于此，希望本社的活动也能让大家沉浸推理与表演之中，忘万千于一瞬。\n",
    is_locked: false,
    toll_index: 0,
    toll_all: ['弃票','1','2','3','4','5','6','7','8','9','10','11','12'],
    period_all: ['当前','比赛前','警长竞选','第一天白天', '第二天白天', '第三天白天', '第四天白天', '第五天白天'],
    period_index: 0,
    src: null
    //"https://werewolf-assistant.herokuapp.com/static/character_logo/狼人.png"
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

  update_period_info(){
    let self = this
    wx.cloud.callFunction({
      name: 'get_current_info',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
        self.setData({
          period: res.result.data.current_period,
          is_locked: res.result.data.locked == "true"
        })
      },
    })
  },

  update_identity_info(){
    let self = this
    wx.cloud.callFunction({
      name: 'get_current_info',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
        self.setData({
          period: res.result.data.current_period,
          is_locked: res.result.data.locked == "true"
        })
        console.log(self.data.is_locked)
        wx.cloud.callFunction({
          name: 'get_player_info',
          data: {
            roomNum: this.data.room_id,
            name: app.globalData.userInfo.nickName.toString()
          },
          complete: res => {
            try{
              if (res.result.data.identity && self.data.is_locked){
                self.setData({
                  identity: res.result.data.identity,
                  src: "https://raw.githubusercontent.com/Ji-Hua/werewolf_assistant/master/app/static/character_logo/" + res.result.data.identity+".png"
                })
              }else{
                self.setData({
                  identity: "未分发",
                  src: "../../images/logo.png"
                })
              }
              self.setData({
                seat_num: res.result.data.seat_num
              })
              if (this.data.seat_num != null){
                self.setData({
                  seated: true
                })
              }
            }catch (e){
              console.log(e)
            }
          },
        })
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
    wx.showToast({
      title: '刷新成功！',
      icon: 'success',
      duration: 1000
    })
    this.update_basic_info()
    //this.update_period_info()
    this.update_identity_info()
    this.update_player_infos()
  },

  update_votes(){
    let self = this
    if (this.data.period_all[this.data.period_index] == '当前'){
      wx.cloud.callFunction({
        name: 'get_current_info',
        data: {
          roomNum: this.data.room_id
        },
        complete: res => {
          console.log(res)
          self.setData({
            period: res.result.data.current_period
          })
          this.data.period = res.result.data.current_period
          var current_period = this.data.period
          wx.cloud.callFunction({
            name: 'get_votes',
            data: {
              roomNum: this.data.room_id,
              period: current_period
            },
            complete: res => {
              let arr = res.result.data
              var votes_count = {}
              for (var i = 0; i < arr.length; i++) {
                var from = arr[i]['from']
                var to = arr[i]['to']
                if(!(to in votes_count)){
                  votes_count[to] = [from]
                }else{
                  votes_count[to].push(from)
                }
              }
              var sorted_votes = self.sort_poll(votes_count)
              var poll_results = self.poll_to_text(sorted_votes)
              poll_results = "当前阶段：" + current_period + "\n" + poll_results
              self.setData({
                poll_result: poll_results
              })
            },
          })
        },
      })
    }else{
      var current_period = this.data.period_all[this.data.period_index]
      wx.cloud.callFunction({
        name: 'get_votes',
        data: {
          roomNum: this.data.room_id,
          period: current_period
        },
        complete: res => {
          let arr = res.result.data
          var votes_count = {}
          for (var i = 0; i < arr.length; i++) {
            var from = arr[i]['from']
            var to = arr[i]['to']
            if(!(to in votes_count)){
              votes_count[to] = [from]
            }else{
              votes_count[to].push(from)
            }
          }
          var sorted_votes = self.sort_poll(votes_count)
          var poll_results = self.poll_to_text(sorted_votes)
          poll_results = "阶段：" + current_period + "\n" + poll_results
          self.setData({
            poll_result: poll_results
          })
        },
      })
    }
  },

  sort_poll: function(maxSpeed){
    //https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
    var sortable = [];
    for (var vehicle in maxSpeed) {
        maxSpeed[vehicle].sort(function(a, b){
          return parseInt(a) - parseInt(b);
        })
        sortable.push([vehicle, maxSpeed[vehicle], maxSpeed[vehicle].length]);
    }
    sortable.sort(function(a, b) {
      return b[2] - a[2];
    });
    return sortable
  },

  poll_to_text: function(array){
    var text = ""
    for(var i = 0; i< array.length; i++){
      var new_arr = array[i][1]
      for (var j = 0; j < new_arr.length; j ++){
        text += new_arr[j]
        if (j != new_arr.length - 1){
          text += ","
        }
      }
      text += "\t=>\t"
      text += array[i][0] + "\t"
      text += "(" + array[i][2] + "票)"
      text += '\n'
    }
    return text
  },

  check_votes(){
    wx.showToast({
      title: '查看票型成功！',
      icon: 'success',
      duration: 1000
    })
    this.update_votes()
  },

  sit_down(e){
    if (this.data.seated){
      return
    }

    let idx = e.currentTarget.dataset.idx
    let self = this

    /*
    if (this.data.seat_names[idx] != ''){
      console.log("不能坐下！")
      return
    }*/

    const db = wx.cloud.database();
    const werewolf_db = db.collection(this.data.room_id.toString());

    wx.showModal({
      title: '提示',
      content: '将在' + (idx + 1) + "位置坐下，一旦坐下不能站起，是否继续？" ,
      success (res) {
        if (res.confirm) {
          werewolf_db.where({
            seat_num: (idx + 1).toString()
          }).get({
            success: function(res) {
              console.log(res)
              if (res.data.length >= 1){
                wx.showToast({
                  title: res.data[0]['_id'] + "已经坐下了！坐下失败",
                  icon: "warn"
                })
                return
              }else{
                self.data.seated = true
                self.data.seat_pic_urls[idx] = app.globalData.userInfo.avatarUrl;
                self.setData({
                  seat_pic_urls: self.data.seat_pic_urls
                })
                self.add_player_info(app.globalData.userInfo.nickName, idx + 1, null, app.globalData.userInfo.avatarUrl)

              }
            }
          })
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

  formSubmit(e){
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var value = this.data.toll_all[this.data.toll_index]
    /*
    var int_value = parseInt(value)
    console.log(int_value)
    if (int_value >12 || int_value < -1 || !int_value){
      wx.showToast({
        title: '只允许输入1-12！（弃票请投-1）',
        icon: "warn",
        duration: 1000
      })
      return
    }*/
    let self = this
    if (this.data.seat_num == null){
      wx.showToast({
        title: '你还没有坐下，不能投票！',
        icon: 'warn'
      })
      return
    }
    wx.cloud.callFunction({
      name: 'get_current_info',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
        console.log(res)
        self.setData({
          period: res.result.data.current_period
        })
        this.data.period = res.result.data.current_period
        var current_period = this.data.period
        var enabled = res.result.data.vote_enabled
        if (enabled){
          wx.showModal({
            title: "提示",
            content: "将要在" + current_period + "阶段投票给" + value + "，是否继续？",
            success (res){
              if (res.confirm){
                wx.cloud.callFunction({
                  name: 'add_votes',
                  data: {
                    roomNum: self.data.room_id,
                    period: current_period,
                    from: self.data.seat_num,
                    to: value
                  },
                  complete: res => {
                    wx.showToast({
                      title: '投票成功！',
                    })
                  }
                })
              }else if (res.cancel){
              }
            }
          })
        }else{
          wx.showToast({
            title: '投票关闭了！',
            icon: "warn",
            duration: 1000
          })
        }
      }
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      toll_index: e.detail.value
    })
  },

  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      period_index: e.detail.value
    })
  },

})