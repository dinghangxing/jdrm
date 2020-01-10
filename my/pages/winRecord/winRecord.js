// pages/my/winRecord/winRecord.js

var app = getApp();
const constant = require("../../../util/constant.js");
var ActiveStatus = require('../../business/ActiveStatus.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '中奖记录',
    barBg: '#ffffff',
    color: '#000',
    isLoadFinish: false,
    
    winRecordList:[],
    page:0,
    size:10,
    more:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   

    this.getWinRecordList();
  },

  getWinRecordList:function(){

    if (!this.data.more) {
      return;
    }
    this.data.page++;

    app.post(
      constant.MY_WIN_ACTIVE,
      {
        page: this.data.page,
        size: this.data.size
      },
      (res) => {
        var list = res.data.data.active_list;
        if (list.length < this.data.size) {
          this.setData({
            more: false,
            page: this.data.page,
          });
        }
        list = this.data.winRecordList.concat(list);
        for(var obj of list){
          obj.nickname = app.base64Decode(obj.nickname);
        }
        this.setData({
          winRecordList: list,
          isLoadFinish: true,
        });

      });
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