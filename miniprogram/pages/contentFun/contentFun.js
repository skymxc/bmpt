// miniprogram/pages/contentFun/contentFun.js
const app = getApp();
const db = wx.cloud.database();
const contentTools = require('../template/contentRecord/contentRecordTemplate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fun: {},
    channel: '',
    fun_id: '',
    pageIndex: 0,
    pageSize: 20,
    where: {},
    channelArray: [],
    contentList: [],
    selectIndex:0,
    emptyMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if(options.channel){
      this.setData({
        fun_id:options._id,
        channel:options.channel,
        where: {
          fun_id: options._id,
          channel_name:options.channel
        }
      });
    }else{
      this.setData({
        fun_id: options._id,
        where:{
          fun_id:options._id
        }
      });
    }
    this.loadFun();

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pageIndex: 0,
      contentList: [],
      channelArray:[]
    });
    this.loadFun();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadContent(false);
  },
  loadFun: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    db.collection('function').doc(this.data.fun_id).get()
      .then(res => {
        wx.hideLoading();
        var index = that.data.selectIndex;
        if(res.data.channel){
          that.data.channelArray= that.data.channelArray.concat(res.data.channel);
          that.data.channelArray.unshift('全部');
          
        }
        if(that.data.channel.length!=0){
          var size = that.data.channelArray.length;
          for (var i = 0; i < size; i++) {
            if (that.data.channelArray[i] == that.data.channel){
              index =i;
              break;
            }
          }
        }
        
        
        that.setData({
          fun: res.data,
          channelArray: that.data.channelArray,
          selectIndex:index
        });
        that.loadContent(true);

      }).catch(error => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        wx.showModal({
          title: '服务器调皮了',
          content: error.errMsg
        });
      });
  },
  loadContent: function(refresh) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    console.log(this.data.where);
    var that = this;
    db.collection('content').where(this.data.where).skip(this.data.pageIndex).limit(this.data.pageSize)
      .get().then(res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        var pageIndex = that.data.pageIndex + res.data.length;
        that.data.contentList = that.data.contentList.concat(res.data);
        // console.log('refresh=>'+refresh);
        // console.log(res.data);
        if(refresh){
          that.data.contentList= res.data;
        }
        console.log(that.data.contentList);
        that.setData({
          contentList: that.data.contentList,
          pageIndex: pageIndex
        });
        if (that.data.contentList.length == 0) {
          that.setData({
            emptyMsg: '当前频道下没有数据哦'
          })
        }else{
          that.setData({
            emptyMsg: ''
          })
        }
      }).catch(error => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        wx.showModal({
          title: '服务器又调皮了',
          content: error.errMsg,
        });
      });
  },
  tapTopChannel:function(event){
    var index=  event.currentTarget.dataset.index;
    var channel = event.currentTarget.dataset.channel;
    var where={
      fun_id :this.data.fun_id
    };
    if(index!=0){
      where={
        fun_id: this.data.fun_id,
        channel_name: channel
      };
    }
    this.setData({
      selectIndex:index,
      channel:channel,
      where:where,
      pageIndex:0
    });
    
   this.loadContent(true);
  },
  tapUser: function (event) { // 发布人被点击
    contentTools.tapUser(event);
  },
  tapContact: function (event) { //联系Ta
    contentTools.tapContact(event);

  },
  tapContent: function (event) { //内容记录被点击
    contentTools.tapContent(event);
  },
  /**
   * 去详情
   */
  toContentDetail: function (_id) {
    wx.navigateTo({
      url: '../contentDetail/contentDetail?_id=' + _id,
    })
  },
  tapZan: function (event) { // 赞被点击
    var record = event.currentTarget.dataset.record;
    var index = event.currentTarget.dataset.index;

    var that = this;

    wx.showLoading({
      title: '请稍后',
      mask: false
    });

    contentTools.tapZan(event)
      .then(res => {
        console.log(res);
        wx.hideLoading();
        that.data.contentList[index].agree_num = record.agree_num + 1;
        if (res.result.stats.updated != 0) {
          that.setData({
            contentList: that.data.contentList
          });
          contentTools.updateContentUserAgreeNum(record.user_id);
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




  },
  tapContentShare: function (event) { //分享被点击
    var record = event.currentTarget.dataset.record;
    console.log('share');
  },
  tapChannel: function (event) { //频道被点击
    var record = event.currentTarget.dataset.record;
    var fun_id = record.fun_id;
    var channel = record.channel_name;

    
  },
  tapRecordFunction: function (event) { //功能被点击
    var _id = event.currentTarget.dataset.fun;
   
  },
  /**
   * 图片被 点击 预览图片
   */
  tapImage: function (event) {
    contentTools.tapImage(event);
  },
  onShareAppMessage: function (event) {
    if (event.from == 'button') {
      console.log(event.target);
      var content = event.target.dataset.content;
     return contentTools.tapShare(content);
    }else{
      return {}
    }

  }
})