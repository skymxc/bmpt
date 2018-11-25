// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'test-1e9ad8'
})

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var collection = event.collection;
  var data = event.data;
  var where = event.where;
return db.collection(collection).where(where).update({
  data:data
});
}