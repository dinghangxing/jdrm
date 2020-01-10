// my/pages/balance/balance.js
var app = getApp();
const constant = require("../../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '余额提现',
    barBg: '#f0f0f0',
    color: '#000',

    withdrawVal:0,
    inputWithDrawVal:0,
    isClickAllWithdraw: false,
    servicePrice: 0,
    priceValue:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      userNick: wx.getStorageSync("NICK_NAME"),
      avatarUrl: wx.getStorageSync("USER_IMAGE"),
      withdrawVal: wx.getStorageSync("MONEY"),
      isClickAllWithdraw:false,

    })
    
  },


  //实时搜索框文本内容显示
  inputBind: function (e) {
    this.data.inputWithDrawVal = e.detail.value * 100;
    var serviceValue = this.standardAmount(e.detail.value * 0.02);
    this.setData({
      priceValue: this.data.inputWithDrawVal,
      servicePrice: serviceValue
    })
  },

  standardAmount: function (serValue) {
    
    var value = serValue+"";
    var serVal = value.split(".");
    if (serVal.length >= 2) {
      if (serVal[1] == "") {

      } else {
        serVal[1] = serVal[1].substring(0, 2);
      }

      return serVal[0] + "." + serVal[1];
    } else {

      return serVal[0];
    }

  },

  clickFullWithdrawal:function(){
    
    //扣除手续费后的余额
    this.data.inputWithDrawVal = Math.ceil(this.data.withdrawVal / 1.02) ;
    //扣除的手续费
    var serviceValue = this.standardAmount((this.data.withdrawVal - this.data.inputWithDrawVal)/100);
    this.setData({
      isClickAllWithdraw: true,
      inputWithDrawVal: this.data.inputWithDrawVal,

      priceValue: this.data.inputWithDrawVal,
      servicePrice: serviceValue
    })
  },


  clickWithdrawBtn: function () {
    
    if (this.data.inputWithDrawVal == 0) {
      wx.showToast({
        title: '请输入提现金额',
      })
      return;
    }

    if (this.data.inputWithDrawVal/100 <= 0.5) {
      wx.showToast({
        title: '金额不低于0.5',
      })
      return;
    }

    if (this.data.inputWithDrawVal / 100 > 200) {
      wx.showToast({
        title: '金额高于200',
      })
      return;
    }

    if ((this.data.inputWithDrawVal) > this.data.withdrawVal) {
      wx.showToast({
        title: '金额输入有误',
      })
      return;
    }

    app.post(constant.WITH_DRAW, 
    { 
      //提现金额 + 手续费 
      money: this.data.inputWithDrawVal,
      // order_name: "提现",
      //type: 1, //简单人脉传1，点睛号编辑器2
    },
    (res)=>{
       console.log("提现返回：", res);
       if (res.data.error_code == 0) {
         wx.showToast({
           title: '提现已申请',
         })
         
         wx.setStorageSync("MONEY", res.data.data),

         this.setData({
           isClickAllWithdraw: false,
           withdrawVal: res.data.data,

         })

         setTimeout(() => {
           wx.navigateBack({
             delta:1,
           })
         }, 1000);

      } else if(res.data.error_code != 0) {
        wx.showToast({
          title: res.data.mssage,
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