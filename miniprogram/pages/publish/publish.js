// miniprogram/pages/publish/publish.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classShade: 'hide',
    classChannelMenu: 'hide',
    channelList: [],
    tapFun: {},
    funList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.animation = wx.createAnimation({
      duration: 500
    })

    //获取 功能信息
    wx.showLoading({
      title: '加载中',
      mask :true
    })
   const db =  wx.cloud.database();
   var that =this;
    db.collection('function').get().then(res=>{
      that.setData({
        funList:res.data
      })
      wx.hideLoading()
    }).catch(err=>{
      wx.showModal({
        title: '加载异常',
        content: err
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  tapFun: function(event) { //功能被点击
    var fun = event.currentTarget.dataset.fun;
    
    if (fun.channel) {
      this.setData({
        channelList: fun.channel,
        classChannelMenu: '',
        classShade: '',
        tapFun: fun
      });
      return;
    }

    var param = 'fun_id=' + fun._id + '&fun_name=' + fun.fun_name;
    wx.navigateTo({
      url: '../editPublish/editPublish?' + param,
      fail: function (event) {
        console.log(event);
      }
    })

    



  },
  tapCancelChannel: function(event) { //取消按钮被点击
    this.setData({
      classShade: 'hide',
      classChannelMenu: 'hide',
      tapFun: {}
    })
  },
  tapChannel: function(event) { //频道 被点击了
    var channel = event.currentTarget.dataset.channel;
    var fun = this.data.tapFun;
    var param = 'fun_id=' + fun._id + '&fun_name=' + fun.fun_name + '&channel=' + channel;
    var url = '../editPublish/editPublish?' + param;
    console.log(url);
    wx.navigateTo({
      url: url
    })
  }
})