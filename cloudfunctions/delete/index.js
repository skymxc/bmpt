// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var collection = event.collection;
  var where = event.where;
 return  db.collection(collection).where(where).remove();
}