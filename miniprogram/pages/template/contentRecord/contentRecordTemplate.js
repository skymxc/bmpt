var tapUser =function(event){
  var record = event.currentTarget.dataset.record;
  var opentid = record._openid;
  console.log(event);
  wx.navigateTo({
    url: '../userProfile/userProfile?openid=' + opentid,
  });
};

var tapContact= function(event) { //联系Ta
  var phone = event.currentTarget.dataset.phone;
  wx.showModal({
    title: '温馨提示',
    content: '你将要拨打电话：' + phone,
    success: function (res) {
      if (res.confirm) {
        wx.makePhoneCall({
          phoneNumber: phone //仅为示例，并非真实的电话号码
        })
      }
    }
  })

}

var tapRecordFunction = function(event){
  console.log(event);
}

var tapChannel = function(event){
  console.log(event);
}

var tapContent = function (event) { //内容记录被点击
console.log(event);
  var record = event.currentTarget.dataset.record;
  wx.navigateTo({
    url: '../contentDetail/contentDetail?_id=' + record._id,
  });
}

var tapImage = function (event) {
  var images = event.currentTarget.dataset.images;
  var url = event.currentTarget.dataset.url;
  wx.previewImage({
    urls: images,
    current: url
  });
}

var tapDelContent = function (event, publishNum, totalBeAgreeNum, totalBeReadNum){
  var record = event.currentTarget.dataset.record;
  var db = wx.cloud.database();
  return new Promise((resolve,reject)=>{
    db.collection('content').doc(record._id).remove()
      .then(res => {
        console.log(res);
          if(res.stats.removed==0){
            var err={
              message:'服务器休假咯'
            }
            reject(err)
          }else{
            resolve(true);

            //这里会出现 原子性问题 如果其他端也在删除，那么就会出现 脏数据
            var where = {
              _openid:record._openid
            };
            //防止出现 负数
            if(publishNum<1){
              publishNum =1;
            }
            var data={
              publishNum: publishNum-1,
              beAgreeNum: totalBeAgreeNum-record.agree_num,
              beReadedNum: totalBeReadNum - record.view_num
            };
            wx.cloud.callFunction({
              name:'update',
              data:{
                collection:'user',
                where:where,
                data:data
              },
              success:function(response){
                console.log(response);
              }
            })

            where = {
              content_Id:record._id
            };

            //删除相关评论 文件 等
            //删除评论
            wx.cloud.callFunction({
              name:"delete",
              data:{
                collection:'comment',
                where:where
              }
            }).then(console.log).catch(console.error);

            //删除文件
            if(record.images.length>0){
              wx.cloud.deleteFile({
                fileList:record.images
              }).then(res=>{
                console.log(res);
              }).catch(console.error);
            }
          }
      }).catch(err => {
          reject(err);
      });
  });
  
}

var tapZan = function(event){
  var record = event.currentTarget.dataset.record;
  return incContentNum('agree_num', record._id);
}

var incContentNum= function(field,_id) {
  console.log('_id-===>'+_id);
  return wx.cloud.callFunction({
    name: 'numInc',
    data: {
      collection: 'content',
      _id: _id,
      field: field
    }
  });
}

var updateContentUserAgreeNum= function(_id){
  console.log('user-->'+_id);
  wx.cloud.callFunction({
    name: 'numInc',
    data: {
      collection: 'user',
      _id: _id,
      field: 'beAgreeNum'
    }
  }).then(res=>{
    console.log(res);
  }).catch(err=>{
    console.log(err);
  })
}
var viewContentIncViewNum = function(record){
  wx.cloud.callFunction({
    name:'numInc',
    data:{
      collection:'content',
      field:'view_num',
      _id:record._id
    }
  }).then(res=>{
    console.log(res);
    if (res.result.stats.updated!=0){
      wx.cloud.callFunction({
        name:'numInc',
        data:{
          collection:'user',
          field:'beReadedNum',
          _id: record.user_id
        }
      }).then(res=>{
          console.log(res);
      }).catch(err=>{
          console.log(err);
      })
    }
  }).catch(err=>{
    console.log(err);
  })
}
module.exports = {
  tapUser: tapUser,
 tapContact: tapContact,
  tapRecordFunction: tapRecordFunction,
  tapChannel: tapChannel,
  tapContent: tapContent,
  tapImage: tapImage,
  tapDelContent: tapDelContent,
  tapZan: tapZan,
  updateContentUserAgreeNum: updateContentUserAgreeNum,
  viewContentIncViewNum: viewContentIncViewNum
};