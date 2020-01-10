// my/pages/welfareProfessionCoupon/addService/addService.js
var app = getApp();
const constant = require("../../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '增值服务',
    barBg: '#ffffff',
    color: '#000',

    index:1,
    useBalance:true,
    balance:0,
    products:[],
    p_id:18,
    product:null,
    total:0
    
  },

  buy:function(){
    
    for(var p of this.data.products){
      if(p.p_id == this.data.p_id){
        this.setData({
          product:p
        });
      }
    }
   
    //判断是否使用余额
    if (this.data.useBalance){
      //使用余额
      var offset = this.data.product.p_value - this.data.balance;
      if (offset > 0){
        this.recharge(offset);
      }else{
        this.toWelfare();
      }

    }else{
      //不使用余额
      this.recharge(this.data.product.p_value);
    }
  },

  toWelfare:function(){
    wx.setStorageSync("product",this.data.product);
    wx.redirectTo({
      url: '/welfare/pages/start/start?type=4',
    })
  },

  recharge:function(fee){
    app.post(
      constant.RECHARGE,
      {
        total_fee: fee,
        order_name: "购买强推版" + this.data.product.p_num + "天"
      },
      (res) => {
       
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
          success :(res) => {
           
           
            this.sureSuccessCallBack(outTradeNo);
          },
          fail(res) {
            wx.showToast({
              title: '充值失败！',
              icon: "none"
            })
          }
        })

       
      }
    );
  },

  sureSuccessCallBack: function (outTradeNo) {
   
    app.post(constant.PAY_CALL_BACK,
      {
        out_trade_no: outTradeNo,

      }, (res) => {
       
       
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '充值成功！'
          
          })

          
          this.toWelfare();
        

        } else {

          wx.showToast({
            title: res.data.mssage,
          })
        }
      }
    )
  },

  change: function (e) {
    var p_id = e.currentTarget.dataset.p_id;
    this.setData({
      p_id: p_id
    });
  },

  checkboxChange:function(e){
    this.setData({
      useBalance: !this.data.useBalance
    });
    console.log(this.data.useBalance);
  },

  //查询专业券
  getBalance: function () {
  
      app.post(
        constant.GET_MY_INFO,
        {},
        (res) => {
          
          this.setData({
            balance:res.data.data.money
          });
        }
      );
    

  },
  //获得产品
  getProducts:function(){
    app.post(
      "Shop/getTopProducts",
      {},
      (res) => {
        var list = res.data.data;
        for(var obj of list){
          obj.p_info = parseInt(obj.p_info);
        }
        this.setData({
          products:list
        });
      }
    );
  },

  getTotal:function(){
    app.post(
      "Info/getActiveNum",
      {},
      (res) => {
        this.setData({
          total: res.data.data.top_num
        });
      },
      false
    );
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBalance();
    this.getProducts();
    this.getTotal();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})