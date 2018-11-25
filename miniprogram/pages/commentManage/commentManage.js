// miniprogram/pages/commentManage/commentManage.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    commentList: [],
    pageIndex: 0,
    pageSize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.openid){
      this.setData({
        openid:options.openid
      });
      this.loadComment();
    
    }
   
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pageIndex: 0,
      commentList: []
    })
    this.loadComment();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadComment();
  },
  loadComment: function() {
    wx.showLoading({
      title: '请稍后',
      mask: false
    });

    var that = this;
    db.collection('comment').where({
        _openid: that.data.openid
      }).orderBy('create_date', 'desc').skip(this.data.pageIndex)
      .limit(this.data.pageSize)
      .get().then(res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.length == 0) {
          wx.showToast({
            title: '没有数据了',
            icon: 'none'
          });
        } else {
          that.setData({
            commentList: that.data.commentList.concat(res.data),
            pageIndex: res.data.length + that.data.pageIndex
          });
        }
      }).catch(err => {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        wx.showModal({
          title: '服务器放假了呢',
          content: err.errMsg,

          showCancel: false
        })
      });
  },
  tapComment: function(event) {
    var comment = event.currentTarget.dataset.comment;
    console.log(comment);
    wx.navigateTo({
      url: '../contentDetail/contentDetail?_id='+comment.content_id,
    });
    
  },
  tapDel: function(event) {
    var index = event.currentTarget.dataset.index;
    var comment = event.currentTarget.dataset.comment;
    var contentid = comment.content_id;
    console.log('contnet_id--->' + contentid)
    wx.showLoading({
      title: '请稍后',
      mask: true
    });
    var that =this;
    db.collection("comment").doc(comment._id).remove()
      .then(res => {
        console.log(res);
        wx.hideLoading();
        if (res.stats.removed != 0) {
          that.data.commentList.splice(index, 1);
          that.setData({
            commentList: that.data.commentList
          });
          console.log('commentid--->'+comment.content_id);
          //更改 这个content 的 comment_num；
          db.collection('content').doc(contentid)
            .get().then(response => {
              console.log('res-->' + response);
              var content = response.data;
              console.log(content);
              var where = {
                _id: content._id
              };
              var data = {
                comment_num: content.comment_num - 1
              };
              wx.cloud.callFunction({
                name: 'update',
                data: {
                  collection: 'content',
                  where: where,
                  data: data
                }
              }).then(res => {
                console.log(res);
              })
            }).catch(err => {
              wx.showToast({
                title: err.message,
                icon: 'none'
              });
              console.log(err.errMsg);
            });


        } else {
          wx.showToast({
            title: '删除失败！',
            icon: 'fail'
          })
        }
      }).catch(err => {
        wx.hideLoading();
        console.log(err);
        wx.showModal({
          title: '服务器开小差了',
          content: err.errMsg,
          showCancel: false
        });
      });
  }
})