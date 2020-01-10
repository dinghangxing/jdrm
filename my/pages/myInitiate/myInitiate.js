// pages/my/myInitiate/myInitiate.js

const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');
var ActiveStatus = require('../../business/ActiveStatus.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '发起抽奖',
    barBg: '#ffffff',
    color: '#000',

    isLoadFinish: false,

    currentTab: 1,

    submitActiveList: [],
    submitPage:0,
    submitMore:true,

    releaseActiveList: [],
    releasePage:0,
    releaseMore:true,

    lotteryActiveList: [],
    lotteryPage:0,
    lotteryMore:true,

    hadOverActiveList: [],
    hadOverPage:0,
    hadOverMore:true,

    size:10,


 
  },
  //获取已提交的活动列表
  getSubmitActiveList:function(){
    if (!this.data.submitMore){
      return;
    }
    this.data.submitPage++;

    app.post(
      constant.MY_ACTIVE, 
      {
        page: this.data.submitPage,
        size:this.data.size,
        status: ActiveStatus.SUBMIT
      }, 
     (res) => {
       console.log("已提交：", res);
  
      
       var list = res.data.data.active_list;
       if (list.length < this.data.size){
         this.setData({
           submitMore:false,
           page: this.data.submitPage,
         });
       }
       list = this.data.submitActiveList.concat(list);
       for(var obj of list){
         obj.nickname = app.base64Decode(obj.nickname);
       }
        this.setData({
          submitActiveList:list,
          
        });

    });
  },
  //获取待发布的活动列表
  // getReleaseActiveList:function(){

  //   if (!this.data.releaseMore) {
  //     return;
  //   }
  //   this.data.releasePage++;

  //   app.post(
  //     constant.MY_ACTIVE,
  //     {
  //       page: this.data.releasePage,
  //       size: this.data.size,
  //       status: ActiveStatus.RELEASE
  //     },
  //     (res) => {
  //       var list = res.data.data.active_list;
  //       if (list.length < this.data.size) {
  //         this.setData({
  //           releaseMore: false
  //         });
  //       }
  //       list = this.data.releaseActiveList.concat(list);
  //       for(var obj of list){
  //         obj.nickname = app.base64Decode(obj.nickname);
  //       }
  //       this.setData({
  //         releaseActiveList: list
  //       });

  //     });
  // },
  //获取待开奖列表
  getLotteryActiveList:function(){
    if (!this.data.lotteryMore) {
      return;
    }
    this.data.lotteryPage++;
  
    app.post(
      constant.MY_ACTIVE,
      {
        page: this.data.lotteryPage,
        size: this.data.size,
        status: ActiveStatus.LOTTERY
      },
      (res) => {
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

  //获取已结束列表
  getHadOverActiveList: function () {
    if (!this.data.hadOverMore) {
      return;
    }
    this.data.hadOverPage++;

    app.post(
      constant.MY_ACTIVE,
      {
        page: this.data.hadOverPage,
        size: this.data.size,
        status: ActiveStatus.HAD_OVER
      },
      (res) => {
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
    this.getSubmitActiveList();
    //this.getReleaseActiveList();
    this.getLotteryActiveList();
    this.getHadOverActiveList();

   

   
  },


  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      hideBottom: true,
      currentTab: e.detail.current
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


  deleteLottery: function(e) {
   
    var self = this;
    var active_id = e.detail.active_id;
    app.post(constant.DELETE_LOTTERY_ACTIVE, {active_id}, function(res) {
     
      console.log("删除成功：", res);
      if (res.data.error_code == 1) {
        wx.showToast({
          title: '删除失败！',
          icon:"none"
        })
      } else {
        wx.showToast({
          title: '删除成功！',
        })
        self.refreshUi(active_id);
      }

    });
  },

  refreshUi: function(id) {
   
    var list = [];
    if (this.data.currentTab == 0) {
      list = this.data.submitActiveList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].active_id == id) {
          list.splice(i, 1);
          break;
        }
      }

      this.setData({
        submitActiveList: list,
      })

    } else if (this.data.currentTab == 1) {
      list = this.data.releaseActiveList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].active_id == id) {
          list.splice(i, 1);
        }
      }

      this.setData({
        releaseActiveList: list,
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
