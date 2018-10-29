// miniprogram/pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classShade: 'hide',
    classChannelMenu: '',
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
  tapFun: function(event){
    var fun = event.currentTarget.dataset.fun;
    console.log(fun);
   
    this.animation.translateY(-200).step();
    this.setData({
      classShade: '',
      animation: this.animation.export()
    })

  },
  tapCancelChannel:function(event){
    console.log(event);
    this.animation.translateY(200).step();
    this.setData({
      classShade:'hide',
      animation: this.animation.export()
    })
  }
})