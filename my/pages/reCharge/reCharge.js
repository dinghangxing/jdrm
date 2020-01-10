// my/pages/reCharge/reCharge.js
var app = getApp();
const constant = require("../../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '余额充值',
    barBg: '#ffffff',
    color: '#000',

    value: 0,
    oldPrice: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.oldPrice = wx.getStorageSync("MONEY");
    console.log("原有余额：" ,this.data.oldPrice);
  },

  //实时搜索框文本内容显示
  inputBind: function (e) {
    this.data.value = e.detail.value;
  },


  clickRechargeBtn:function(){
    if (this.data.value == 0) {
      wx.showToast({
        title: '请输入充值金额',
      })
      return;
    }
 
    app.post(constant.RECHARGE,
      {
        total_fee: this.data.value*100,
        order_name:"充值",

      }, (res) => {
        console.log("充值返回：", res);
        
        if (res.data.error_code != 0) {
          wx.showToast({
            title: res.data.mssage,
          })
          return;
        }

        var self = this;
        var data = res.data.data.pay_info;
        var outTradeNo = res.data.data.out_trade_no;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success(res) {
         
            self.sureSuccessCallBack(outTradeNo);
            
          },
          fail(res) {
            wx.showToast({
              title: '充值失败！',
              icon: "none"
            })
          }
        })

      });
  },

  sureSuccessCallBack: function (outTradeNo){

    app.post(constant.PAY_CALL_BACK,
      {
        out_trade_no: outTradeNo,

      }, (res) => {
        console.log("充值确认成功返回：", res);
    
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '充值成功！'
          })
        
          wx.setStorageSync("MONEY", res.data.data.balance);
          
          wx.navigateBack({
            delta:1,
          })
        
        } else {
          
          wx.showToast({
            title: res.data.mssage,
          })
        }
      }
    )
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