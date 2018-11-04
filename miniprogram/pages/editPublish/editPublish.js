// miniprogram/pages/editPublish/editPublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classPublishCover: '',
    classAddImage: '',
    imageList: [],
    imageCount: 6,
    address:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //todo 位置请求
    var target = this;
    wx.getLocation({
      success: function(res) {
        var address = {
          latitude: res.latitude,
          longitude: res.longitude,
          detail: res.latitude+','+res.latitude
        }
        //逆地址解析

        target.setData({
          address:address
        })



      },
      fail: function(err){
        wx.showToast({
          title: err,
        })
      }
    })
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

  },
  /**
   * 发布按钮被点击
   */
  tapPublish: function() {
    console.log('publish ')
  },

  /**
   * 免责声明 选中改变事件
   */
  changeCheckboxClause: function(event) {
    var length = event.detail.value.length;
    console.log(length);
    if (length == 0) {
      this.setData({
        classPublishCover: ''
      })
    } else {
      this.setData({
        classPublishCover: 'hide'
      })
    }
  },
  /**
   * 添加图片
   */
  tapAddImage: function(event) {
    var count = this.data.imageCount - this.data.imageList.length;
    var oldLength = this.data.imageList.length;
    var images = this.data.imageList;
    var target = this;
    wx.chooseImage({
      count: count,
      success: function(res) {
        var files = res.tempFilePaths;
        var length = files.length;
        for (var i = 0; i < length; i++) {
          var file = files[i];
          var index = oldLength + i;
          var str = index + ";" + file;
          var image = {
            src: file,
            msg: '已上传'
          };
          images[index] = image;

        }


        target.setData({
          imageList: images
        })
        target.controlAddImageVisible(target)


      },
      fail: function(res) {
        console.log(res);
      }
    })

  },

  controlAddImageVisible: function(page) {
    //  增加图片的按钮
    var classAdd = 'hide';
    if (page.data.imageList.length < 6) {
      classAdd = '';
    }
    page.setData({
      classAddImage: classAdd
    })
    console.log(page.data.classAddImage);
  },
  // 图片的 点击事件
  tapImage: function(event) {
    var images = [];
    var length = this.data.imageList.length;
    for(var i=0;i<length;i++){
      images[i]=this.data.imageList[i].src;
    }
    var image = event.currentTarget.dataset.image.src;

    wx.previewImage({
      urls: images,
      current:image
    })
  },

  /**
   * 删除图片
   */
  tapImageReduce: function(event) {
    var index = event.currentTarget.dataset.index;
    var images = this.data.imageList;
    images.splice(index,1);
    this.setData({
      imageList:images
    })
  },

  /**
   * 表单提交
   */
  submit: function(event){
    console.log(event);
    var content = event.detail.value.content;
    if(content.length==0){
      wx.showToast({
        title: '发布内容没有输入',
        icon:'none'
      })
      return;
    }

    console.log('内容->' + content)
    console.log('images->'+this.data.imageList)

  },

  tapChooseLocation: function(event){
    var target = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res); 
        var detail = res.address + res.name;
        var address ={
          latitude: res.latitude,
          longitude: res.longitude,
          detail:detail
        }
        target.setData({
          address:address
        })
      },
      fail: function(error){
        wx.showToast({
          title: '位置获取失败',
        })
      }
    })
  }

})