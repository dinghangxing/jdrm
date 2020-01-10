// pages/recommend/index/index.js
var app = getApp();
const constant = require("../../../util/constant.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '福利广场',
    barBg: '#ffffff',
    color: '#000',
    
    pageHidden:true,

    myJoin:[],
    pubActiveList: [],
    topActiveList: [],
    animationData:null,
    showModal:false,
    isShowViewInIos: true, 

    isTopTip:true,

    pubPage:0,
    pubSize:10,
    pubMore:true,


    isFirst:true,
    isShowTips:false,
  },

 

  getPubActiveList: function() {

    if (!this.data.pubMore){
      return;
    }
    this.data.pubPage ++;
    var self = this;
    app.post(
      "Active/getUnApplyActiveList", {
        page: this.data.pubPage,
        size: this.data.pubSize,
        status: 2,
        active_type: 3
      },
      (res) => {
       
        var list = res.data.data.active_list;
        for(var obj of list){
          obj.nickname = app.base64Decode(obj.nickname);
        }
        
        this.setData({
          pubActiveList: this.data.pubActiveList.concat(list)
        });
        if (list.length < this.data.pubSize){
          this.setData({
            pubMore: false,
           
          });
        }
      }
    );
  },
  //获取最后一页的专业版福利
  getLastPubActiveList:function(){
    app.post(
      "Active/getUnApplyActiveList",
      {
        page: this.data.pubPage,
        size: this.data.pubSize,
        status: 2,
        active_type: 3
      },
      (res) => {
        
        var list = res.data.data.active_list;
        for (var obj of list) {
          obj.nickname = app.base64Decode(obj.nickname);
        }
        if(list.length == this.data.pubSize){
          this.setData({
            pubMore: true

          });
        }

        for(var i = list.length - 1;i>=0;i--){
          var isHave = false;
          for (var item of this.data.pubActiveList){
            if(item.active_id == list[i].active_id){
              isHave = true;
            }
          }
          if (isHave){
            list.splice(i,1);
          }
        }
        this.setData({
          pubActiveList: this.data.pubActiveList.concat(list)
        });
      }
    );
  },

  getTopActiveList: function() {
    var self = this;
    return new Promise((resolve) => {
      app.post(
        "Active/getTopActiveList", {
          page: 1,
          size: 5,
          status: 2
        },
        function (res) {

          var list = res.data.data.active_list;
          for(var obj of list){
            obj.nickname = app.base64Decode(obj.nickname);
          }
          self.setData({
            topActiveList: list
          });
          resolve();
        }
      );
    });
    
  },
  getRandActiveList:function(){
    var self = this;
    return new Promise((resolve) => {
      app.post(
        "Active/getRandActiveList", {
        
          status: 2
        },
        function (res) {

          var list = res.data.data.active_list;
          for (var obj of list) {
            obj.nickname = app.base64Decode(obj.nickname);
          }
          self.setData({
            topActiveList: list
          });
          resolve();
        }
      );
    });
  },
  

  //显示对话框
  showModal: function () {
   
    
   
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    var heigth = this.data.windowHeight;

   
   
    animation.translateY(heigth).step();
    this.setData({
      animationData: animation.export(),
      showModal: true
    })

    animation.translateY(0).step();
    this.setData({
      animationData: animation.export()
    })



   
  },

  //隐藏对话框
  hideModal: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    var heigth = this.data.windowHeight;



    animation.translateY(heigth).step();
    this.setData({
      animationData: animation.export(),
      showModal: true
    })
     
     setTimeout(() => {
       this.setData({
         showModal: false
       });
     },200);
    

  
  },

  toBuyTop:function(){
    this.hideModal();
    wx.navigateTo({
      url: '/welfare/pages/buyTop/buyTop',
    })
  },

  getMyJoin:function(){
    return new Promise((resolve) => {
      app.post(
        constant.MY_JOIN_ACTIVE,
        {
          page: 1,
          size: 10,
          status: 2
        },
        (res) => {
        
          this.setData({
            myJoin: res.data.data.active_list
          });
          resolve();
        });
    });
   
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success:  (res) => {
        this.data.windowHeight = res.screenHeight;
      }
    })

    this.setData({
      isShowViewInIos: app.judgePhoneType(),
    })

    
    var IS_TOP_TIP = wx.getStorageSync("IS_TOP_TIP");
    if (IS_TOP_TIP === false){
      this.setData({
        isTopTip: false
      });
    }


    this.getRandActiveList().then(() => {
      this.setData({
        pageHidden: false
      });
    });


    this.getPubActiveList();

    
  },

  checkJoinList:function(){
    var flag = false;
    var joinedList = wx.getStorageSync("JOINED_LIST");
    if (!joinedList){
      return;
    }
    //apply_status
    for (var act of this.data.topActiveList){
      for (var active_id of joinedList){
        if (active_id == act.active_id){
          act.apply_status = 1;

          flag = true;
        }
      }
    }

    for(var i = this.data.pubActiveList.length - 1;i>=0;i--){
      var act = this.data.pubActiveList[i];
      for (var active_id of joinedList) {
        if (active_id == act.active_id) {
          this.data.pubActiveList.splice(i,1);

          flag = true;
        }
      }
    }



    if (flag){
      this.setData({
        topActiveList: this.data.topActiveList,
        pubActiveList:this.data.pubActiveList
      });
      wx.removeStorageSync("JOINED_LIST")
    }
   
  },

  copyGz:function(){
    wx.setClipboardData({
      data: "简单人脉",
      success(res) {
       
        wx.showToast({
          title: '简单人脉已复制',
        })
      }
    })
  },

  closeTopTip:function(){
    this.setData({
      isTopTip:false
    });
    wx.setStorageSync("IS_TOP_TIP", false);
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
    
    

    if(this.data.isFirst){
      
      this.data.isFirst = false;
    }else{
      this.getLastPubActiveList();
      this.checkJoinList();
    }
   
    

   // this.getMyJoin();
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

    this.getRandActiveList().then(function(){
      wx.stopPullDownRefresh()
    })
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("onReachBottom......");
    this.getPubActiveList();

    setTimeout(() => {
      this.setData({
        isShowTips: true,
      })
    }, 1000);
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (option) {
    
    if (option.from == "menu") {
      var titleText = "推荐简单人脉给您，来试试";
      var cardId = wx.getStorageSync("CARD_ID");
      
      var path = null;
      if (cardId != 0) {
        path = "/card/detail/detail?card_id=" + this.data.card_id + "&share=1";
      }

      return {
        title: titleText,
        path: path,
        imageUrl: "/img/share_aplet_img.png",
      }
    }
  }
})