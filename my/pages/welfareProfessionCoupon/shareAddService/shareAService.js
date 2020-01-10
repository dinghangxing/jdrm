// my/pages/welfareProfessionCoupon/shareAddService/shareAService.js

var app = getApp();
const constant = require("../../../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '赠值服务',
    barBg: '#ffffff',
    color: '#000',

    who:"",
    cardCount:0,
    btnChangeText:"",
    ticketId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.addservice == "1") {
      var ticketId = parseInt(options.ticketId);
      this.data.ticketId = ticketId;

      app.post(constant.CHECK_TICKET_STATUS, 
      { 
        id: ticketId,
      }, (res) => {
        console.log("检查券是否可领取或过期", res);
        
        if (res.data.error_code == 0) {
          var btnText = null;
          if (res.data.data == 31) {
            //自己
            btnText = "待领取";
          
          } else if (res.data.data == 32) {
             //自己
            btnText = "转赠已被领取";

          }  else if (res.data.data == 0) {
            //过期
            btnText = "转赠已过期";

          } else if (res.data.data == 1) {
            //可领取
            btnText = "立即领取";
            
          } else if (res.data.data == 2) {
            //被人领走
            btnText = "转赠已领取";
          } 

          this.setData({
            who: options.shareName,
            cardCount: options.cardCount,
            btnChangeText: btnText,
            time: options.expTime,
          })
        }

      });

     
    } 

  },

  rightNowToReceive:function(){
    
    app.post(constant.GET_TICKET,
      {
        id: this.data.ticketId,
      }, (res) => {
        console.log("立即领取增值服务", res);
        if (res.data.error_code == 0) {
          wx:wx.showToast({
            title: '领取成功',
           
          })
          
          this.setData({
            btnChangeText: "转赠已领取",
            
          })
        }

      });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})