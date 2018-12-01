var tapUser = function(event) {
  var record = event.currentTarget.dataset.record;
  var opentid = record._openid;
  console.log(event);
  wx.navigateTo({
    url: '../userProfile/userProfile?openid=' + opentid,
  });
};

var tapContact = function(event) { //联系Ta
  var phone = event.currentTarget.dataset.phone;
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

}



var tapChannel = function(_id, channel) {
  wx.navigateTo({
    url: '../contentFun/contentFun?_id=' + _id + '&channel=' + channel,
  });
}

var tapContent = function(event) { //内容记录被点击
  console.log(event);
  var record = event.currentTarget.dataset.record;
  wx.navigateTo({
    url: '../contentDetail/contentDetail?_id=' + record._id,
  });
}

var tapImage = function(event) {
  var images = event.currentTarget.dataset.images;
  var url = event.currentTarget.dataset.url;
  wx.previewImage({
    urls: images,
    current: url
  });
}

var tapDelContent = function(event, publishNum, totalBeAgreeNum, totalBeReadNum) {
  var record = event.currentTarget.dataset.record;
  var db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection('content').doc(record._id).remove()
      .then(res => {
        console.log(res);
        if (res.stats.removed == 0) {
          var err = {
            message: '服务器休假咯'
          }
          reject(err)
        } else {
          resolve(true);

          db.collection('user').doc(getApp().globalData._id).update({
            data: {
              publishNum: publishNum - 1,
              beAgreeNum: totalBeAgreeNum - record.agree_num,
              beReadedNum: totalBeReadNum - record.view_num
            },
            success: function(response) {
              console.log(response);
            },
            fail: function(err) {
              console.log(err);
            }
          })

          var where = {
            content_id: record._id
          };

          //删除相关评论 文件 等
          //删除评论
          wx.cloud.callFunction({
            name: "delete",
            data: {
              collection: 'comment',
              where: where
            }
          }).then(console.log).catch(console.error);

          //删除文件
          if (record.images.length > 0) {
            wx.cloud.deleteFile({
              fileList: record.images
            }).then(res => {
              console.log(res);
            }).catch(console.error);
          }
        }
      }).catch(err => {
        reject(err);
      });
  });

}

var addAgree = function(content) {
  var openid = getApp().globalData.openid;
  var user_id = getApp().globalData._id;
  var db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection('agree').add({
      data: {
        content_id: content._id,
        user_id: user_id
      }
    }).then(res => {
      console.log('点赞-add->' + res._id);
      resolve();
      //更改自身记录
      //更改 user 记录
      incContentNum('agree_num', content._id).then(console.log).catch(console.error);
      updateContentUserAgreeNum(user_id);
    }).catch(error => {
      console.log(error);
      reject(error.errMsg);
    })
  });

}
var reduceAgree = function(content) {
  var content_id = content._id;
  var openid = getApp().globalData.openid;
  var user_id = getApp().globalData._id;
  var where = {
    content_id: content_id,
    _openid: openid,
    user_id: user_id
  };
  console.log(where);
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'delete',
      data: {
        collection: 'agree',
        where: where
      }
    }).then(res => {
      console.log(res);
      // if(res.result.stats.removed)
      try{
        if (res.result.stats.removed == 0) {
          return reject('没有点赞记录');
        }
      }catch(e){
        console.error(e);
        return reject('没有点赞记录');
      }

      
     
      wx.cloud.callFunction({
        name: 'reduceAgree',
        data: {
          content_id: content_id,
          content_user_id: content.user_id
        }
      }).then(res => {
        console.log('reduce agree -- res')
        console.log(res);
        resolve();
      }).catch(error => {
        console.log('reduce agree --error ')
        console.error(error);
        reject(error);
      })

    }).catch(error => {
      console.log(error);
      reject(error);
    });
  });
}
var tapZan = function(event) {
  var record = event.currentTarget.dataset.record;
  var openid = getApp().globalData.openid;
  var user_id = getApp().globalData._id;
  var db = wx.cloud.database();

  if (record.agree) {
    return reduceAgree(record);
  } else { //没有点过赞

    return addAgree(record);
  }


  // return incContentNum('agree_num', record._id);
}

var incContentNum = function(field, _id) {
  console.log('_id-===>' + _id);
  return wx.cloud.callFunction({
    name: 'numInc',
    data: {
      collection: 'content',
      _id: _id,
      field: field
    }
  });
}

var updateContentUserAgreeNum = function(_id) {
  console.log('user-->' + _id);
  wx.cloud.callFunction({
    name: 'numInc',
    data: {
      collection: 'user',
      _id: _id,
      field: 'beAgreeNum'
    }
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}
var viewContentIncViewNum = function(record) {
  wx.cloud.callFunction({
    name: 'numInc',
    data: {
      collection: 'content',
      field: 'view_num',
      _id: record._id
    }
  }).then(res => {
    console.log(res);
    if (res.result.stats.updated != 0) {
      wx.cloud.callFunction({
        name: 'numInc',
        data: {
          collection: 'user',
          field: 'beReadedNum',
          _id: record.user_id
        }
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    }
  }).catch(err => {
    console.log(err);
  })
}

var tapFun = function(_id) {
  console.log('fun_id--->' + _id)
  wx.navigateTo({
    url: '../contentFun/contentFun?_id=' + _id,
  });
}

var tapShare = function(content) {

  var custom = {
    title: content.content,
    path: '/pages/contentDetail/contentDetail?_id=' + content._id
    // path:'/pages/index/index'
  };
  if (content.images.length > 0) {
    custom.imageUrl = content.images[0];
  }
  console.log(custom);
  incContentNum('share_num', content._id).then(console.log).catch(console.error);
  return custom
}
module.exports = {
  tapUser: tapUser,
  tapContact: tapContact,

  tapChannel: tapChannel,
  tapContent: tapContent,
  tapImage: tapImage,
  tapDelContent: tapDelContent,
  tapZan: tapZan,
  updateContentUserAgreeNum: updateContentUserAgreeNum,
  viewContentIncViewNum: viewContentIncViewNum,
  tapFun: tapFun,
  tapShare: tapShare
};