// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  var content_user_id = event.content_user_id;
  var content_id = event.content_id;
 return new Promise((resolve,reject) => {

   db.collection('agree').where({
     content_id: content_id
   }).count().then(res => {
     console.log(res);
     db.collection('content').doc(content_id).update({
       data: {
         agree_num: res.total
       }
     }).then(res=>{
       //把 user 的总赞数 - 1；
       db.collection('user').doc(content_user_id).update({
         data:{
           beAgreeNum: _.inc(-1)
         }
       }).then(response => {
         console.log(response);
         resolve(response);
       }).catch(error => {
         console.error(error);
         reject(error);
       })
     
     }).catch(err => {
       console.log(err);
       reject(err);
     })
   }).catch(error => {
     console.log(error);
     reject(error);
   })

 }); 
}