//app.js

// App(Object) 是一个函数 ；用来注册一个小程序；接受一个 object 参数；
// 这个函数的 Object 参数有几个系统规定的生命周期属性：onLaunch , onShow,onHide,onError,onPageNotFound; 这几个属性都是 函数类型的 ；下面是实例代码
// 我们还可以自己添加 属性； 
App({
  onLaunch: function (options) {
    console.info('onLaunch  sence - >'+options.scene);
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  onShow: function (options) {
    console.error('into foreground .');
  },
  onHide: function (options){
    console.error('into background ');
  },
  onError: function (error){
    console.error(' occur error :'+error);
  },
  onPageNotFound: function (options){
    console.error('page not found !!!');
    console.error('page path->'+options.page);
  }
})
