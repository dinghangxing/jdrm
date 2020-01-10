// my/pages/balance/balance.js
var app = getApp();
const constant = require("../../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '余额',
    barBg: '#ffffff',
    color: '#000',

    money: 0,
    showToast:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  refreshBalanceValue:function(){
 
    this.setData({
      money: wx.getStorageSync("MONEY"),
    })
  },

  clickBalanceDetail: function(e) {
    wx.navigateTo({
      url: '/my/pages/balanceDetail/balanceDetail',
    })
  },

  clickRechargeBtn: function() {
    
    wx.navigateTo({
      url: '/my/pages/reCharge/reCharge',
    })
  },

  confirm:function(){
    this.setData({
      showToast: false,
    });
  },

  clickWithdrawBtn:function(){
    // this.setData({
    //   showToast: !this.data.showToast
    // });
    wx.setStorageSync("MONEY", this.data.money),
    wx.navigateTo({
      url: '/my/pages/withdraw/withdraw',
    })
  },

  // sureToRechargeSuccess:function(){
  //   app.post(constant.SURE_RECHARGE_SUCCESS,
  //     {
  //     }, (res) => {
  //       console.log("充值是否成功确认返回：", res);
  //       if (res.data.error_code != 0) {
  //         wx.showToast({
  //           title: '充值失败',
  //         })
  //         return;

  //       } else {
  //         wx.showToast({
  //           title: '充值成功！',
  //           icon: "none"
  //         })

  //         //更新余额数
  //         wx.setStorageSync("MONEY", res.data.data.price)
  //         this.refreshBalanceValue();
  //       }
  //     }
  //   );

  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.refreshBalanceValue();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})