// my/pages/redRecord/redRecord.js
const app = getApp();
const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '发出的红包',
    barBg: '#F45E4D',
    color: '#fff',

    sendRedList:[],
    sendTotal:[],
    page: 0,
    size: 10,
    hasMore: true,
    userAvatarUrl: "",
    userNickName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nickName = wx.getStorageSync("NICK_NAME");
    var avatarUrl = wx.getStorageSync("USER_IMAGE");
    this.setData({
      userNickName: nickName,
      userAvatarUrl: avatarUrl,
    })

    this.getSendRedList();
  },

  getSendRedList:function() {
  
    if (!this.data.hasMore) {
      return;
    }
    this.data.page++;

    //type 1发出去红包 2 收到红包
    app.post(constant.USER_GET_LUCKY_HIS, 
    {
      page: this.data.page,
      size: this.data.size,
      type: 1,
    },
      (res) => {
        console.log("发出的红包纪录:", res);

        if (res.data.error_code == 0) {

          var list = res.data.data.history;
          if (list.length < this.data.size) {
            this.setData({
              hasMore: false,
              page: this.data.page,
            });
          }

          //list = res.data.data.history;

          var dataList = this.data.sendRedList.concat(list);
          var total = res.data.data.total_data;

          this.setData({
            sendTotal: total,
            sendRedList: dataList,
          })

        } else {
          wx.showToast({
            title: res.data.mssage,
          })
        }

      });
  },

  clickReceiveRed:function(e){
    wx.navigateTo({
      url: '/my/pages/redReceive/redReceive',
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
    this.getSendRedList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})