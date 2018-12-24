// miniprogram/pages/manger/report/report.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: 0,
    reportList: [],
    pageIndex: 0,
    pageSize: 20,
    deal: false,
    emptyMsg: '目前没有举报内容呢'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onReady: function() {
    wx.startPullDownRefresh({

    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pageIndex: 0
    })
    this.loadReport(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('load more ');
    this.loadReport(false);
  },
  tapType: function(event) {
    var type = event.currentTarget.dataset.index;
    this.setData({
      selectIndex: type,
      deal: type == 1
    });
    wx.startPullDownRefresh({

    });
  },
  loadReport: function(refresh) {
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    console.log(this.data.pageIndex);
    console.log(this.data.pageSize);
    db.collection('report').where({
        deal: this.data.deal
      }).orderBy('create_date', 'desc').skip(this.data.pageIndex).limit(this.data.pageSize).get()
      .then(res => {
        console.log('refresh==>' + refresh);

        if (refresh) {
          wx.stopPullDownRefresh();
          that.data.reportList = res.data;

        } else {
          that.data.reportList = that.data.reportList.concat(res.data);

        }
        that.data.pageIndex = that.data.pageIndex + res.data.length;
        that.setData({
          pageIndex: that.data.pageIndex,
          reportList: that.data.reportList
        });
        wx.hideLoading();


      }).catch(error => {
        console.error(error);
        wx.hideLoading();
        if (refresh) {
          wx.stopPullDownRefresh();
        }
        wx.showModal({
          title: '服务器又调皮了',
          content: error.errMsg,
          showCancel: false
        })
      });
  },
  tapUser: function(event) {
    wx.showLoading({
      title: '请稍后',
    })
    var report = event.currentTarget.dataset.report;
    wx.navigateTo({
      url: '../../userProfile/userProfile?openid=' + report._openid,
      success: function() {
        wx.hideLoading();
      },
      fail: function() {
        wx.hideLoading();
      }

    });
  },
  tapContent: function(event) {
    wx.showLoading({
      title: '请稍后',
    
    })
    var report = event.currentTarget.dataset.report;
    wx.navigateTo({
      url: '../../contentDetail/contentDetail?_id=' + report.content_id,
      success: function() {
        wx.hideLoading();
      },
      fail: function() {
        wx.hideLoading();
      }

    });
  },
  tapIgnore: function(event) {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var report = event.currentTarget.dataset.report;
    var that = this;
    var index = event.currentTarget.dataset.index;
    db.collection('report').doc(report._id).update({
      data: {
        deal: true,
        result: '忽略',
        deal_user: app.globalData.userInfo,
        deal_time: db.serverDate
      }
    }).then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.stats.updated != 0) {
        that.data.reportList.splice(index, 1);
        that.setData({
          reportList: that.data.reportList,
          pageIndex: that.data.pageIndex - 1
        })
      } else {
        wx.showToast({
          title: '操作失败',
          icon:'none'
        });
      }
    }).catch(error => {
      console.error(error);
      wx.hideLoading()
      wx.showModal({
        title: '服务器又调皮了',
        content: error.errMsg,
        showCancel: false
      });
    });
  },
  tapDel: function(event) {

    var report = event.currentTarget.dataset.report;
    var that = this;
    var index = event.currentTarget.dataset.index;
    if (!report.content_id) {
      wx.showToast({
        title: '该记录已损坏',
        icon:'none'
      })
      //处理掉举报记录
      this.execReportResult(report,index,'举报内容ID不对')
      return;
    }

    wx.showLoading({
      title: '请稍后',
      mask: true
    });

    db.collection('content').doc(report.content_id).get()
    .then(res=>{
      wx.hideLoading();
      if(res.data){
          var content = res.data;
        if (content.conceal){ //本来就是隐藏的//无需再次处理了
          that.execReportResult(report,index,'删除');
        }else{
          //修改举报内容为 隐藏
          that.handleReportDel(report,index);
        }
      }else{
        wx.hideLoading();
        wx.showToast({
          title: '该记录已经被删除了！',
          icon:'none'
        });
        //删除举报内容
        that.execReportResult(report, index, '该记录已经被删除了！')
      }
    }).catch(error=>{
        wx.hideLoading();
        wx.showToast({
          title: '举报内容获取出错',
        })
      that.execReportResult(report, index,'举报内容获取出错')
    });



  },
  handleReportDel:function(report,index){
    var that = this;
    wx.showLoading({
      title: '处理举报内容',
      mask: true
    });

    var where = {
      _id: report.content_id
    };

    var data = {
      conceal: true
    };
    console.log(where);
    console.log(data);
    wx.cloud.callFunction({
      name: 'update',
      data: {
        where: where,
        collection: 'content',
        data: data
      }
    }).then(res => {
      console.log(res);
      if (res.result.stats.updated == 0) {
        wx.hideLoading();
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
        that.execReportResult(report, index, '操作失败');
        return;
      }
      wx.hideLoading();
      that.execReportResult(report,index,'删除');
    }).catch(error => {
      console.error(error);
      wx.showToast({
        title: '处理失败',
      })
      that.execReportResult(report, index, '处理失败');
    });

  },
  execReportResult:function(report,index,resul){
    wx.showLoading({
      title: '修改处理结果',
    })
    var that =this;
    db.collection('report').doc(report._id).update({
      data: {
        deal: true,
        result: resul,
        deal_user: app.globalData.userInfo,
        deal_time: db.serverDate
      }
    }).then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.stats.updated != 0) {
        that.handleReportSucc(index);
      } else {
        wx.showToast({
          title: '操作失败'
        });
      }
    }).catch(error => {
      console.error(error);
      wx.hideLoading()
      wx.showModal({
        title: '服务器又调皮了',
        content: error.errMsg,
        showCancel: false
      });
    });
  },
  handleReportSucc:function(index){
    this.data.reportList.splice(index, 1);
    this.setData({
      reportList: this.data.reportList,
      pageIndex: this.data.pageIndex - 1
    })
  }
})