// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  var collection = event.collection;
  var field = event.field;
  var _id = event._id;
  var data ={};
  if(field=='agree_num'){
    data={
      agree_num:_.inc(1)
    }
  }else if(field=='view_num'){
    data={
      view_num:_.inc(1)
    }
  }else if(field=='report_num'){
    data={
      report_num:_.inc(1)
    }
  }else if(field=='comment_num'){
    data={
      comment_num:_.inc(1)
    }
  }else if(field=='share_num'){
    data={
      share_num:_.inc(1)
    }
  } else if (field =='beAgreeNum'){
    data={
      beAgreeNum: _.inc(1)
    }
  } else if (field =='beReadedNum'){
    data = {
      beReadedNum: _.inc(1)
    }
  } else if (field =='beReportNum'){
    data={
      beReportNum:_.inc(1)
    }
  } else if (field =='publishNum'){
    data = {
      publishNum: _.inc(1)
    }
  }
 return  db.collection(collection).doc(_id).update({data:data});
}