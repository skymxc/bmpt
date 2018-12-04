//app.js

// App(Object) 是一个函数 ；用来注册一个小程序；接受一个 object 参数；
// 这个函数的 Object 参数有几个系统规定的生命周期属性：onLaunch , onShow,onHide,onError,onPageNotFound; 这几个属性都是 函数类型的 ；下面是实例代码
// 我们还可以自己添加 属性； 
App({
  onLaunch: function(options) {
    console.log('onLaunch  sence - >');
    // 初始化云能力 traceUser:true 记录用户
    if (!wx.cloud) {
      console.log('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'test-1e9ad8'
      })
    }

    this.globalData = {}
  },
  onShow: function(options) {
    // console.log('onShow into foreground .');
  },
  onHide: function(options) {
    // console.log('onHide into background ');
  },
  onError: function(error) {
    // console.log('onError occur error :'+error);
  },
  onPageNotFound: function(options) {
    wx.showToast({
      title: '页面去旅游了，还没有回来',
    })
  },
  formatDate: function (fmt, date) { //author: meizz   
    var o = {
      "M+": date.getMonth() + 1, //月份   
      "d+": date.getDate(), //日   
      "h+": date.getHours(), //小时   
      "m+": date.getMinutes(), //分   
      "s+": date.getSeconds(), //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  countUser: function () {
    console.log('count user')
    var db = wx.cloud.database();
    var that = this;
    db.collection('user').where({
      _openid:this.globalData.openid
    }).get().then(res => {

      if (res.data.length == 0) {
        that.addUser();
      } else {
        that.updateUser(res.data[0]);
      }
    }).catch(err => {
      console.log(err);
      that.addUser();
    });

  },
  /**
   * 
   */
  addUser: function () {
    console.log('add user')
    var db = wx.cloud.database();
    var user = {
      user: this.globalData.userInfo,
      publishNum: 0,
      beReadedNum: 0,
      beAgreeNum: 0,
      beReportNum: 0
    };
    db.collection('user').add({
      data: user
    }).then(res => {
      console.log(res);
      this.globalData._id = res._id;
    }).catch(err => {
      console.log(err);
    })
  },
  updateUser: function (user) {
    
    console.log(user);
    this.globalData._id = user._id;
    this.globalData.user = user;
    var db = wx.cloud.database();
    db.collection('user').doc(user._id).update({
      data: {
        user: this.globalData.userInfo
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err)
    })
  }
})