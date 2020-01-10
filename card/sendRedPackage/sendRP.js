// card/sendRedPackage/sendRP.js
var app = getApp();
const constant = require("../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '发红包',
    barBg: '#ffffff',
    color: '#000',
    //showTopToast: false,
    showMoreThan:false,
    showLessOne:false,

    showTopText: "单个红包金额不可超过1000元",
    type: 2, //1：普通红包 ； 2：拼手气红包
    currentRPText: "拼手气红包",
    synChecked: true,
    // receiveLimitCheck: false,
    // receiveLimitSelect: "已互存名片",
    contactLimit: 0, //0 不限 1已存 5互存

    amount: 0,
    rpCount: 0,
    defaultText: "万事如意，多福多金",
    userBalanceSelectType: 1,
    balance: 0,
    totalAmount: 0,
    deviceMode:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initShow();
    this.loadBalance();
    this.setData({
      deviceMode: app.jumpDeviceMode(),
    })
  },

  initShow: function() {
    this.setData({
      showMoreThan: false,
      showLessOne: false,
      
      amount:null,
      type: 2,
      currentRPText: "拼手气红包",
      modifyRPText: "普通红包",

    })
  },

  loadBalance: function() {
    app.post(constant.CHECK_BALANCE, {}, (res) => {
      console.log("查询余额返回：", res);
      var data;
      if (res.data.error_code == 0) {
        data = res.data.data;
      } else {
        data = 0;
      }

      this.setData({
        balance: data,
      })
    });
  },

  modifyCurrentRPStatus: function(e) {

    var str1, str2, modifyType;
    var total = 0;
    var currentType = this.data.type;

    if (currentType == 2) {
      modifyType = 1;
      str1 = "普通红包";
      str2 = "拼手气红包";
      total = this.data.amount * this.data.rpCount;

      this.balanceCompare(1, this.data.amount, this.data.rpCount);

    } else if (currentType == 1) {
      modifyType = 2;
      str1 = "拼手气红包";
      str2 = "普通红包";
      total = this.data.amount;
      

      //if (this.data.rpCount > 0) {
        //this.balanceCompare(2, total, this.data.rpCount);
      //} 
      this.balanceCompare(2, total, this.data.rpCount);
    }

    var totalPrice = this.getTypePrice(total);
    totalPrice = this.standardAmount(totalPrice);
    this.setData({
      type: modifyType,
      currentRPText: str1,
      modifyRPText: str2,
      totalAmount: totalPrice,
    })
  },

  getTypePrice:function(total){
   
    var isHaveDian = false;
    total = total + "";

    var totalArr = total.split(".");
    if (totalArr.length > 1) {
      isHaveDian = true;
    }
    
    if (isHaveDian) {
      return total;
    }else {
      return total + ".00";
    }
  },

  inputPriceBind: function(e) {

    //取得标准的金额数量
    this.data.amount = this.standardAmount(e.detail.value);

    var total = this.data.amount;

    if (total == 0) {
      this.setData({
        totalAmount: 0,
      })
      return;
    }

    var currentType = this.data.type;
    if (currentType == 1) {
      //普通红包
      this.balanceCompare(currentType, total, 0);

      if (this.data.rpCount > 0) {
        var totalPrice = this.getTypePrice(total * this.data.rpCount);
        totalPrice = this.standardAmount(totalPrice);
        this.setData({
          totalAmount: totalPrice,
        })
      }

    } else {
      var count = this.data.rpCount;
      if (count == 0) {
        if (total < 1) {
          this.setData({
            showMoreThan: false,
            showLessOne: true,
          })
        } else if (total >= 1000) {

        } 

      } else {
        this.balanceCompare(currentType, total, count);
        
      }
     
      var totalPrice = this.getTypePrice(this.data.amount);
      this.setData({
        amount: this.data.amount,
        totalAmount: totalPrice,
      })
    }
  },

  standardAmount:function(amount){

    var totalVal = amount.split(".");
    if (totalVal.length >= 2) {
      if (totalVal[1] == "") {

      } else {
        totalVal[1] = totalVal[1].substring(0, 2);
      }

      return totalVal[0] + "." + totalVal[1];
    } else {

      return parseInt(totalVal[0]);
    }
    
  },

  inputRPCountBind: function(e) {
    var count = 0;
    if (e.detail.value == "") {
      count = 0;
    } else {
      count = parseInt(e.detail.value);
    }
    var currentType = this.data.type;
    var total = 0;

    if (currentType == 2) {
      total = this.data.amount;
      this.balanceCompare(currentType, total, count);
     
    } else if (currentType == 1) {
      //普通红包
      total = this.data.amount * count;
    }

    this.data.rpCount = count;

    var totalPrice = this.getTypePrice(total);
    totalPrice = this.standardAmount(totalPrice);
    this.setData({
      totalAmount: totalPrice,
    })
  },

  balanceCompare: function(currentType, amount, count) {
    
    if (currentType == 2) {
      if (count == 0) {
        this.setData({
          showMoreThan: false,
          showLessOne: false,
        })

        return;
      }
      //拼手气红包
      if (amount / count > 1000) {
        this.setData({
          amount:amount,
          showMoreThan: true,
          showLessOne: false,
        
        })
      } else if (amount / count < 1) {
        this.setData({
          amount: amount,
          showMoreThan: false,
          showLessOne: true,
         
        })
      } else {
        this.setData({
          amount: amount,
          showMoreThan: false,
          showLessOne: false,
         
        })
      }
    } else if (currentType == 1) {
      if (amount >= 1000) {
        this.setData({
          amount: amount,
          showMoreThan: true,
          showLessOne: false,
         
        })
      } else if (amount < 1) { //1
        this.setData({
          amount: amount,
          showMoreThan: false,
          showLessOne: true,
        
        })
      } else {
        this.setData({
          amount: amount,
          showMoreThan: false,
          showLessOne: false,

        })
      }
    }
  },

  inputDefaultTextBind: function(e) {
    if (e.detail.cursor == 20) {
      wx.showToast({
        title: '限制20个字符',
      })
      return;
    }
    this.data.defaultText = e.detail.value;
    this.setData({
      defaultText: this.data.defaultText,
    })
  },

  synToCar: function(e) {
    var check = e.detail.value;
    this.setData({
      synChecked: check,
    })
  },

  radioChange: function(e) {
    var radioSelect = e.detail.value;
    var str;
    //0 不限 1已存 5互存
    if (radioSelect == 1) {
      str = "已互存名片";
      this.data.contactLimit = 5;
    } else if (radioSelect == 2) {
      str = "已存我的名片";
      this.data.contactLimit = 1;
    } else if (radioSelect == 3) {
      str = "不限";
      this.data.contactLimit = 0;
    }

    // this.setData({
    //   receiveLimitSelect: str,
    // })

  },

  checkboxChange: function(e) {
    var userBalanceSelect = e.detail.value;
    //勾选了余额优先并且余额大于等于所发的金额
    //1：优先使用余额； 0： 是不使用余额
    //&& this.data.balance >= this.data.amount
    if (userBalanceSelect == true) {
      this.data.userBalanceSelectType = 1;
    } else {
      this.data.userBalanceSelectType = 0;
    }

  },

  //塞钱进红包
  sendIntoRedPackage: function() {

    if (this.data.amount == null || this.data.amount == 0) {
      wx.showToast({
        title: '金额不能为空',
      })

      return;
    }

    if (this.data.rpCount == 0) {
      wx.showToast({
        title: '请输入红包个数',
      })
      return; 
    }

    if (this.data.showMoreThan || this.data.showLessOne) {
      //红包不符合规范，不与发送
      wx.showToast({
        title: '请重新输入金额',
      })
      return;
    }

    var totalAmount = this.data.totalAmount;
  
    app.post(constant.LUCKY_CREATE, {
      lucky_type: this.data.type,
      total_amounts: totalAmount * 100,
      total_num: this.data.rpCount,
      info: this.data.defaultText,
      is_sync: this.data.synChecked ? 1 : 0,
      contact_limit: this.data.contactLimit,
      balance_first: this.data.userBalanceSelectType,

    }, (res) => {
      console.log("发起红包返回：", res);
      if (res.data.error_code != 0) {
        wx.showToast({
          title: '红包福利发起失败',
        })
        return;
      }
      //使用余额 发起的红包福利返回，
      // if (this.data.userBalanceSelectType == 1){
      // } else {
      //0： 不使用余额，直接支付发起红包福利
      var self = this;
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
              title: '红包福利发起失败',

            })
          }
        })
      } else {
        this.requestReturn(res);
      }
      //  }

    });
  },

  requestReturn: function(res) {

    //wx.setStorageSync("MONEY", res.data.data.num);
    wx.showToast({
      title: '发送成功',
    })

    var deltaN = 0;
    if (this.data.synChecked) {
      deltaN = 100;
    } else {
      deltaN = 0;
    }

    setTimeout(function() {
      wx.navigateBack({
        delta: deltaN,
      })
    }, 500);
  },

  sureCallBack: function(outTradeNo) {

    app.post(constant.PAY_CALL_BACK, {
      out_trade_no: outTradeNo
    }, (res) => {
      console.log("红包福利发起确认返回：", res);

      if (res.data.error_code == 0) {
        this.requestReturn(res);

      } else {
        wx.showToast({
          title: '红包福利发起失败',
        })
      }

    });
  },

  receiveLimitTipsBtn:function(){
    wx.showModal({
      title: '领取限制',
      content: '开启后，不满足对应条件的，将不允许领取您的红包福利。',
      showCancel:false,
    })
  },

  synCarTipsBtn: function () {
    wx.showModal({
      title: '同步到名片',
      content: '开启后，您本次发起的福利会显示在您的名片上，方便您进行推广。',
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