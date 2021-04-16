// game.js
// 获取应用实例
var app = getApp()

Page({
  data: {
    room_id: null,
    board_type: null,
    is_host: false,
    is_locked: false,
    seats: [],
    seat_names: [],
    seat_pic_urls: [],
    board_all: ['预女猎白', '预女猎白混', '石像鬼vs预女猎墓', '幽灵vs预女猎守', '先女猎白混', '梦魇vs预女猎守', '恶魔vs预女猎守','恶灵骑士vs预女猎守','机械狼vs预女猎守','隐狼vs预女猎鸦','大灰狼vs预女猎占','预女猎孩','预女猎守野', '黑狼王vs预女猎魔', '白狼王vs预女守骑', '咒狐'],
    role_details: [
      {
        "村民": 4, 
        "狼人": 4, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "白痴": 1
      },
      {
        "村民": 3, 
        "狼人": 4, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "白痴": 1,
        "混血儿": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "守墓人": 1,
        "石像鬼": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "守卫": 1,
        "鬼狼": 1
      },
      {
        "村民": 3, 
        "狼人": 4, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "白痴": 1,
        "混血儿": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "守卫": 1,
        "梦魇": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "守卫": 1,
        "恶魔": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "守卫": 1,
        "恶灵骑士": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "守卫": 1,
        "机械狼": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "乌鸦": 1,
        "隐狼": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "占卜师": 1,
        "大灰狼": 1
      },
      {
        "村民": 4, 
        "狼人": 4, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "小女孩": 1
      },
      {
        "村民": 3, 
        "狼人": 4, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "守卫": 1,
        "野孩子": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "魔术师": 1,
        "黑狼王": 1
      },
      {
        "村民": 4, 
        "狼人": 3, 
        "预言家": 1, 
        "女巫": 1, 
        "守卫": 1, 
        "骑士": 1,
        "白狼王": 1
      },
      {
        "村民": 3, 
        "狼人": 4, 
        "预言家": 1, 
        "女巫": 1, 
        "猎人": 1, 
        "守卫": 1,
        "咒狐": 1
      },

    ],
    seat_pic_urls: [],
    index: 0,
    period_index: 0,
    period_all: ['比赛前','警长竞选','第一天白天', '第二天白天', '第三天白天', '第四天白天', '第五天白天'],
    poll_index: 0,
    poll_all: ['比赛前','警长竞选','第一天白天', '第二天白天', '第三天白天', '第四天白天', '第五天白天'],
    poll_result: "烂柯游艺社\n北美最专业的狼人杀社团\n本社于2019年3月创立于哈佛大学，最初在波士顿地区举行线下活动。 烂柯的名字出自南朝梁任昉《述异记》：晋代王质观战棋弈，流连忘返，以至于斧子柄都烂掉了。 我们取名于此，希望本社的活动也能让大家沉浸推理与表演之中，忘万千于一瞬。\n",
    switch1Checked: false,
    current_roles: []
  },
  get_board_type (room_id){
    const db = wx.cloud.database();
    const werewolf_db = db.collection('werewolf-dev');
    var ans = null;
    werewolf_db.where({ _id: room_id.toString()}).get({
    }).then(res => {
      try{
        ans = res.data[0]["board"].toString();
      } catch (e){
        console.log("error fetching board type" + room_id.toString())
      }
      this.setData({
        board_type: ans,
      })
    })
  },
  onLoad() {
    console.log("back: " + app.globalData.is_back)
    this.setData({
      seats: (Array.from(Array(12).keys()).map(i => {return i+1})),
      seat_pic_urls: this.fillArray("/images/empty_seat.png", 12),
      seat_names: this.fillArray("", 12),
    });
    this.setData({
      room_id: app.globalData.room_id.toString(),
      is_host: app.globalData.is_host,
      is_locked: app.globalData.is_locked
    })
    if (app.globalData.is_back){
      this.load_basic_info()
      this.load_current_info()
    }else{
      this.update_current_info()
    }
    //this.update_basic_info()
    this.update_player_infos()
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.update_basic_info()
  },

  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      period_index: e.detail.value
    })
    this.update_current_info()
  },

  add_role_info(roomNum, wechat_name, role){
    const db = wx.cloud.database();
    const werewolf_db = db.collection(roomNum.toString());
    return werewolf_db.doc(wechat_name.toString()).update({
      data: {
        indentity: role.toString()
      }})
  },

  add_role_info_cloud(roomNum, name, seat_num, identity, image){
    return wx.cloud.callFunction({
      name: 'add_player_info',
      data: {
        roomNum: roomNum.toString(),
        name: name.toString(),
        seat_num: seat_num.toString(),
        identity: identity.toString(),
        image: image
      },
    })
  },

  update_role_info(wechat_name, role){
    const db = wx.cloud.database();
    const werewolf_db = db.collection(this.data.room_id.toString());
    return werewolf_db.doc(wechat_name.toString()).update({
      data: {
        identity: role.toString()
      }
    })
  },

  update_basic_info(){
    wx.cloud.callFunction({
      name: 'add_basic_info',
      data: {
        roomNum: this.data.room_id.toString(),
        god: app.globalData.userInfo.nickName.toString(),
        board: this.data.board_all[this.data.index]
      },
      complete: res => {
        console.log(res)
        console.log("upload basic_info complete!")
      },
    })
  },

  load_basic_info(){
    let self = this
    wx.cloud.callFunction({
      name: 'get_basic_info',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
        if(res.result.data.board){
          self.setData({
            index: this.data.board_all.indexOf(res.result.data.board)
          })
        }
      },
    })
  },

  load_current_info(){
    let self = this
    wx.cloud.callFunction({
      name: 'get_current_info',
      data: {
        roomNum: this.data.room_id
      },
      complete: res => {
        if(res.result.data.current_period){
          self.setData({
            period_index: this.data.period_all.indexOf(res.result.data.current_period),
            switch1Checked: res.result.data.vote_enabled
          })
        }
      },
    })
  },

  update_current_info(){
    wx.cloud.callFunction({
      name: 'set_current_info',
      data: {
        roomNum: this.data.room_id.toString(),
        current_period: this.data.period_all[this.data.period_index],
        locked: this.data.is_locked.toString(),
        vote_enabled: this.data.switch1Checked
      },
      complete: res => {
        console.log("upload current_info complete!")
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
          var role = arr[i]['identity']
          var image = arr[i]['image']
          if (role){
            this.data.seat_pic_urls[seat_num - 1] = "https://raw.githubusercontent.com/Ji-Hua/werewolf_assistant/master/app/static/character_logo/" + role + ".png"
          }else if (image){
            this.data.seat_pic_urls[seat_num - 1] = image
          }
          self.data.seat_names[seat_num - 1] = name
        }
        self.setData({
          seat_pic_urls: self.data.seat_pic_urls,
          seat_names: self.data.seat_names
        })
      },
    })
  },

  update_votes(){
    let self = this
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
        poll_results = "当前阶段：" + current_period + "\n" + poll_results
        self.setData({
          poll_result: poll_results
        })
      },
    })
  },

  refresh_all (){
    this.update_player_infos()
    wx.showToast({
      title: '刷新成功！',
      icon: 'success',
      duration: 1000
    })
  },

  

  distributeRoles() {
    var roles = this.data.role_details[this.data.index]
    var arr = []
    for (var key of Object.keys(roles)){
      arr = arr.concat(this.fillArray(key, roles[key]));
    }
    this.shuffleArray(arr)
    for (var i = 0; i < arr.length; i++) {
      var role = arr[i]
      this.data.seat_pic_urls[i] = "https://raw.githubusercontent.com/Ji-Hua/werewolf_assistant/master/app/static/character_logo//" + role + ".png"
    }
    this.setData({
      seat_pic_urls: this.data.seat_pic_urls
    })
    this.data.current_roles = arr
    
  },

  

  fillArray: function (value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
  },

  shuffleArray: function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
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
      text += array[i][0]
      text += "(" + array[i][2] + "票)"
      text += '\n'
    }
    return text
  },

  async upload_roles(arr){
    var funcs = []
    //var temp_names = ['尹秋阳','胡雨章','chen','xiaohe','华老板','周广宇','test']
    var temp_names = this.data.seat_names
    for (var i = 0; i < temp_names.length; i++){
      if (temp_names[i]){
        //funcs.push(this.add_role_info_cloud(this.data.room_id, 
        //  temp_names[i], i + 1, arr[i].toString()), this.data.seat_pic_urls[i])
        console.log(temp_names[i] + arr[i])
        funcs.push(this.update_role_info(temp_names[i], arr[i].toString()))
      }
    }
    for (var i = 0; i < funcs.length; i++){
      console.log(await funcs[i])
    }
  },
  lockRoles(){
    this.setData({
      is_locked: true
    })
    this.upload_roles(this.data.current_roles)
    this.update_current_info()
  },

  check_votes(){
    wx.showToast({
      title: '查看票型成功！',
    })
    this.update_votes()
  },

  switch1Change(e){
    this.setData({
      switch1Checked: e.detail.value
    })
    this.update_current_info()

    if (e.detail.value){
      wx.showToast({
        title: '投票开启成功',
        icon: 'success',
        duration: 1000
      })
    }else{
      wx.showToast({
        title: '投票关闭成功',
        icon: 'success',
        duration: 1000
      })
    }
  }
})

