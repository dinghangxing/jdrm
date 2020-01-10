// pages/login/login.js
const constant = require("../../util/constant.js");
const base64 = require("../../util/base64.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '登录',
    barBg: '#EB654F',
    color: '#fff',

    height: 0,
    width: 0,

    animationData: {},
    animationIntervalId: 0,
    deviceMode: "android",
  },

  getUserInfo: function() {
   

    var self = this;
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = res.userInfo;

        wx.setStorageSync("NICK_NAME", res.userInfo.nickName);
        wx.setStorageSync("USER_IMAGE", res.userInfo.avatarUrl);


        this.login().then(() => {
          //更新用户信息
          this.updataUserInfo(res);
          //获取的我名片
          this.getMyCard();
        });

      },
      fail: res => {

        wx.showModal({
          title: '警告',
          content: '您还未授权获取微信信息！',
          showCancel: false,
          success: res => {

            this.animationAuthBtn();
          }
        })

      }
    })


  },

  login: function() {
    var self = this;
    wx.showLoading({
      title: '授权登录中',
    });
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            //发起网络请求
            console.log(res);

            app.post(constant.AUTH_LOGIN, {
              code: res.code
            }, function(res) {
              console.log('登录结果返回！', res);
              if (res.data.error_code == 0) {
                wx.setStorageSync("openid", res.data.data.openid);
                wx.setStorageSync("session_key", res.data.data.session_key);
                wx.setStorageSync("token", res.data.data.token);
                wx.setStorageSync("user_id", res.data.data.user_id);

                resolve();
              } else {
                self.loginFailed();
              }
            });

          } else {
            
            self.loginFailed();
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    });
  },

  loginFailed:function(){
    
    wx.showModal({
      title: '提示',
      content: '登录失败!',
      showCancel: false,

    })

    wx.hideLoading();
  },

  updataUserInfo: function(res) {
  
    //更新用户信息
    app.post(
      "User/updateUserInfo", {
        nickname:base64.encode(res.userInfo.nickName),
        icon: res.userInfo.avatarUrl
      },
      function() {
        wx.navigateBack({
          delta: 1
        })
      }
    );
  },

  //获取的我名片
  getMyCard: function() {
    app.post(
      "Card/getMyCardStatus", {},
      (res) => {

        if (res.data.error_code != 0) {
          wx.setStorageSync("CARD_ID", 0);
          return;
        }

        if (res.data.data.card_info) {
          var card = res.data.data.card_info;
          wx.setStorageSync("CARD_ID", card.id);
        } else {
          wx.setStorageSync("CARD_ID", 0);
        }


      }
    );
  },

  animationAuthBtn: function() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      delay: 0,
    })

    this.animation = animation
    // this.setData({
    //   animationData: animation.export()
    // })

    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    this.data.animationIntervalId = setInterval(function() {
      n = n + 1;
      var i = n % 2;
      if (i == 0) {
        animation.scale(0.8, 0.8).step();
        //animation.scaleZ(2).rotateY(0).step();
      } else {
        animation.scale(1, 1).step();
        //animation.scaleZ(2).rotateY(45).step();
      }

      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 300);

  },

  /**
   * 停止旋转
   */
  stopAnimationInterval: function() {
    var animationId = this.data.animationIntervalId;
    if (animationId > 0) {
      clearInterval(animationId);
      this.data.animationIntervalId = 0;
    }
  },

  clickAuthBtn: function() {
    this.stopAnimationInterval();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      deviceMode: app.jumpDeviceMode(),
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
    this.animationAuthBtn();
  },

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
  onShareAppMessage: function() {

  }
})