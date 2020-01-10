// my/pages/privacy/privacy.js
var app = getApp();
const constant = require("../../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '设置',
    barBg: '#ffffff',
    color: '#000',

    isChecked1: false,
    setText: null,
    // isChecked2: false,
    //isChecked3: false,
  },

  setText: function (checked){
    if (checked) {
      this.data.setText = "(他人可直接保存我的名片)";
    } else {
      this.data.setText = "(联系方式需交换名片可见)";
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var checked1 = wx.getStorageSync("isChecked1");
    // var checked2 = wx.getStorageSync("isChecked2");
    // var checked3 = wx.getStorageSync("isChecked3");
    this.setText(checked1);

    this.setData({
      isChecked1: checked1,
      setText: this.data.setText,
      // isChecked2: checked2,
      // isChecked3: checked3,
    })
  },

  privateChange1: function(e) {
    var checked = e.detail.value;
    wx.setStorageSync("isChecked1", checked);

    //1 隐私 0 没隐私
    var publicCard = 0;
    if (checked) {
      publicCard = 1;
    } else {
      publicCard = 0;
    }
    app.post(constant.USER_PRIVACY, {
      public_card: publicCard,
    }, (res) => {
      console.log("隐私：", res);

      if (res.data.error_code == 0) {
        this.setText(checked);
        this.setData({
          isChecked1: checked,
          setText: this.data.setText,
        })
      }
    });

  },

  // privateChange2:function(e) {
  //   var checked = e.detail.value;
  //   wx.setStorageSync("isChecked2", checked);
  //   this.setData({
  //     isChecked2:checked,
  //   })
  // },

  // privateChange3: function (e) {
  //   var checked = e.detail.value;
  //   wx.setStorageSync("isChecked3", checked);
  //   this.setData({
  //     isChecked3:checked,
  //   })
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