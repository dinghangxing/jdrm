var app = getApp();
const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');
var ActiveStatus = require('../../business/ActiveStatus.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '全部抽奖',
    barBg: '#ffffff',
    color: '#000',
    isLoadFinish: false,

    currentTab: 0,
    lotteryActiveList: [],
    lotteryPage:0,
    lotteryMore:true,

    hadOverActiveList: [],
    hadOverPage: 0,
    hadOverMore: true,

    size:10
  },

  getLotteryActiveList: function () {
    if (!this.data.lotteryMore) {
      return;
    }
    this.data.lotteryPage++;

    app.post(
      constant.MY_JOIN_ACTIVE,
      {
        page: this.data.lotteryPage,
        size: this.data.size,
        status: ActiveStatus.LOTTERY
      },
      (res) => {
        console.log("全部抽奖待开奖返回：",res);
        var list = res.data.data.active_list;
        if (list.length < this.data.size) {
          this.setData({
            lotteryMore: false,
            page: this.data.lotteryPage,
          });
        }
        list = this.data.lotteryActiveList.concat(list);
        for(var obj of list){
          obj.nickname = app.base64Decode(obj.nickname);
        }
        this.setData({
          lotteryActiveList: list,
          isLoadFinish: true,
        });

      });
  },

  getHadOverActiveList: function () {

    if (!this.data.hadOverMore) {
      return;
    }
    this.data.hadOverPage++;

    app.post(
      constant.MY_JOIN_ACTIVE,
      {
        page: this.data.hadOverPage,
        size: this.data.size,
        status: ActiveStatus.HAD_OVER
      },
      (res) => {
        console.log("全部抽奖已结束返回：", res);
        var list = res.data.data.active_list;
        if (list.length < this.data.size) {
          this.setData({
            hadOverMore: false,
            page: this.data.hadOverPage,
          });
        }
        list = this.data.hadOverActiveList.concat(list);
        for(var obj of list){
          obj.nickname = app.base64Decode(obj.nickname);
        }
        this.setData({
          hadOverActiveList: list
        });

      });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLotteryActiveList();
    this.getHadOverActiveList();

   
  },

  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,

    });
  },

  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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