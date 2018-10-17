//index.js
const app = getApp()
const query = wx.createSelectorQuery();

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
          name: "招聘求职",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
          child: ['兼职', '全职']
        }, {
          id: 2,
            name: "顺风拼车",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
          child: ['汽车', '电脑']
          }, {
            id: 2,
            name: "房屋租售",
            image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
            child: ['汽车', '电脑']
          }, {
            id: 2,
            name: "二手闲置",
            image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
            child: ['汽车', '电脑']
          },{
            id: 2,
            name: "招商加盟",
            image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
            child: ['汽车', '电脑']
          }]
      }, {
        rowID: 2,
        channel: [{
          id: 1,
          name: "综合服务",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/zhaopin.png",
          child: ['兼职', '全职']
        }, {
          id: 2,
          name: "休闲娱乐",
          image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
          child: ['汽车', '电脑']
          },{
            id: 2,
            name: "特色美食",
            image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
            child: ['汽车', '电脑']
          }, {
            id: 2,
            name: "教育培训",
            image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
            child: ['汽车', '电脑']
          }, {
            id: 2,
            name: "花鸟鱼虫",
            image: "cloud://test-1e9ad8.7465-test-1e9ad8/image/system/channel/ershou.png",
            child: ['汽车', '电脑']
          }]
      }]


    }, {
      order: 2,
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
        }]
      }, {
        rowID: 2,
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
        }]
      }]
    }]
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
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
  }

})