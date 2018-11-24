// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含
 * - 小程序端调用传入的 data
 * - 经过微信鉴权直接可信的用户唯一标识 openid 
 * 
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env:'test-1e9ad8'
})
const db = cloud.database()

exports.main = (event, context) => {

  var openid = event.userInfo.openId;

  var user = {
    user: event.user,
    lastLogin: db.serverDate(),
    publishNum: 0,
    beReadedNum: 0,
    beAgreeNum: 0,
    beReportNum: 0
  };
  db.collection('content').where({
    openid: openid
  }).count().then(total=>{
    console.log("===>"+total);
  }).catch(err=>{
      console.log('==err'+err);
  });
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看
  // db.collection('user').where({
  //   openid: openid
  // }).count(res => {
  //   console.log('count==>'+res);
  //   if (res == 0) { //插入
  //   console.log('execute add');
  //     db.collection('user').add({
  //       data: user,
  //       success: function(response) {
  //         console.log('execute add success');
  //         console.log(response);
  //       },
  //       fail: function(err) {
  //         console.log('execute add failed');
  //         console.log(err);
  //       }
  //     });
  //   } else { //修改
  //   console.log('execute update ')
  //     db.collection('user').where({
  //       openid: openid
  //     }).update({
  //       data: {
  //         lastLogin: db.serverDate()
  //       }
  //     }).then(stats => {
  //       console.log('update 结果==》' + stats.updated);
  //     }).catch(error => {
  //       console.log('update失败 ==》' + error);
  //     });
  //   }
  // }).catch(error => {
  //   console.log(error);
  //   //插入
  //   db.collection('user').add({
  //     data: user,
  //     success: function(response) {
  //       console.log(response);
  //     },
  //     fail: function(err) {
  //       console.log(err);
  //     }
  //   });
  // })

  return {
    openid: event.userInfo.openId,
  }
}