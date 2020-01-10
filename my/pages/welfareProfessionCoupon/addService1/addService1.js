// my/pages/welfareProfessionCoupon/addService/addService.js
var app = getApp();
const constant = require("../../../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '增值服务',
    barBg: '#ffffff',
    color: '#000',

    buyUseCouponList: [],
    buyStrongCouponList: [],

    addServiceArr: ["无广告", "开启口令抽奖功能", "开启组队抽奖功能", "可发起一、二、三等奖", "奖品数量提升至1000", "用户可以一键复制发起人微信号，公众号强力吸粉"],

    isClickItemCoupon: false,
    productId: 0,
    productName: "",
    balance: 0,
    amount: 0,
    userBalanceSelectType: 1,
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTotal();
    this.loadTicketProducts();
    this.loadStrongProducts();
    
  },

  loadTicketProducts:function(){
    app.post(constant.TICKET_GET_PRODUCTS, {},
      (res) => {
        console.log("专业券张数返回:", res);

        if (res.data.error_code == 0) {
          var data = res.data.data;
          for (var i in data) {

            //中间的默认选中
            if (i == 1) {
              data[i].selected = true;
              this.data.productId = data[i].p_id;
              this.data.productName = data[i].p_name;
              this.data.amount = data[i].p_value;
            } else {
              data[i].selected = false;
            }
          }

          this.setData({
            balance: wx.getStorageSync("MONEY"),
            buyUseCouponList: data,
          })
        }

      }
    );
  },

  loadStrongProducts: function () {
    app.post(constant.TICKET_GET_PRODUCTS, {},
      (res) => {
        console.log("强推版福利购买数据返回:", res);

        if (res.data.error_code == 0) {
          var data = res.data.data;
          for (var i in data) {
            data[i].selected = false;
            
          }

          this.setData({
            balance: wx.getStorageSync("MONEY"),
            buyStrongCouponList: data,
          })
        }

      }
    );
  },

  clickBuyCoupon: function(e) {
    var id = e.currentTarget.dataset.id;

    var list = this.data.buyUseCouponList;
    for (var i = 0; i < list.length; i++) {
      if (id == i) {
        list[i].selected = true;
        this.data.productId = list[i].p_id;
        this.data.productName = list[i].p_name;
        this.data.amount = list[i].p_value / 100;
      } else {
        list[i].selected = false;
      }
    }

    var list2 = this.data.buyStrongCouponList;
    for (var i in list2) {
      list2[i].selected = false;
    }

    this.setData({
      buyUseCouponList: list,
      buyStrongCouponList: list2,
    })
  },

  clickBuyStrongCoupon:function(e){
    var id = e.currentTarget.dataset.id;

    var list = this.data.buyStrongCouponList;
    for (var i = 0; i < list.length; i++) {
      if (id == i) {
        list[i].selected = true;
        this.data.productId = list[i].p_id;
        this.data.productName = list[i].p_name;
        this.data.amount = list[i].p_value / 100;
      } else {
        list[i].selected = false;
      }
    }

    var list2 = this.data.buyUseCouponList;
    for (var i in list2) {
      list2[i].selected = false;
    }


    this.setData({
      buyUseCouponList: list2,
      buyStrongCouponList: list,
    })
  },

  checkboxChange: function(e) {
    var userBalanceSelect = e.detail.value;

    //勾选了余额优先并且余额大于等于所发的金额
    if (userBalanceSelect == true && this.data.balance >= this.data.amount) {
      this.data.userBalanceSelectType = 1;
    } else {
      this.data.userBalanceSelectType = 0;
    }
  },

  ticketRightBuy: function(e) {
    var self = this;
    app.post(constant.TICKET_RIGHT_BUY, {
        p_id: this.data.productId,
        order_name: this.data.productName,
        balance_first: this.data.userBalanceSelectType,
      },
      (res) => {
        console.log("立即购买返回：", res);
     
        if (res.data.error_code != 0) {
          wx.showToast({
            title: '支付失败',
            icon:"none"
          })
          return;
        }

        //使用余额 发起的红包福利返回，
        // if (this.data.userBalanceSelectType == 1) {
        //   this.requestReturn(res);
        // } else {
        //0： 不使用余额，直接支付发起红包福利
        var payInfo = res.data.data.pay_info;
        var outTradeNo = res.data.data.out_trade_no;
        if (payInfo != null) {
          wx.requestPayment({
            timeStamp: payInfo.timeStamp,
            nonceStr: payInfo.nonceStr,
            package: payInfo.package,
            signType: payInfo.signType,
            paySign: payInfo.paySign,
            success(res) {
              self.sureCallBack(outTradeNo);
            },
            fail(res) {
              wx.showToast({
                title: '支付失败！',
                icon: "none"
              })
            }
          })
        } else {
          this.requestReturn(res);
        }
      });
  },

  requestReturn: function(res) {

    wx.setStorageSync("PRO_TICKET_NUM", res.data.data.num);
    wx.setStorageSync("MONEY", res.data.data.balance);
    debugger
    wx.showToast({
      title: "您已成功购买",
    })

    setTimeout(function() {
      wx.navigateBack({
        delta: 1,
      })
    }, 1000);
  },

  sureCallBack: function(outTradeNo) {

    app.post(constant.PAY_CALL_BACK, {
      out_trade_no: outTradeNo
    }, (res) => {
      console.log("充值回调确认返回：", res);

      if (res.data.error_code == 0) {

        this.requestReturn(res);

      } else {
        wx.showToast({
          title: '购买失败',
          icon: "none"
        })
      }

    });
  },

  getTotal: function () {
    app.post(
      "Info/getActiveNum",
      {},
      (res) => {
        this.setData({
          total: res.data.data.pro_num
        });
      },
      false
    );
  },

  limitTimedisBtn: function () {
    wx.showModal({
      title: '限时折扣',
      content: 'xxxxxxxxxxxxxxxxxxx。',
      showCancel: false,
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
    wx.setStorageSync("IS_PWLFARE_PRO_UI_CLOSE", true);
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