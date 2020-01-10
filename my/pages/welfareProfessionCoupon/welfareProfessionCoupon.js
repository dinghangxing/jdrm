// my/pages/welfareProfessionCoupon/welfareProfessionCoupon.js

var app = getApp();
const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '福利专业版管理',
    barBg: '#ffffff',
    color: '#000',

    profressionList: ["无广告", "开启口令抽奖功能", "开启组队抽奖功能", "可发起一、二、三等奖", "奖品数量提升至1000","用户可以一键复制发起人的微信号、公众号强力吸粉"],
    
    list:10,
    windowHeight:0,
    AGAIN_BUY: 0,
    GIVE_TO_FRIEND:1,
    SHARE_DIALOG:2,
    cardCount:1,

    proTicketNum:0,
    isShowBuyBtn: true,
    ticketId:0,
    expTime: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.getSystemInfo({
      success: function (res) { 
        self.data.windowHeight = res.screenHeight;
      }
    })

    //self.createTransfers();

    self.setData({
        isShowBuyBtn: app.judgePhoneType(),
    })
  
  },

  clickRightUse:function(e){
    wx.navigateTo({
      url: '/welfare/pages/start/start?type=3',
    })
  },

  //点击转赠给好友，弹出底部弹窗
  clickGiveToFriendsView: function (e) {
    this.showModal(this.data.GIVE_TO_FRIEND);
  },

  //点击再次购买，弹出底部弹出框
  clickAgainBuyBtn: function () {
    this.showModal(this.data.AGAIN_BUY);
    // wx.navigateTo({
    //   url: '/my/pages/welfareProfessionCoupon/addService1/addService1',
    // })
  },

  showShareDialog: function () {
    debugger
    this.createTransfers();
  },

  //显示对话框
  showModal: function (type) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    var heigth = this.data.windowHeight;
    console.log("=====heigth===", heigth);
    animation.translateY(heigth).step();

    if (type == this.data.AGAIN_BUY) {
      this.setData({
        animationData: animation.export(),
        showAgainBuyStatus: true
      })
    } else if (type == this.data.GIVE_TO_FRIEND) {
      this.setData({
        animationData: animation.export(),
        showGiveToFriendStatus: true
      })
    } else if (type == this.data.SHARE_DIALOG) {
      this.setData({
        showGiveToFriendStatus: false,
        showShowDialogStatus: true
      })
    }

    
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  //隐藏对话框
  hideModal: function (e) {

    var type = e.currentTarget.dataset.id;
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step();

      if (type == this.data.AGAIN_BUY) {
        this.setData({
          animationData: animation.export(),
          showAgainBuyStatus: false,
        })
      } else if (type == this.data.GIVE_TO_FRIEND) {
        this.setData({
          animationData: animation.export(),
          showGiveToFriendStatus: false,
        })
      } else if (type == this.data.SHARE_DIALOG) {
        this.setData({
          showShowDialogStatus: false
        })
      }

    }.bind(this), 200)
  },

  clickClockGiveToFriendView: function(e) {
    this.hideModal(e);
  },

  clickCloseAgainBuyView:function(e){
    this.hideModal(e);
  },

  clickShowShowDialogStatus:function(e){
    // this.setData({
    //   proTicketNum: wx.getStorageSync("PRO_TICKET_NUM") + this.data.cardCount,
    // });
    this.hideModal(e);
  },

  clickBuyRightNow:function(e) {
    wx.navigateTo({
      url: '/my/pages/welfareProfessionCoupon/addService/addService',
    })
   
  },

  addCardBtn: function () {
    var count = this.data.cardCount + 1;
  
    if (count == this.data.proTicketNum +1){
      return;
    }

    this.setData({
      cardCount: count,
    })
  },

  lessCardBtn: function () {
    var count = this.data.cardCount - 1;
    if (count <= 1){
      count = 1;
    }

    this.setData({
      cardCount: count, //count--,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var isWelpareProUiClose = wx.getStorageSync("IS_PWLFARE_PRO_UI_CLOSE");
 
    if (isWelpareProUiClose) {
      wx.setStorageSync("IS_PWLFARE_PRO_UI_CLOSE", true);
      this.setData({
        showAgainBuyStatus: !isWelpareProUiClose,
      });
      
    }
   
    this.setData({
      proTicketNum: wx.getStorageSync("PRO_TICKET_NUM"),
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  createTransfers: function () {
   // return new Promise((resovle) => {
     debugger
    var cardCount = this.data.cardCount <= 0 ? 0 : this.data.cardCount;
    app.post(constant.CREATE_TRANSFER, 
    {
      num: cardCount,
    }, (res) => {
      console.log("创建分享返回", res);
      debugger
      if (res.data.error_code == 0) {
        this.data.ticketId = res.data.data.id;
        this.data.expTime = res.data.data.exp_time;
        wx.setStorageSync("PRO_TICKET_NUM", res.data.data.ticket_num);
        this.setData({
          proTicketNum: res.data.data.ticket_num,
        });

        this.showModal(this.data.SHARE_DIALOG);
      } else {
        wx.showToast({
          title: '转赠失败',
          icon:"none"
        })
      }

      //resovle();
    });

   // });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (opt) {

    this.setData({
      showShowDialogStatus: false,
    })

    var count = this.data.cardCount <= 0 ? 0 : this.data.cardCount;
    var titleText = "转赠 高级功能 ×" + count + ", 免费领取";

    var path = "/my/pages/welfareProfessionCoupon/shareAddService/shareAService?cardCount=" + count + "&shareName=" + wx.getStorageSync("NICK_NAME") + "&addservice=1" + "&ticketId=" + this.data.ticketId + "&expTime=" + this.data.expTime;

    return {
      title: titleText,
      path: path,
      imageUrl: "/img/addservice_share_img.png",
      
    }
    
  }
})
