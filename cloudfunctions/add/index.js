// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'test-1e9ad8'
})
const db= cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var collection = event.collection;
  var obj = event.obj;
return   db.collection(collection).add({
    data:obj
  });

}