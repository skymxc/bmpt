// miniprogram/pages/userProfile/userProfile.js
const app = getApp();
const db = wx.cloud.database();
const contentTools = require('../template/contentRecord/contentRecordTemplate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    user: {},
    publishNum:0,
    totalBeReadNum:0,
    totalBeAgreeNum:0,
    pageIndex:0,
    pageSize:20,
    contentList:[],
    manager:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if(options.openid){
      this.setData({
        openid:options.openid,
        manager:options.openid==app.globalData.openid
      })
      this.loadProfile();
    }else{
      wx.showModal({
        title: '数据漂移了',
        content: '数据出去玩了，请稍后再来',
        showCancel: false,
        success: function (res) {
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
      pageIndex:0,
      pageSize:20,
      contentList:[]
    });
    this.loadProfile();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadContent();
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
    //获取 user 信息 然后再获取 content 内容
    db.collection('user').where({
      _openid: that.data.openid
    }).get().then(res=>{
      if(res.data.length==0){

        wx.hideLoading();
        wx.showModal({
          title: '数据漂移了',
          content: that.data.user.nickName+'出去玩了，请稍后再来',
          showCancel:false,
          success:function(res){
            if(res.confirm){
              wx.navigateBack({
                
              });
            }
          }
        })
      }else{
        var data = res.data[0];
        that.setData({
          publishNum: data.publishNum,
          totalBeReadNum: data.beAgreeNum,
          totalBeAgreeNum: data.beReadedNum,
          user:data.user
        });
        wx.hideLoading();
        that.loadContent();
      }
    }).catch(err=>{
      console.log(err);
      wx.hideLoading();
      wx.showModal({
        title: '数据漂移了',
        content: that.data.user.nickName + '出去玩了，请稍后再来',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({

            });
          }
        }
      })
    })

  },
  loadContent:function(){
    wx.showLoading({
      title: '加载中',
      mask:false
    });
    var that  = this;
      db.collection('content').where({
        _openid:that.data.openid
      }).skip(this.data.pageIndex).limit(this.data.pageSize).orderBy('create_date','desc').get()
      .then(res=>{
        wx.stopPullDownRefresh();
        wx.hideLoading();
          if(res.data.length==0){
            wx.showToast({
              title: '没有数据了',
              icon:'none'
            });
          }else{
            that.setData({
              contentList: that.data.contentList.concat(res.data),
              pageIndex:that.data.pageIndex+res.data.length
            });
          }
      }).catch(err=>{
          wx.showModal({
            title: '数据出去玩了',
            content: err.errMsg,
          })
      })
  },
  /**
   * 用户头像被点击
   */
  tapUser:function(){

  },
  tapContact:function(event){
    contentTools.tapContact(event);
  },
  tapRecordFunction:function(event){
    contentTools.tapRecordFunction(event);
  },
  tapChannel:function(event){
    contentTools.tapChannel(event);
  },
  tapContent: function (event){
    contentTools.tapContent(event);
  } ,
  tapImage:function(event){
    contentTools.tapImage(event);
  },
  tapDelContent:function(event){
    var index= event.currentTarget.dataset.index;
    var record = event.currentTarget.dataset.record;
    var that =this;
    wx.showLoading({
      title: '请稍后',
      mask:false
    });
    contentTools.tapDelContent(event,this.data.publishNum,this.data.totalBeAgreeNum,this.data.totalBeReadNum).then(res=>{
      console.log('删除很成功'+res);
      wx.hideLoading();
      that.data.contentList.splice(index,1);
      that.setData({
        contentList:that.data.contentList,
        publishNum: that.data.publishNum-1,
        totalBeAgreeNum: that.data.totalBeAgreeNum- record.agree_num,
        totalBeReadNum: that.data.totalBeReadNum - record.view_num
      });
    }).catch(err=>{
      console.log(err);
      wx.hideLoading();
    })
  },
  tapZan:function(event){
    var record = event.currentTarget.dataset.record;
    var index = event.currentTarget.dataset.index;

    var that = this;

    wx.showLoading({
      title: '请稍后',
      mask: false
    });

    contentTools.tapZan(event)
      .then(res => {
        wx.hideLoading();
        that.data.contentList[index].agree_num = record.agree_num + 1;
        if (res.result.stats.updated != 0) {
          that.setData({
            contentList: that.data.contentList
          });
        } else {
          wx.showToast({
            title: '操作超时',
            icon: 'none'
          });
        }

      }).catch(err => {
        console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      });
  }
})