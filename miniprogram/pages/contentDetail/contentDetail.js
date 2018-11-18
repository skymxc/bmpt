// miniprogram/pages/contentDetail/contentDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {},
    _id: 'W-L_o9x_Lia3NQWg',
    commentList: [],
    pageIndex: 0,
    pageSize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (this.data._id) {
      // this.setData({
      //   _id:options._id
      // });
      this.loadContent();
    } else {
      wx.showModal({
        title: '_id 错误！',
        content: '内容获取失败了',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({

            });
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    return {};
  },
  loadContent: function() {
    wx.showLoading({
      title: '加载中',
      mask: false
    });

    var db = wx.cloud.database();
    var that = this;
    db.collection('content').doc(this.data._id)
      .get().then(res => {
        that.setData({
          content: res.data
        });
        wx.hideLoading();
        if (that.data.content.comment_num > 0) {
          that.loadComment();
        }

      }).catch(err => {
        console.log(err);
        wx.showModal({
          title: '网路超时',
          content: err.errMsg,
          showCancel: false,
          success: function(res) {
            wx.navigateBack({

            });
          }
        })
      });
  },
  /**
   * 加载评论
   */
  loadComment: function() {
    var that = this;
    var db = wx.cloud.database();
    db.collection('comment').orderBy('create_date', 'desc').skip(this.data.pageIndex).limit(this.data.pageSize).get({
      content_Id: that.data._id
    }).then(res => {

      that.setData({
        commentList: res.data,
        pageIndex: that.data.pageIndex + res.data.length
      });
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '评论加载超时',
      });
    });
  },
  /**
   * 举报
   */
  tapReport: function() {
      
  },
  /**
   * 用户
   */
  tapUser: function() {

  },
  /**
   * 点击图片
   */
  tapImage: function(event) {
    console.log(event);
    var image = event.target.dataset.image;
    wx.previewImage({
      urls: this.data.content.images,
      current: image
    })
  },
  /**
   * 首页
   */
  tapHome: function() {
    wx.navigateBack({

    });
  },
  /**
   * 评论
   */
  tapComment: function() {

  },
  /**
   * 点赞
   */
  tapAgree: function() {

    wx.showLoading({
      title: '请稍后',
      mask: false
    });
    var that = this;
    var db = wx.cloud.database();
    const _ = db.command;
    console.log(this.data._id);
    db.collection('content').doc(this.data._id).get().then(res=>{
        console.log(res);
    }).catch(err=>{
        console.log(err);
    });
    db.collection('content').doc(this.data._id).update({
      data: {
        agree_num : _.inc(1)
      },
      success: function(res) {
          console.log(res);
        wx.hideLoading();
        if (res.stats.updated != 0) {
          that.data.content.agree_num = that.data.content.agree_num + 1;
          that.setData({
            content: that.data.content
          });
        }else{
          wx.showToast({
            title: '操作超时',
            icon:'none'
          });
        }

      },
      fail: function(err) {
        wx.hideLoading();
       wx.showToast({
         title: err.errMsg,
         icon:'none'
       })
      }
    });
  },
  /**
   * 联系他
   */
  tapConcat:function(){
    var phone = this.data.content.phone;
    if(phone==''){
      wx.showModal({
        title: '提示',
        content: '没有留联系方式',
        showCancel:false,
        success:function(res){
          
        }
      });
      return;
    }

    wx.showModal({
      title: '温馨提示',
      content: '你将要拨打电话：' + phone,
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  }
})