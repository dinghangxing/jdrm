// my/pages/pointMall/pointMall.js
const app = getApp();
const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '积分',
    barBg: '#ffffff',
    color: '#000',

    pointCount: 0,

    pointMallList: [],
    page: 0,
    size: 10,
    hasMore: true,

    signDayCount: "",
    currentDay: 0,
    isSigned: false,
    hadClickSignBtn:false,
    arrSignTime: [],
    pointList:[],
    showToast:false,
  },

  //积分签到逻辑开始
  createSignArr: function(dayNum, checkStatus) {

    //今日是否已经签到
    var isCheckIn = checkStatus == 0 ? false : true;
    wx.setStorageSync("isTodaySign", isCheckIn);
    this.data.hadClickSignBtn = isCheckIn;

    this.data.currentDay = dayNum;
    var now = new Date();
    var firstDate;
    if (dayNum == 0) {
      dayNum = dayNum + 1;
      firstDate = now.getTime();
    } else {
      //今日是否已经签到
      var isTodaySign = wx.getStorageSync("isTodaySign");
      if (isTodaySign) {
        //今日已签到 
        firstDate = now.getTime() - 3600 * 24 * 1000 * (dayNum - 1);
      } else {
        //今日还未签到
        firstDate = now.getTime() - 3600 * 24 * 1000 * dayNum;
      }
    }

    var currentTime = date.formatTime(now.getTime(), 'M.D');
    var showPointDate;
    var arr = [];
    
    for (var i = 0; i < 7; i++) {
      var time = firstDate + 3600 * 24 * 1000 * i;
      var pointDate = date.formatTime(time, 'M.D');

      //设置今日字样
      if (pointDate == currentTime) {
        showPointDate = "今日";
     
      } else {
        showPointDate = pointDate;
      }

      if (i < dayNum && this.data.currentDay != 0) {
        this.isSigned = true;
      } else {
        this.isSigned = false;
      }

      arr.push({
        point: this.data.pointList[i], //(i + 1) * 10,
        dateStr: showPointDate,
        signed: this.isSigned
      });
    }

    this.setData({
      arrSignTime: arr,
      hadClickSignBtn: isCheckIn,
    })

  },

  confirm:function(){
    this.setData({
      showToast: false,
    })
  },

  pointTipsBtn:function(){
    this.setData({
      showToast: !this.data.showToast,
    })
    // wx.showModal({
    //   title: '每日积分说明',
    //   content: '每日均可领取1次积分，领满7次，开始下一轮积分的领取。积分可用于购买平台内的积分类服务。',
    //   showCancel:false,
    // })
  },

  signBtn: function(e) {
    var time = new Date().getTime();
    var pointDate = date.formatTime(time, 'M.D');
    var index = e.currentTarget.dataset.index;
    if (index == 0 && this.data.currentDay == 0) {
      //第0项，可点击签到
      this.loadSignData();

    } else if ((index + 1) == this.data.currentDay + 1) {

      if (this.data.arrSignTime[index].dateStr == "今日") {
        //可签到
        this.loadSignData();

      } else {
        this.showToastTips("签到时间未到");

      }
    } else if ((index + 1) <= this.data.currentDay) {
      this.showToastTips("您已签到");

    } else {
      this.showToastTips("签到时间未到");
    }

  },

  showToastTips: function(str) {
    wx.showToast({
      title: str,

    });
  },

  loadSignData: function() {
 
    if (this.data.hadClickSignBtn) {
      return
    }

    var self = this;
    app.post(constant.CHECK_IN, {}, function(res) {

      if (res == null) return;
      if (res.data.error_code == 1) {
        self.showToastTips("今日已签到");

        return;

      } 
 
      var addPoint = res.data.data.point - self.data.pointCount;
     
      wx.showToast({
        title: "积分 +" + addPoint,
        image: "/my/img/point-success.png",
      });

      self.getCheckInInfo(res.data.data);

    });
  },

  getCheckInInfo: function(data) {
    //0 表示未签到，1表示已经签到
    this.createSignArr(data.last_day, 1),
     
    //wx.setStorageSync("point_count", data.point); 
    this.setData({
      signDayCount: data.last_day,
      pointCount: data.point,

    })
  },

  signReceiveBtn:function(e){
    this.loadSignData();
  },
  //积分签到逻辑结束

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      pointCount: wx.getStorageSync("point_count"),

    })

    this.loadPointList();
    
    this.loadPointMallList();
    
  },

  loadPointList:function(){
    app.post(constant.POINT_LIST,
    {
    }, (res)=>{
      console.log("积分列表返回：",res);
      
      if (res.data.error_code == 0) {
        this.data.pointList = res.data.data;
        var lastDay = wx.getStorageSync("LAST_DAY");
        var isChecked = wx.getStorageSync("IS_CHECKING");
       
        this.createSignArr(lastDay, isChecked);
        this.setData({
          signDayCount: lastDay,
        })
      }
    });
  },

  loadPointMallList: function() {
    if (!this.data.hasMore) {
      return;
    }
    this.data.page++;

    app.post(constant.POINT_GET_PRODUCTS, {
        page: this.data.page,
        size: this.data.size,

      },
      (res) => {
        console.log("积分商城列表：", res);
        if (res.data.error_code == 0) {

          var list = res.data.data;
          if (list.length < this.data.size) {
            this.setData({
              hasMore: false,
              
            });
          }

          var dataList = this.data.pointMallList.concat(list);

          this.setData({
            pointMallList: dataList,

          })

        } else {
        }
      }
    );
  },

  clickPointItem: function(e) {
    var index = e.currentTarget.dataset.index;
    var point = this.data.pointMallList[index].p_value;
    if (this.data.pointCount < point) {
      wx.showToast({
        title: "您的积分不足！",
      })

      return;
    }

    var productId = this.data.pointMallList[index].product_id;
    var contents = this.data.pointMallList[index].p_name;

    var self = this;
    wx.showModal({
      content: "是否立即使用积分兑换 " + contents,
      success: function(res) {
        if (res.confirm) {
          app.post(constant.POINT_CONVERT_PRODUCTS, {
              product_id: productId,

            },
            (res) => {
              if (res.data.error_code == 0) {
                wx.showToast({
                  title: "兑换成功！",
                })

                self.setData({
                  pointCount: res.data.data,
                })

              } else {
                wx.showToast({
                  title: res.data.mssage,
                })
              }
            }
          );

        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    this.loadPointMallList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})