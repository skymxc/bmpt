// miniprogram/pages/editPublish/editPublish.js
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classPublishCover: 'hide',
    classAddImage: '',
    imageList: [],
    imageCount: 6,
    address: {},
    fun_id: '',
    fun_name: '',
    channel: '',
    phone: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      fun_id: options.fun_id,
      fun_name: options.fun_name,
      channel: options.channel
    })

    qqmapsdk = new QQMapWX({
      key: '5RXBZ-WH5W3-BA63L-3SOUI-JP5J3-MUBTF'
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //todo 位置请求
    var that = this;
    qqmapsdk.reverseGeocoder({
      success: function(res) {
        if (res.status == 0) {
          var result = res.result;
          var address = {
            address: result.address,
            name: result.formatted_addresses.recommend,
            latitude: result.location.lat,
            longitude: result.location.lng
          }
          that.setData({
            address: address
          })
        } else {
          wx.showModal({
            title: '获取位置失败',
            content: res.message,
            showCancel: false
          })
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '获取位置失败',
          content: res.message,
          showCancel: false
        })
      },
      complete: function(res) {
        console.log(res)
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
        console.log(res)
        var files = res.tempFilePaths;
        var length = files.length;

        for (var i = 0; i < length; i++) {
          var file = files[i];
          var index = oldLength + i;
          var image = {
            src: file,
            msg: '上传中',
            upload: false,
            fileid: ''
          };

          images[index] = image;
          target.uploadFile(image, index);
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
  /**
   * 将文件上传
   */
  uploadFile: function(image, index) {
    var that = this;
    var images = this.data.imageList;
    var file = image.src;
    var split = file.split('.');
    //时间戳
    var time = new Date().getTime();
    var cloudName = app.globalData.openid + '_' + time + '.' + split[split.length - 1];

    var uploadTask = wx.cloud.uploadFile({
      cloudPath: 'image/content/' + cloudName,
      filePath: file,
      success: res => {
        console.log(res);
        if (res.statusCode == 200) {
          console.log(image);
          var fileid = res.fileID;
          image.fileid = fileid;
          image.msg='已上传'
          image.upload = true;
          console.log(image);
          images[index] = image;
          that.setData({
            imageList: images
          });
          console.log(that.data.imageList);
        }
      },
      fail: err => {
        console.log(err);
        image.fileid = fileid;
        image.upload = true;
        image.msg = '上传失败';
        images[index] = image;
        that.setData({
          imageList: images
        })
        wx.showToast({
          title: err.errMsg,
        })

      }
    });
    console.log(uploadTask);



  },

  controlAddImageVisible: function(page) {
    //  增加图片的按钮
    var classAdd = 'hide';
    if (this.data.imageList.length < 6) {
      classAdd = '';
    }
    this.setData({
      classAddImage: classAdd
    })
    console.log(this.data.classAddImage);
  },
  // 图片的 点击事件
  tapImage: function(event) {
    var images = [];
    var length = this.data.imageList.length;
    for (var i = 0; i < length; i++) {
      images[i] = this.data.imageList[i].src;
    }
    var image = event.currentTarget.dataset.image.src;

    wx.previewImage({
      urls: images,
      current: image
    })
  },

  /**
   * 删除图片
   */
  tapImageReduce: function(event) {
    var index = event.currentTarget.dataset.index;
    var images = this.data.imageList;
    var image = images[index];
    images.splice(index, 1);
    this.setData({
      imageList: images
    });
    this.controlAddImageVisible();
    //删除图片
    if (image.upload) {
      wx.cloud.deleteFile({
        fileList: [image.fileid],
        success: res => {
          console.log(res);
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },

  /**
   * 表单提交
   */
  submit: function(event) {
    console.log(event);
    var content = event.detail.value.content;
    var phone = event.detail.value.phone;
    if (content.length == 0) {
      wx.showToast({
        title: '发布内容没有输入',
        icon: 'none'
      })
      return;
    }
    if(phone.length==0){
      wx.showToast({
        title: '联系电话没有输入',
        icon: 'none'
      })
      return;
    }
    if (phone.length!= 11) {
      wx.showToast({
        title: '联系电话格式不正确',
        icon: 'none'
      })
      return;
    }
    var that = this;
    const db = wx.cloud.database();
    var date = new Date();
    var str = date.toLocaleString();
    var images = [];
    var length = this.data.imageList.length;
    for (var i = 0; i < length; i++) {

      var image = this.data.imageList[i];
      if (image.upload) {
        var size = images.length;

        images[size] = image.fileid;



      }
    }
    wx.showLoading({
      title: '正在发布',
      mask: false
    });

    db.collection('content').add({
      data: {
        address: that.data.address,
        agree_num: 0,
        channel_name: that.data.channel,
        comment_num: 0,
        conceal: false,
        content: content,
        create_date: date,
        create_date_str: app.formatDate('yyyy-MM-dd hh:mm', date),
        fun_id: that.data.fun_id,
        fun_name: that.data.fun_name,
        images: images,
        phone: phone,
        report_num: 0,
        share_num: 0,
        stick: false,
        view_num: 0,
        user: app.globalData.userInfo,
        user_id:app.globalData._id
      }
    }).then(res => {
      if(app.globalData._id){
        var _ = db.command;
        db.collection('user').doc(app.globalData._id)
        .update({
          data:{
            publishNum: _.inc(1)
          }
        }).then(res=>{
          console.log(res);
        })
      }
      
      console.log(res)
      wx.hideLoading();
      app.globalData.refresh = true;
      //

      wx.switchTab({
        url: '../index/index',
        fail: err=>{
          console.log(err);
        }
      })
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
      wx.showModal({
        title: '发布失败',
        content: err.message,
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('confirm')
          }
        }
      })
    });

  },

  tapChooseLocation: function(event) {
    var target = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res);

        var address = {
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address,
          name: res.name
        }
        target.setData({
          address: address
        })
      },
      fail: function(error) {

      }
    })
  },
  /**
   * 免责声明
   */
  tapClause: function() {
    wx.navigateTo({
      url: '../disclaimer/disclaimer',
    })
  },
  /**
   * 使用 默认微信电话
   */
  getPhoneNumber: function() {
    //未开放给个人开发者
  }

})