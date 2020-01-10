// pages/my/index/index.js
var app = getApp();
const md5 = require('../../../util/md5.js');
const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');
var jump = require('../../../util/aplets.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我的',
    barBg: '#ffffff',
    color: '#000',

    userImage: "",
    nickName: "",
    myJoinCount: 0,
    myInitiateCount: 0,
    myWinRecord: 0,
    isSuperAdmin: false,
    
    money: 0,
    ticketCount: 0,

    signDayCount: "",
    signPointCount: 0,
    arrSignTime: [],
    pointCount: 0,
    currentDay: 0,
    isSigned: false,
    dataInfo:false,
    isShowLoading: true,
    //引导添加到我的小程序
    isYindao:true,

    showAnimation: {},
    animationIntervalId: 0,
  },

  animationAuthImg: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      delay: 0,
    })

    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    this.data.animationIntervalId = setInterval(function () {
      n = n + 1;
      var i = n % 2;
      if (i == 0) {
        animation.scale(0.8, 0.8).step();
      } else {
        animation.scale(1.5, 1.5).step();
      }

      this.setData({
        showAnimation: animation.export()
      })
    }.bind(this), 300);

  },

  /**
   * 停止旋转
   */
  stopAnimationInterval: function () {
    var animationId = this.data.animationIntervalId;
    if (animationId > 0) {
      clearInterval(animationId);
      this.data.animationIntervalId = 0;
    }
  },


  setUserInfo: function(e) {
    var userInfo = app.globalData.userInfo;
    wx.setStorageSync("NICK_NAME", userInfo.nickName);
    wx.setStorageSync("USER_IMAGE", userInfo.avatarUrl);
    
    this.setData({
      userImage: userInfo.avatarUrl,
      nickName: userInfo.nickName,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var a = wx.getStorageSync("IS_YINDAO");
    if(wx.getStorageSync("IS_YINDAO") === false){
      this.closeYindao();
    }

  },


  /**
   * 加载我的页面展示信息
   */
  loadMyInfo: function() {
    var self = this;
    app.post(constant.GET_MY_INFO, {}, function(res) {
      console.log("GET_MY_INFO_return:", res);
      if (res.data.error_code == 0) {
        self.getMyInfo(res.data.data);
      } else {
        wx.showToast({
          title: res.data.mssage,
        })
        
        self.data.dataInfo = false;
      } 

    }, self.data.isShowLoading);
  },

  getMyInfo: function(res) {
    if (res == null) {
      this.data.dataInfo = false;
      return;
    } 

    this.data.dataInfo = true;
    
    //积分功能移到积分列详情页中
    //this.createSignArr(res.last_day, res.is_checking);
    
    //今日是否已经签到
    var isCheckIn = res.is_checking == 0 ? false : true;
 
    wx.setStorageSync("LAST_DAY", res.last_day);
    wx.setStorageSync("IS_CHECKING", res.is_checking);

    wx.setStorageSync("point_count", res.point);
    wx.setStorageSync("MONEY", res.money);
    wx.setStorageSync("PRO_TICKET_NUM", res.pro_ticket_num);
    wx.setStorageSync("isChecked1", res.public_card == 1? true : false);
    
    var isSuper;
    if (res.role == 9) {
      isSuper = true;
    } else {
      isSuper = false;
    }
    
    this.setData({
      isSigned: isCheckIn,
      myJoinCount: res.join_active_num,
      myInitiateCount: res.active_num,
      signDayCount: res.last_day,
      pointCount: res.point,
      myWinRecord: res.won_active_num,
      money: res.money,
      ticketCount: res.pro_ticket_num,
      isSuperAdmin: isSuper, 
    });

  },

  // createSignArr: function(dayNum, checkStatus) {

  //   //今日是否已经签到
  //   var isCheckIn = checkStatus == 0 ? "false" : "true";
  //   wx.setStorageSync("isTodaySign", isCheckIn);

  //   this.data.currentDay = dayNum;
  //   var now = new Date();
  //   var firstDate;
  //   if (dayNum == 0) {
  //     dayNum = dayNum + 1;
  //     firstDate = now.getTime();
  //   } else {
  //     //今日是否已经签到
  //     var isTodaySign = wx.getStorageSync("isTodaySign");
  //     if (isTodaySign == "true") {
  //       //今日已签到 
  //       firstDate = now.getTime() - 3600 * 24 * 1000 * (dayNum - 1);
  //     } else {
  //       //今日还未签到
  //       firstDate = now.getTime() - 3600 * 24 * 1000 * dayNum;
  //     }
  //   }

  //   var currentTime = date.formatTime(now.getTime(), 'M.D');
  //   var showPointDate;
  //   var arr = [];
  //   for (var i = 0; i < 7; i++) {
  //     var time = firstDate + 3600 * 24 * 1000 * i;
  //     var pointDate = date.formatTime(time, 'M.D');

  //     //设置今日字样
  //     if (pointDate == currentTime) {
  //       showPointDate = "今日";
  //     } else {
  //       showPointDate = pointDate;
  //     }

  //     if (i < dayNum && this.data.currentDay != 0) {
  //       this.isSigned = true;
  //     } else {
  //       this.isSigned = false;
  //     }

  //     arr.push({
  //       point: (i + 1) * 10,
  //       dateStr: showPointDate,
  //       signed: this.isSigned
  //     });

  //   }

  //   this.setData({
  //     arrSignTime: arr,
  //   })

  // },

  // signBtn: function(e) {
  //   var time = new Date().getTime();
  //   var pointDate = date.formatTime(time, 'M.D');
  //   var index = e.currentTarget.dataset.index;
  //   if (index == 0 && this.data.currentDay == 0) {
  //     //第0项，可点击签到
  //     this.loadSignData();

  //   } else if ((index + 1) == this.data.currentDay + 1) {

  //     if (this.data.arrSignTime[index].dateStr == "今日") {
  //       //可签到
  //       this.loadSignData();

  //     } else {
  //       this.showToastTips("签到时间未到");

  //     }
  //   } else if ((index + 1) <= this.data.currentDay) {
  //     this.showToastTips("您已签到");

  //   } else {
  //     this.showToastTips("签到时间未到");
  //   }

  // },

  // showToastTips: function(str) {
  //   wx.showToast({
  //     title: str,

  //   });
  // },

  // loadSignData: function() {

  //   var self = this;
  //   app.post(constant.CHECK_IN, {}, function(res) {

  //     if (res == null) return;
  //     if (res.data.error_code == 1) {
  //       self.showToastTips("今日已签到");

  //       return;

  //     }

  //     self.getCheckInInfo(res.data.data);

  //   });
  // },

  // getCheckInInfo: function(data) {
  //   //0 表示未签到，1表示已经签到
  //   this.createSignArr(data.last_day, 1),

  //     this.setData({
  //       signDayCount: data.last_day,
  //       pointCount: data.point,

  //     })
  // },

  clickMyCardItem: function () {
    var cardId = wx.getStorageSync("CARD_ID");
    jump.jump(cardId);
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
    this.animationAuthImg();

    this.setUserInfo();

    if (this.data.dataInfo) {
      this.data.isShowLoading = false;
    } else {
      this.data.isShowLoading = true;
    }
      
    this.loadMyInfo();
    
    wx.setStorageSync("tabPage", "/pages/my/index/index");
  },


  myJoinView: function(e) {

    wx.navigateTo({
      url: '/my/pages/myJoin/myJoin',
    })
  },

  myInitiateView: function(e) {

    wx.navigateTo({
      url: '/my/pages/myInitiate/myInitiate',
    })
  },

  myWinRecordView: function(e) {

    wx.navigateTo({
      url: '/my/pages/winRecord/winRecord',
    })
  },

  balanceView:function(e) {
    wx.navigateTo({
      url: '/my/pages/balance/balance',
    })
  },

  pointMallView:function(e){
   
    wx.navigateTo({
      url: '/my/pages/pointMall/pointMall',
    })
  
  },

  welfareProfessionCouponView: function (e) {

    wx.navigateTo({
      url: '/my/pages/welfareProfessionCoupon/welfareProfessionCoupon',
    })

  },

  cardProfessionCouponView: function(e){
    wx.navigateTo({
      url: '/my/pages/cardProfessionCoupon/cardProfessionCoupon',
    })
  },

  redPackageRecordView:function(e){
    wx.navigateTo({
      url: '/my/pages/redReceive/redReceive',
    })
  },

  privaceSetView:function(){
    wx.navigateTo({
      url: '/my/pages/privacy/privacy',
    })
  },

  useHelpView:function(){
    wx.navigateTo({
      url: '/my/pages/useHelp/useHelp',
    })
  },

  superAdminiBtn:function(){
    wx.showToast({
      title: '功能开发中~',
    }) 
  },


  getAddress: function(e) {
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function(res) {
          console.log(JSON.stringify(res))
        },

        fail: function(err) {
          console.log(JSON.stringify(err))
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }

  },

  closeYindao:function(){
    this.stopAnimationInterval();
    this.setData({
      isYindao:false
    });
    wx.setStorageSync("IS_YINDAO", false)
  },

  // getCustomer: function(e) {
  //   app.post(constant.GET_CUSTOMER, {}, function(res) {
  //     console.log("联系客服：", res);
  //   });
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.stopAnimationInterval();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(option) {
    
    if (option.from == "menu") {
      var titleText = "推荐简单人脉给您，来试试";
      var cardId = wx.getStorageSync("CARD_ID");
      var path = null;
      if (cardId != 0) {
        path = "/card/detail/detail?card_id=" + this.data.card_id + "&share=1";
      }
      
      return {
        title: titleText,
        path: path,
        imageUrl: "/img/share_aplet_img.png",
      }
    }
  }
})