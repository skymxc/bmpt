// miniprogram/pages/contentDetail/contentDetail.js
const app = getApp();
const contentTools = require('../template/contentRecord/contentRecordTemplate.js');
Page({

  /**
   * 页面的初始数据
   * 
   */
  data: {
    content: {},
    _id: '',
    commentList: [],
    pageIndex: 0,
    pageSize: 20,
    report: '',
    classReport: 'hide',
    classComment: 'hide',
    classCover: 'hide',
    commentPlaceHolder: '',
    focusWriteComment: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options._id) {
      this.setData({
        _id: options._id
      });
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pageIndex: 0
    })
    this.loadContent();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //todo  load more comment
    if (this.data.content.comment_num > 0) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      this.loadComment();
    }
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
        wx.stopPullDownRefresh();
        that.setData({
          content: res.data,
          commentPlaceHolder: '评论 ' + res.data.user.nickName
        });
        that.addReadNum();
        wx.hideLoading();
        if (that.data.content.comment_num > 0) {
          that.loadComment();
        }

      }).catch(err => {
        wx.stopPullDownRefresh();
        console.log(err);
        wx.hideLoading();
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
    console.log('load comment--' + this.data._id);
    var that = this;
    var db = wx.cloud.database();
    db.collection('comment').where({
      content_id: that.data._id
    }).orderBy('create_date', 'desc').skip(this.data.pageIndex).limit(this.data.pageSize).get().then(res => {
      console.log(res);
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        commentList: that.data.commentList.concat(res.data),
        pageIndex: that.data.pageIndex + res.data.length
      });
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '评论加载超时',
        icon: 'none'
      });
    });
  },
  /**
   * 举报
   */
  tapReport: function() {
    //显示遮罩层 和 举报原因输入框
    this.setData({
      classReport: '',
      classCover: ''
    });
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
    this.setData({
      classCover: '',
      classComment: '',
      focusWriteComment: true
    })
  },
  /**
   * 点赞
   */
  tapAgree: function() {

    wx.showLoading({
      title: '请稍后',
      mask: true
    });
    var that = this;

    this.incContentNum('agree_num').then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.result.stats.updated != 0) {
        that.data.content.agree_num = that.data.content.agree_num + 1;
        that.setData({
          content: that.data.content
        });
      } else {
        wx.showToast({
          title: '操作超时',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: err.errMsg,
        icon: 'none'
      })
    });

  },
  /**
   * 联系他
   */
  tapConcat: function() {
    var phone = this.data.content.phone;
    if (phone == '') {
      wx.showModal({
        title: '提示',
        content: '没有留联系方式',
        showCancel: false,
        success: function(res) {

        }
      });
      return;
    }

    wx.showModal({
      title: '温馨提示',
      content: '你将要拨打电话：' + phone,
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  },
  /**
   * 输入 举报内容
   */
  inputReport: function(event) {
    var value = event.detail.value;
    this.setData({
      report: value
    });
  },
  /**
   * 提交评论表单
   */
  submitComment: function(event) {
    var comment = event.detail.value.comment;
    if (comment.trim().length == 0) {
      wx.showToast({
        title: '请输入评论',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask: true
    });

    var that = this;
    var db = wx.cloud.database();
    const _ = db.command;
    var date = new Date();

    var record = {
      user: app.globalData.userInfo,
      content_id: that.data._id,
      create_date: date,
      create_date_str: date.toLocaleString(),
      text: comment
    };
    db.collection('comment').add({
      data: record
    }).then(res => {
      //更改记录
      that.incContentNum('comment_num').then(response => {
        wx.hideLoading();

        if (response.result.stats.updated > 0) {
          wx.showToast({
            title: '评论成功',
          });

          record._id = res._id;

          that.data.content.comment_num = that.data.commentList.unshift(record);
          that.setData({
            classCover: 'hide',
            classComment: 'hide',
            content: that.data.content,
            commentList: that.data.commentList,
            pageIndex: that.data.pageIndex + 1
          });

        } else {
          console.log(that.data._id + '更改失败了')
          wx.showModal({
            title: '评论失败',
            content: '评论内容不存在，可能已经被删除',
            showCancel: false
          });
        }
      }).catch(error => {
        wx.hideLoading();
        wx.showModal({
          title: '评论失败',
          content: error.errMsg,
          showCancel: false
        });
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showModal({
        title: '评论失败',
        content: err.errMsg,
        showCancel: false
      });
    });
  },
  /**
   * 提交举报表单
   */
  submitReport: function(event) {
    if (this.data.report == '') {
      wx.showToast({
        title: '请输入举报原因',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask: false
    });
    var record = {
      user: app.globalData.userInfo,
      contnet_id: this.data._id,
      deal: false,
      result: '未处理',
      content_user: this.data.content.user
    };
    var that = this;
    var db = wx.cloud.database();
    const _ = db.command;
    db.collection('report').add({
      data: record
    }).then(res => {
      that.incContentNum('report_num').then(res => {

        wx.hideLoading();
        wx.showToast({
          title: '举报成功',
        });
        that.setData({
          classReport: 'hide',
          classCover: 'hide'
        });
      }).catch(err => {
        console.log(err);
        wx.hideLoading()
        wx.showModal({
          title: '举报失败！',
          content: err.errMsg,
          success: function(res) {
            if (res.confirm) {

            } else if (res.cancel) {
              that.setData({
                classReport: 'hide',
                classCover: 'hide'
              });
            }
          }
        })
      })

    }).catch(err => {
      wx.hideLoading()
      wx.showModal({
        title: '举报失败！',
        content: err.errMsg,
        success: function(res) {
          if (res.confirm) {

          } else if (res.cancel) {
            that.setData({
              classReport: 'hide',
              classCover: 'hide'
            });
          }
        }
      })
    });
  },
  tapReportCancel: function() {
    this.setData({
      classReport: 'hide',
      classCover: 'hide'
    })
  },
  tapCommentCancel: function() {
    this.setData({
      classComment: 'hide',
      classCover: 'hide',
      focusWriteComment: false
    })
  },
  incContentNum: function(field) {
    var that = this;
    return wx.cloud.callFunction({
      name: 'numInc',
      data: {
        collection: 'content',
        _id: that.data._id,
        field: field
      }
    });
  },
  addReadNum:function(){
    contentTools.viewContentIncViewNum(this.data.content);
  }
})