// miniprogram/pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classShade: 'hide',
    classChannelMenu: 'hide',
    channelList: [],
    tapFun:{},
    funList: [[{
      name: "招聘",
      id:1,
      image:"cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
      channel:[{
        name:"全职招聘",
        id:1
        },{
          name:"兼职招聘",
          id:2
        }]
    }, {
        name: "招聘",
        id: 1,
        image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
        channel: [{
          name: "全职",
          id: 1
        }, {
          name: "兼职",
          id: 2
        }]
    }, {
        name: "招聘",
        id: 1,
        image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
        channel: [{
          name: "全职",
          id: 1
        }]
    }, {
        name: "招聘",
        id: 1,
        image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
        channel: []
    }, {
        name: "招聘",
        id: 1,
        image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
        channel: [{
          name: "全职招聘",
          id: 1
        }, {
          name: "兼职招聘",
          id: 2
        }]
    }], [{
        name: "招聘",
        id: 1,
        image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
        channel: [{
          name: "全职招聘",
          id: 1
        }, {
          name: "兼职招聘",
          id: 2
        }]
    }, {
          name: "招聘",
          id: 1,
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
          channel: [{
            name: "全职招聘",
            id: 1
          }, {
            name: "兼职招聘",
            id: 2
          }]
    }, {
          name: "招聘",
          id: 1,
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
          channel: [{
            name: "全职招聘",
            id: 1
          }, {
            name: "兼职招聘",
            id: 2
          }]
    }, {
          name: "招聘",
          id: 1,
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
          channel: [{
            name: "全职招聘",
            id: 1
          }, {
            name: "兼职招聘",
            id: 2
          }]
    }, {
          name: "招聘",
          id: 1,
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
          channel: [{
            name: "全职招聘",
            id: 1
          }, {
            name: "兼职招聘",
            id: 2
          }]
    }]]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 500
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapFun: function(event){  //功能被点击
    var fun = event.currentTarget.dataset.fun;
    console.log(fun);
    var length = fun.channel.length;
    console.log(length);
    if(length==0){
      var param = 'fun_id=' + fun.id + '&fun_name=' + fun.name;
      wx.navigateTo({
        url: '../editPublish/editPublish?' + param,
        fail: function (event) {
          console.log(event);
        }
      })
      return;
    }
    this.setData({
      channelList: fun.channel,
      classChannelMenu:'',
      classShade: '',
      tapFun: fun
    });

   

  },
  tapCancelChannel:function(event){ //取消按钮被点击
    this.setData({
      classShade:'hide',
      classChannelMenu:'hide',
      tapFun:{}
    })
  },
  tapChannel: function(event){  //频道 被点击了
    var channel = event.currentTarget.dataset.channel;
    var fun = this.data.tapFun;
    var param = 'fun_id='+fun.id+'&fun_name='+fun.name+'&channel_id='+channel.id+'&channel_name='+channel.name;
    var url = '../editPublish/editPublish?'+param;
    console.log(url);
    wx.navigateTo({
      url: url
    })
  }
})