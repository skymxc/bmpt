//index.js
const app = getApp();
const contentTools = require('../template/contentRecord/contentRecordTemplate.js');
/**
 * queryFoucs：搜索输入框 是否获取焦点
 * class_search：搜索输入框的 类名
 * class_search_label：搜索输入框没有获取到焦点时的 类名
 * queryInput：搜索输入框输入的文本


 * 
 * 
 */

/**
 * Page(object) 是一个函数 用来注册一个页面 ；接受一个 object 类型参数，其指定页面的初始数据、生命周期、事件处理函数等。
 *  object 属性：
 * data: 类型 Object 页面的初始数据
 */
Page({
  data: {
    classAuthorize: 'hide',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    class_search: '',
    class_search_label: '',
    queryInput: '',
    queryFoucs: false,
    contenTypeNewestPublish: 'selected-text',
    contentTypeNewestReply: '',
    contentTypeMostZan: '',
    contentTypeMostShare: '',
    contentTypeTopClass: 'search-blur',
    adList: [],
    funList: [],
    contentList: [],
    pageIndex: 0,
    pageSize: 20,
    orderBy: 'create_date'

  },

  onLoad: function(query) {

    var date = new Date();
   
    var that = this;
    wx.showLoading({
      title: '拉取授权信息',
    })
    wx.getSetting({
      success: res => {
        wx.hideLoading()
        var pass = res.authSetting['scope.userInfo']
        if (pass) { //已经授权过了
          that.setData({
            classAuthorize: 'hide'
          })
          wx.showLoading({
            title: '正在登陆',
            mask: true
          })
          wx.getUserInfo({ //获取用户信
            success: response => {

              that.setData({
                userInfo: response.userInfo
              })

              app.globalData.userInfo = response.userInfo;
              // console.log(app.globalData.userInfo);
              app.globalData.logged = true;
              wx.hideLoading()
              that.login()
            },
            fail: err => {
              wx.hideLoading()
              wx.showModal({
                title: '用户信息获取失败！',
                content: err,
                showCancel: false
              })
            }

          })

        } else { //没有授权
          that.setData({
            classAuthorize: ''
          })
        }
      }
    })
    //调用云函数 login 获取当前用户的 openid
    // wx.showLoading({
    //   title: '正在登录',
    //   mask: true
    // })


  },
  /**
   * 在拿到授权之后 去 登陆获取 open ID 再去 获取数据
   */
  login: function() {
    // 登陆 获取 openID
    var that = this;
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'login',
      data:{
        user: app.globalData.userInfo
      }
    }).then(res => {
     
      app.globalData.openid = res.result.openid
     //
      wx.hideLoading()
      // 获取数据
      that.getData();

      that.count();

     
    }).catch(err => {
      wx.hideLoading()
      console.log(err.errMsg);
      wx.showModal({
        title: '登陆失败！',
        content: err.errMsg,
      })
    })
  },

  /**
   * 登陆成功之后去 获取数据
   */
  getData: function() {

    const db = wx.cloud.database();
    var that = this;
    //获取广告
    db.collection('advertising').get().then(res => {
      that.setData({
        adList: res.data
      })
    })
    // 获取 功能区信息
    db.collection('function').get().then(res => {
      var funList = that.funConvert(res.data);
      that.setData({
        funList: funList
      })

    })

    this.loadContent();


  },
  loadContent: function() {
    const db = wx.cloud.database();
    var that = this;
    wx.showLoading({
      title: '加载数据',
      mask: false
    });
    // 获取 所有的 信息 按照 orderBy 排序
    db.collection('content').orderBy(this.data.orderBy, 'desc').skip(this.data.pageIndex).limit(this.data.pageSize).get().then(res => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        contentList: res.data,
        pageIndex: that.data.pageIndex + that.data.pageSize
      })

    }).catch(err => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showModal({
        title: '内容加载失败！',
        content: err,
        showCancel: false
      })
    })


  },
  onShow: function() {
    if (app.globalData.refresh) {
      app.globalData.refresh = false;
      this.setData({
        pageIndex: 0,
        orderBy: 'create_date'
      });

      this.loadContent();
    }
  },
  /**
   * 将在服务器获取的功能列表 转换为 页面渲染所需的 数组
   */
  funConvert: function(data) {
    var funList = []
    if (data.length <= 10) {
      var fun = {
        index: 0,
        data: data
      }
      funList[0] = fun
      return funList;
    }
    //渲染数组需要几个
    var num = Math.floor(data.length / 10); //下舍入 取整


    if (Math.floor(data.length / 10) != (data.length / 10)) { //如果 不是整数 那么 就需要再加一个
      num++
    }

    var index = 0;
    for (var i = 0; i < num; i++) {
      var tempData = []
      for (var k = 0; k < 10; k++) {
        if (index < data.length) {
          tempData[k] = data[index]
        } else {
          break
        }
        index++

      }
      var fun = {
        index: i,
        data: tempData
      }
      funList[i] = fun;
    }
    return funList
  },
  /**
   * 在用户授权之后 会自动回掉 此方法
   */
  onGetUserInfo: function(e) {
    console.log(e);
    this.setData({
      logged: true,
      avatarUrl: e.detail.userInfo.avatarUrl,
      userInfo: e.detail.userInfo,
      classAuthorize: 'hide'
    });
    app.globalData.userInfo = e.detail.userInfo;
    app.globalData.logged = true;
    this.login();

  },

  onPullDownRefresh: function() { //触发 刷新事件
    this.setData({
      pageIndex: 0
    });
    this.loadContent();

  },
  onReachBottom: function(obj) { //拉到底部了，触发了 加载更多事件
    const db = wx.cloud.database();
    var that = this;
    wx.showLoading({
      title: '加载数据',
      mask: false
    });
    // 获取 所有的 信息 按照 orderBy 排序
    db.collection('content').orderBy(this.data.orderBy, 'desc').skip(this.data.pageIndex).limit(this.data.pageSize).get().then(res => {
      wx.hideLoading();
      that.setData({
        contentList: that.data.contentList.concat(res.data),
        pageIndex: that.data.pageIndex + that.data.pageSize
      })

    }).catch(err => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showModal({
        title: '内容加载失败！',
        content: err,
        showCancel: false
      })
    })
  },
  onPageScroll: function(obj) { //页面滑动事件
    var distance = 460
    if (this.data.adList.length == 0) { //广告模块
      distance -= 150
    }
    if (this.data.funList.length == 0) { //功能模块
      distance -= 200
    }
    var temp = this.data.contentTypeTopClass;
    if (obj.scrollTop >= distance) {
      temp = '';
    } else {
      temp = 'search-blur';
    }
    this.setData({
      contentTypeTopClass: temp
    });
  },
  inputQuery: function(event) { // 搜索输入框 输入事件 被动调用
    this.setData({
      queryInput: event.detail.value
    })


  },
  queryBlur: function(e) { // 搜索输入框失去焦点事件 被动 调用
    this.setData({
      queryInput: e.detail.value
    })
  },
  showSearch: function(event) { //显示搜索输入框

    this.setData({
      class_search: 'search-focus',
      class_search_label: 'search-blur',
      queryFocus: true
    });
  },
  hideSearch: function(event) { //隐藏搜索输入框

    this.setData({
      class_search: '',
      class_search_label: '',
      queryFoucs: false,
      queryInput: ''
    })


  },

  query: function(event) { //搜索
   
    var input= this.data.queryInput;
    if(input.length==0){
      wx.showToast({
        title: '请输入要搜索的内容',
        icon:'none'
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask:true
    });
    var that =this;
    var db = wx.cloud.database();
    
    // input = '/'+input+'/';

    console.log(input);
    db.collection('content').where({
      content: input
    }).skip(0).limit(that.data.pageSize).get().then(res=>{
      wx.hideLoading();
      console.log(res.data);
      if(res.data.length==0){
        wx.showToast({
          title: '没有查询到内容',
          icon:'none'
        });
        return;
      }
      that.setData({
        contentList:res.data
      });

    }).catch(err=>{
      console.log(err);
      wx.hideLoading();
      wx.showModal({
        title: '没有查询到内容',
        content: '',
      })
    })

  },
  bindADChange: function(event) {

  },
  bindADTap: function(event) {
    var obj = event.currentTarget.dataset.obj;

    wx.showToast({
      title: obj.name,
    })
  },
  bindChannelTap(event) {
    var channel = event.currentTarget.dataset.fun;
    //  navigation to fun detial list
    wx.showToast({
      title: channel.fun_name,
    })

  },
  bindTypeTap: function(event) {
    var tap = event.currentTarget.dataset.type;
    this.setData({
      orderBy: tap
    });
    wx.startPullDownRefresh({

    });
    var name = "最新发布"
    switch (tap) {
      case 'create_date':
        name = "最新发布";
        this.setData({
          contenTypeNewestPublish: 'selected-text',
          contentTypeNewestReply: '',
          contentTypeMostZan: '',
          contentTypeMostShare: '',
        });
        break;
      case 'view_num':
        name = '最新回复';
        this.setData({
          contenTypeNewestPublish: '',
          contentTypeNewestReply: 'selected-text',
          contentTypeMostZan: '',
          contentTypeMostShare: '',
        });
        break;
      case 'agree_num':
        name = '最多点赞';
        this.setData({
          contenTypeNewestPublish: '',
          contentTypeNewestReply: '',
          contentTypeMostZan: 'selected-text',
          contentTypeMostShare: '',
        });
        break;
      case 'share_num':
        name = '最多分享';
        this.setData({
          contenTypeNewestPublish: '',
          contentTypeNewestReply: '',
          contentTypeMostZan: '',
          contentTypeMostShare: 'selected-text',
        });
        break;
    }
    console.log(name);
  },
  tapUser: function(event) { // 发布人被点击
    contentTools.tapUser(event);
  },
  tapContact: function(event) { //联系Ta
    contentTools.tapContact(event);

  },
  tapContent: function(event) { //内容记录被点击
    contentTools.tapContent(event);
  },
  /**
   * 去详情
   */
  toContentDetail: function(_id) {
    wx.navigateTo({
      url: '../contentDetail/contentDetail?_id=' + _id,
    })
  },
  tapZan: function(event) { // 赞被点击
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



    
  },
  tapContentShare: function(event) { //分享被点击
    var record = event.currentTarget.dataset.record;
    console.log('share');
  },
  tapChannel: function(event) { //频道被点击
    contentTools.tapChannel(event);
  },
  tapRecordFunction: function(event) { //功能被点击
    contentTools.tapRecordFunction(event);
  },
  /**
   * 图片被 点击 预览图片
   */
  tapImage: function(event) {
    contentTools.tapImage(event);
  },
  onShareAppMessage: function(event) {
    if (event.from == 'button') {
      console.log(event.target);
    }

  },
  count:function(){
    var db = wx.cloud.database();
    var that = this;
    db.collection('user').where({
      _openid:app.globalData.openid
    }).count().then(res => {
      if (res.total == 0) {
        that.addUser();
      } else {
        that.updateUser();
      }
    }).catch(err => {
      console.log(err);
      that.addUser();
    });

  },
  /**
   * 
   */
  addUser:function(){
    var db = wx.cloud.database();
    var user = {  
      user: app.globalData.userInfo,
      publishNum: 0,
      beReadedNum: 0,
      beAgreeNum: 0,
      beReportNum: 0
    };
    db.collection('user').add({
      data:user
    }).then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  },
  updateUser:function(){
    // should be update userInfo;
  }
})