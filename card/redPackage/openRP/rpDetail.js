// card/redPackage/openRP/rpDetail.js
const app = getApp();

const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '红包福利',
    barBg: '#F45E4D',
    color: '#fff',

    receiveRedList: [],
    joinList: [],
    page: 0,
    size: 10,
    hasMore: true,

    userAvatarUrl: "",
    userNickName: "",
    amount: 0,
    checkFlDetail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var joinList = wx.getStorageSync("JOIN_LIST");
    joinList.nickname = joinList.nickname;
    //app.base64Decode(joinList.nickname);

    this.data.luckyID = joinList.active_id;

    this.setData({
      joinList: joinList,

    })

    this.data.checkFlDetail = wx.getStorageSync("CHECK_FL_DETAIL_FROM_MY_FL");
    if (this.data.checkFlDetail == "check_fl_detail") {
      //我的福利中，点击查看详情页面
      
      this.getGrabRPList();
    } else {
      //抢红包
      
      this.data.checkFlDetail = null;
      this.openRP();
      this.getGrabRPList();
    }

    
  },

  checkFlDetail:function(data){
    
    this.setData({
      checkFlDetail: this.data.checkFlDetail,
      amount: data.money,
      totalRPCount: data.total,
      remainCount: data.remain_num,
    })
  },

  openRP: function() {

    app.post(constant.GET_LUCKY, {
      lucky_id: this.data.luckyID,
    }, (res) => {
      console.log("抢红包返回：", res);

      if (res.data.error_code == 0) {
        this.setData({
          amount: res.data.data.money,
          totalRPCount: res.data.data.total,
          remainCount: res.data.data.remain_num,
        })
      }
    });
  },

  getGrabRPList: function() {
    if (!this.data.hasMore) {
      return;
    }
    this.data.page++;

    app.post(constant.GRAB_RED_PACKAGE, {
        page: this.data.page,
        size: this.data.size,
        lucky_id: this.data.luckyID,
      },
      (res) => {
        console.log("查看用户抢红包纪录:", res);

        if (res.data.error_code == 0) {

          if (this.data.page == 1) {
            this.checkFlDetail(res.data.data.my_lucky_detail);
          }

          var list = res.data.data.users;
          if (list.length < this.data.size) {
            this.setData({
              hasMore: false,
              page: this.data.page,
            });
          }

          var dataList = this.data.receiveRedList.concat(list);
          for (var obj of dataList) {
            obj.nickname = app.base64Decode(obj.nickname);
          }
          this.setData({
            receiveRedList: dataList,

          })

        } else {
          wx.showToast({
            title: res.data.mssage,
          })
        }

      });
  },

  clickRPRecord: function() {
    wx.navigateTo({
      url: '/my/pages/redReceive/redReceive',
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

  clear:function(){
    if (this.data.checkFlDetail != null && this.data.checkFlDetail == "check_fl_detail") {
      wx.setStorageSync("CHECK_FL_DETAIL_FROM_MY_FL", null);
    }
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
    this.clear();
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
    this.getGrabRPList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})