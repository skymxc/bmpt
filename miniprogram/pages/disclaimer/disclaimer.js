// miniprogram/pages/disclaimer/disclaimer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDisclaimer();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
      this.loadDisclaimer();
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
  tapRead:function(event){
    wx.navigateBack({
      
    })
  },
  loadDisclaimer:function(){
    wx.showLoading({
      title: '正在加载',
      mask:false
    })
    var that = this;
   const db = wx.cloud.database();
    db.collection('config')
    .where({
      name:'disclaimer'
    }).get().then(res=>{
      console.log(res);
      var content = res.data[0].content;
      that.setData({
        content: content
      })
      wx.hideLoading();
      
    }).catch(err=>{
      wx.hideLoading();
      wx.showModal({
        title: '加载异常',
        content: err.message,
        showCancel:false,
        success:function(res){
          if(res.confirm){
            wx.navigateBack({
              
            })
          }
        }
      })
    });
    
  }
})