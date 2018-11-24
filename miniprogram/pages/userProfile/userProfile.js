// miniprogram/pages/userProfile/userProfile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: 'obawr5CAOa1hPgkNAlYEv5ymmfkA',
    user: {
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJjUlpicxYn2HHMzIB5fgbukiatZiaDG5QjkvsfaS7PVnibfmbcO5squuMiaQUoKyOOwIO0CG87a6oBrbQ/132',
      country: 'China',
      gender: 1,
      language: 'zh_CN',
      nickName: '孟祥超',
      province: 'Beijing'
    },
    publishNum:0,
    readNum:0,
    agreeNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 加载这个人发表情况信息
   */
  loadProfile: function() {
    wx.showLoading({
      title: '加载中',
      mask: false
    });
    var that = this;
    var db = wx.cloud.database();
    db.collection('content').where({
      _openid: that.data.openid
    }).count().then(res => {
      wx.hideLoading();
      that.setData({
        publishNum:res.total
      });
    }).catch(error => {
      wx.hideLoading();
      wx.showModal({
        title: '网络超时',
        content: error.errMsg,
      })
    });
    //目前没有 sum 这个 pai 所以考虑增加一个 user 集合

  }
})