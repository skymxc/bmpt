//index.js
const app = getApp()

/**
 * queryFoucs：搜索输入框 是否获取焦点
 * class_search：搜索输入框的 类名
 * class_search_label：搜索输入框没有获取到焦点时的 类名
 * queryInput：搜索输入框输入的文本
 * 
 * 广告实体 
 * adList:[{
 * image:"",
 * obj:{}
 * },{
 * image:"",
 * obj:{}
 * }
 * ]
 * 
 * 频道结构
 * channelList:[{
 *  order:1,
 *  row:[{
 *    id:1,
 *    name:"招聘",
 *    image:"cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
 *    child:['兼职','全职']
 *    },{
 *     id:2,
 *    name:"二手",
 *    image:"cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
 *    child:['汽车','电脑']
 *    }]
 *  },{
 *  order:1,
 *  row:[{
 *    id:1,
 *    name:"招聘",
 *    image:"cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
 *    child:['兼职','全职']
 *    },{
 *     id:2,
 *    name:"二手",
 *    image:"cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
 *    child:['汽车','电脑']
 *    }]
 *  }
 * ]
 * 
 * channel:{
 *  image:"",
 *  name:"",
 *  id :1
 *  child:[]
 * }
 * 
 * //内容记录 结构
 * 
  record{
   recordID:1,
   person:{

   },
   images:[
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jp'
   ],
   content:'从广义上讲：
数据结构是指一组数据的存储结构。
算法就是操作数据的一组方法。

数据结构和算法是相辅相成的，数据结构是为算法服务的，算法要作用在特定的数据结构上。

数据结构是静态的，它只是组织数据的一种方式。',
   channel:{
      name: '二级分类',
      id: 1
   },
   function:{
     name: '所属功能',
     id : 2
   }，
   sawNumber: 90,
   commentNumber: 200,
   zanNumber: 20,
   shareNumber: 30 
 }
 */

/**
 * Page(object) 是一个函数 用来注册一个页面 ；接受一个 object 类型参数，其指定页面的初始数据、生命周期、事件处理函数等。
 *  object 属性：
 * data: 类型 Object 页面的初始数据
 */
