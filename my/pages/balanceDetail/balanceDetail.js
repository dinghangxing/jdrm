// my/pages/balanceDetail/balanceDetail.js
var app = getApp();
const constant = require("../../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '余额明细',
    barBg: '#ffffff',
    color: '#000',

    page: 0,
    size: 10,
    hasMore: true,
    dataList:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadRecordList();
    
  },

  loadRecordList:function(){
    if (!this.data.hasMore) {
      return;
    }
    this.data.page++;

    app.post(
      constant.USER_PAY_HISTORY,
      {
        page: this.data.page,
        size: this.data.size
      }, (res) => {
        console.log("余额明细列表：", res);
       
        if (res.data.error_code == 0) {

          var list = res.data.data;
          if (list.length < this.data.size) {
            this.setData({
              hasMore: false,
              page: this.data.page,
            });
          }

          var recordList = this.data.dataList.concat(list);

          this.setData({
            dataList: recordList,

          })

        } else {
          wx.showToast({
            title: res.data.mssage,
          })
        }
      }

    );
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
    this.loadRecordList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})