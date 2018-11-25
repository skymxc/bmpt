// miniprogram/pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enable: false,
    user:{},
    avatarUrl:'',
    classGetUser:'hide'
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
    wx.showLoading({
      title: '获取用户信息',
      mask: true
    })
    var that = this;
    //todo  获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.hideLoading()
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                user: res.userInfo,
                classGetUser:'hide'
              })
              console.log(res)
            },
            fail:err=>{
              wx.hideLoading()
              wx.showToast({
                title: '用户信息获取失败',
              })
              that.setData({
                classGetUser: ''
              })
            }
          })
        }else{
          wx.hideLoading()
          that.setData({
            classGetUser:''
          })
        }
      }
      
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

  /**
   * 我的评论
   */
  tapComment: function() {
    wx.navigateTo({
      url: '../commentManage/commentManage?openid=' + app.globalData.openid,
    })

  },

  /**
   * 我的发布
   */
  tapPublish: function() {
    
    wx.navigateTo({
      url: '../userProfile/userProfile?openid='+app.globalData.openid,
    })
  },
  /**
   * 用户信息 获取回掉
   */
  onGetUserInfo: function(event){
   
    this.setData({
      classGetUser:'hide',
      avatarUrl: event.detail.userInfo.avatarUrl,
      userInfo:event.detail.userInfo
    })
    wx.hideLoading();
    console.log(event)
  }

})