Page({
  data: {
    avatarUrl: './user-unlogin.png',
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
    adList: [{
      image: "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
      obj: {
        name: "143912755726"
      }
    }, {
      image: "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",
      obj: {
        name: "175866434296"
      }
    }, {
      image: "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
      obj: {
        name: "175833047715"
      }
    }],
    channelList: [{
      order: 1,
      row: [{
        rowID: 1,
        channel: [{
          id: 1,
          name: "招聘",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
          child: ['兼职', '全职']
        }, {
          id: 2,
          name: "二手",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
          child: ['汽车', '电脑']
        }, {
          id: 2,
          name: "房屋",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/fangwu.png",
          child: ['汽车', '电脑']
        }, {
          id: 2,
          name: "教育",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/jiaoyu.png",
          child: ['汽车', '电脑']
        }, {
          id: 2,
          name: "美食",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/meishi.png",
          child: ['汽车', '电脑']
        }]
      }, {
        rowID: 2,
        channel: [{
          id: 1,
          name: "装修",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhuangxiu.png",
          child: ['兼职', '全职']
        }, {
          id: 2,
          name: "娱乐",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/yule.png",
          child: ['汽车', '电脑']
        }, {
          id: 2,
          name: "综合",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zonghe.png",
          child: ['汽车', '电脑']
        }, {
          id: 2,
          name: "家政",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/jiazheng.png",
          child: ['汽车', '电脑']
        }, {
          id: 2,
          name: "招商",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaoshang.png",
          child: ['汽车', '电脑']
        }]
      }]


    }],
    recordList: [{
        recordID: 1,
        person: {
          image: 'cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaoshang.png',
          name: 'mxc',
          phone: '13029248923'
        },
        images: [
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
        ],
        content: '从广义上讲 数据结构是指一组数据的存储结构。算法就是操作数据的一组方法。数据结构和算法是相辅相成的，数据结构是为算法服务的，算法要作用在特定的数据结构上。数据结构是静态的，它只是组织数据的一种方式',
        channel: {
          name: '二级分类',
          id: 1
        },
        function: {
          name: '所属功能',
          id: 2
        },
        sawNumber: 90,
        commentNumber: 200,
        zanNumber: 20,
        shareNumber: 30,
        publishTime: '2018/09/12 12:09'
    }, {
        recordID: 2,
        person: {
          image: 'cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaoshang.png',
          name: 'mxc',
          phone:'13813801380'
        },
        images: [
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        content: '从狭义上讲 数据结构是指一组数据的存储结构。算法就是操作数据的一组方法。数据结构和算法是相辅相成的，数据结构是为算法服务的，算法要作用在特定的数据结构上。数据结构是静态的，它只是组织数据的一种方式。',
        channel: {
          name: '二级分类',
          id: 1
        },
        function: {
          name: '所属功能',
          id: 2
        },
        sawNumber: 90,
        commentNumber: 200,
        zanNumber: 20,
        shareNumber: 30,
        publishTime: '2018/09/12 12:09'
      }, {
        recordID: 3,
        person: {
          image: 'cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaoshang.png',
          name: 'mxc',
          phone: '13813801380'
        },
        images: [
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
        ],
        content: '数据结构和算法是相辅相成的，数据结构是为算法服务的，算法要作用在特定的数据结构上。数据结构是静态的，它只是组织数据的一种方式。',
        channel: {
          name: '二级分类',
          id: -1
        },
        function: {
          name: '所属功能',
          id: 2
        },
        sawNumber: 90,
        commentNumber: 200,
        zanNumber: 20,
        shareNumber: 30,
        publishTime: '2018/09/12 12:09'
      }
    ]
  },

  onLoad: function() {
      console.log(getCurrentPages());
      console.log('------')
    

    // 获取用户信息
    
  },

  onGetUserInfo: function(e) {
    // if (!this.logged && e.detail.userInfo) {
    //   this.setData({
    //     logged: true,
    //     avatarUrl: e.detail.userInfo.avatarUrl,
    //     userInfo: e.detail.userInfo
    //   })
    // }
  },

  onGetOpenid: function() {
    // 调用云函数
    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {},
    //   success: res => {
    //     console.log('[云函数] [login] user openid: ', res.result.openid)
    //     app.globalData.openid = res.result.openid
    //     wx.navigateTo({
    //       url: '../userConsole/userConsole',
    //     })
    //   },
    //   fail: err => {
    //     console.error('[云函数] [login] 调用失败', err)
    //     wx.navigateTo({
    //       url: '../deployFunctions/deployFunctions',
    //     })
    //   }
    // })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['compressed'],
    //   sourceType: ['album', 'camera'],
    //   success: function (res) {

    //     wx.showLoading({
    //       title: '上传中',
    //     })

    //     const filePath = res.tempFilePaths[0]

    //     // 上传图片
    //     const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
    //     wx.cloud.uploadFile({
    //       cloudPath,
    //       filePath,
    //       success: res => {
    //         console.log('[上传文件] 成功：', res)

    //         app.globalData.fileID = res.fileID
    //         app.globalData.cloudPath = cloudPath
    //         app.globalData.imagePath = filePath

    //         wx.navigateTo({
    //           url: '../storageConsole/storageConsole'
    //         })
    //       },
    //       fail: e => {
    //         console.error('[上传文件] 失败：', e)
    //         wx.showToast({
    //           icon: 'none',
    //           title: '上传失败',
    //         })
    //       },
    //       complete: () => {
    //         wx.hideLoading()
    //       }
    //     })

    //   },
    //   fail: e => {
    //     console.error(e)
    //   }
    // })
  },
  onPullDownRefresh: function() { //触发 刷新事件
    console.log('pull down refresh !');

  },
  onReachBottom: function(obj) { //拉到底部了，触发了 加载更多事件
    console.log('to load more something ');
  },
  onPageScroll: function(obj) { //页面滑动事件

    var temp = this.data.contentTypeTopClass;
    if (obj.scrollTop >= 460) {
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
    wx.showLoading({
      title: '请稍后',
    });
    console.log(this.data.queryInput);
    setTimeout(function() {
      wx.hideLoading();

    }, 1000);
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
    var channel = event.currentTarget.dataset.channel;
    wx.showToast({
      title: channel.name,
    })

  },
  bindTypeTap: function(event) {
    var tap = event.currentTarget.dataset.type;
    var name = "最新发布"
    switch (tap) {
      case 'publish':
        name = "最新发布";
        this.setData({
          contenTypeNewestPublish: 'selected-text',
          contentTypeNewestReply: '',
          contentTypeMostZan: '',
          contentTypeMostShare: '',
        });
        break;
      case 'reply':
        name = '最新回复';
        this.setData({
          contenTypeNewestPublish: '',
          contentTypeNewestReply: 'selected-text',
          contentTypeMostZan: '',
          contentTypeMostShare: '',
        });
        break;
      case 'zan':
        name = '最多点赞';
        this.setData({
          contenTypeNewestPublish: '',
          contentTypeNewestReply: '',
          contentTypeMostZan: 'selected-text',
          contentTypeMostShare: '',
        });
        break;
      case 'share':
        name = '最多分享';
        this.setData({
          contenTypeNewestPublish: '',
          contentTypeNewestReply: '',
          contentTypeMostZan: '',
          contentTypeMostShare: 'selected-text',
        });
        break;
    }
    wx.showToast({
      title: name,
    })
  },
  bindTapPerson: function(event) { // 发布人被点击
    var person = event.currentTarget.dataset.person;
    console.log(person);
  },
  tapContact: function(event) { //联系Ta
    var phone = event.currentTarget.dataset.phone;
    console.log(phone);
  },
  tapContent: function(event) { //内容记录被点击
    var record = event.currentTarget.dataset.record;
   console.log(record);
  },
  tapZan: function(event){ // 赞被点击
    var record = event.currentTarget.dataset.record;
    console.log('zan');
  },
  tapContentShare:function(event){  //分享被点击
    var record = event.currentTarget.dataset.record;
    console.log('share');
  },
  tapChannel:function(event){ //频道被点击
    var record = event.currentTarget.dataset.record;
    console.log(record.channel);
  },
  tapRecordFunction: function(event){ //功能被点击
    var fun = event.currentTarget.dataset.fun;
    console.log(fun);
  }
})