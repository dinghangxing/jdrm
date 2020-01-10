// pages/recommend/detail/detail.js
const date = require("../../../util/date.js");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '福利详情',
    barBg: '#ffffff',
    color: '#000',

   
    actionHidden:true,
    isShowAct:false,
    //当前的活动
    active:{},
    //所有活动，活动列表
    list: [],
    catchTouchMoveEvent: 'catchtouchmove', // 禁止滑动事件名参数；当为null的时候，不会禁止滑动；
    isGetNext:true,
    isMore:true,
    page:0,

    hiddenKl:true,
    //输入的口令
    koulin: "",

    nickname:"",
    showShi:false,
    //获取二维码的次数
    getCodeNum:0,
    
    isSeries:false,
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    this.setData({
      nickname: wx.getStorageSync("NICK_NAME")
    });

  
    console.warn("options:", options);

    var active_id, invite_user_id;

    if (options.scene){
      //扫码进入
      var scene = decodeURIComponent(options.scene);
      var arr = scene.split("&");
      active_id = arr[0].split("=")[1];
      if (arr[1]){
        invite_user_id = arr[1].split("=")[1];
      }

      this.setData({
        isHome:true,
        
      });
      
    } else if (options.zf){
        //转发进入
      //活动ID
      active_id = options.active_id;
      //邀请者ID
      invite_user_id = options.invite_user_id;

      this.setData({
        isHome: true,
       
      });
    }else{
      //跳转
      //活动ID
      active_id = options.active_id;
      //邀请者ID
      invite_user_id = options.invite_user_id;

     
      if (options.series){
        this.setData({
          isSeries:true
        });
      }
    }
   
    this.setData({
      invite_user_id: invite_user_id ? invite_user_id : 0,
      active_id: active_id
    });

    this.getActive().then(() => {
      this.setData({
        list: [
          {
            active:this.data.active,
            is_more: true,
            invite_user_id: invite_user_id ? invite_user_id : 0
          }
        ]
      });
      //添加下一个活动
      this.addNextActive();
      this.setCurActive(this.data.active);
    });
    

    
    //导航栏自适应
    let systemInfo = wx.getSystemInfoSync();
    let reg = /ios/i;
    let pt = 20; //导航状态栏上内边距
    let h = 44; //导航状态栏高度
    if (reg.test(systemInfo.system)) {
      pt = systemInfo.statusBarHeight;
      h = 44;
    } else {
      pt = systemInfo.statusBarHeight;
      h = 48;
    }
    var listHeight = systemInfo.screenHeight - pt - h;
    this.setData({
      listHeight: listHeight
    });
   
  },

  

 

  /**
  * @func 向上滑动，滑动到底部的回调
  * @author zc
  * @params e 元素对象
  */
  lower(e) {
  
    this.data.component.showNextActive();
    
    if(!this.data.isSeries){
      return;
    }


   
    if (this.data.list[this.data.list.length - 1].is_more){

      this.setData({
        catchTouchMoveEvent: null
      })
    }else{
    
      this.setData({
        catchTouchMoveEvent: 'catchtouchmove'
      })
    }

 

    console.log('到底了', this.data.catchTouchMoveEvent)


  },

  upper:function(){
    this.setData({
      catchTouchMoveEvent: 'catchtouchmove'
    })
  },

  /**
   * @func 当页面切换临界点，未完全切换时候促发，此时往回滑动还是能还原的；此时屏蔽滑动事件，以防他往回滑动
   * @author zc
   * @params e 元素对象
   */
  swiperChange() {
    this.setData({
      catchTouchMoveEvent: 'catchtouchmove'
    })

    this.data.invite_user_id = null;

    this.setCurActive(this.data.list[this.data.list.length - 1].active);

    this.addNextActive();
   


  },

  /**
   * @func 禁止滑动
   * @author zc
   */
  catchtouchmove() {
    return false
  },

  //添加下一个活动
  addNextActive:function(){
    this.getNextActive().then((actives) => {
      if (actives.length == 0) {
        this.data.list[this.data.list.length - 1].is_more = false

        this.setData({
          list: this.data.list,
        
        })

      } else {

        this.data.list.push({
          active: actives[0],
          is_more: true
        });


        this.setData({
          list: this.data.list

        })
      }
    }).catch(() => {
      this.addNextActive();
    });
  },

  //获得活动详情
  getActive: function () {
    return new Promise((resolve) => {


      app.post(
        "Active/getActive",
        { active_id: this.data.active_id },
        (res) => {

          if (res.data.error_code != 0) {
            wx.showToast({
              title: res.data.mssage,
            })
            return;
          }
          var active = res.data.data;
          if (active.open_content) {
            try{
              active.open_content = JSON.parse(active.open_content);
            }catch(e){
              active.open_content = JSON.parse(decodeURIComponent(active.open_content));
              console.log(e);
            }
           
          } else {
            active.open_content = [];
          }
          console.warn("活动详情", res);

          active.nickname = app.base64Decode(active.nickname);
          this.setData({
            active: active
          });


          resolve();
        }
      );

    });

  },

  getNextActive(){
    return new Promise((resolve,reject) => {
      this.data.page ++;
      app.post(
        "Active/getUnApplyActiveList", {
          page: this.data.page,
          size: 1,
          status: 2,
          active_type:4
        },
        (res) => {
          
          var list = res.data.data.active_list;
          if(list.length == 0){
            resolve(list);
            return;
          }

          var active = list[0];
          

          active.nickname = app.base64Decode(active.nickname);
          if (active.open_content) {
           
            try {
              active.open_content = JSON.parse(active.open_content);
            } catch (e) {
              active.open_content = JSON.parse(decodeURIComponent(active.open_content));
              console.log(e);
            }


          } else {
            active.open_content = [];
          }

          var flag = false;
          for (var item of this.data.list) {
            if (item.active.active_id == active.active_id) {
              flag = true;
            }
          }
          
          if (flag){
          
            reject("重复了...");
           
            return;
          }
         
         
         
          resolve(list);
        }
      );
    });
  },
  
  //设置当前的活动
  setCurActive: function (active){
    
    //创建分享图
    this.createShareImg(active);
    //设置当前的活动
    this.setData({
      active: active,
      active_id:active.active_id
    });
    //保存当前组件对象
    this.data.component = this.selectComponent("#active_" + this.data.active.active_id); 
  },


  //下载图片
  getImageInfo: function (url) {

    return new Promise(resolve => {
      wx.getImageInfo({
        src: url,
        complete: res => {

          var cover_img = res.path;
          resolve(res.path);
        }
      })

    });

  },

  //创建分享图
  createShareImg: function (active) {
    this.data.active = active;
    var openStr = "";
    switch (this.data.active.open_type) {
      case 1:
        var str = this.data.active.open_date;
        //str = str.substring(0, str. lastIndexOf(":"));
        var time = date.dateFromString1(str);
        openStr = time + '自动开奖';
       
        break
      case 2:
        openStr = '达到' + this.data.active.open_users + '人，自动开奖';
      
        break
      case 3:
        openStr = "手动开奖";
       
        break
    }

    var width = 500;
    var height = 400;
    var param = {
      width: width,
      height: height,
      clear: true,
      views: [
        {

          type: "rect",
          background:"#FA7268",
          top: 0,
          left: 0,
          width: width,
          height: height
        },
        {

          type: "rect",
          background: "#fff",
          top: 10,
          left: 10,
          width: 480,
          height: 380
        },
        {
          type: "image",
          url: this.data.active.prize_img1,
          top: 10,
          left: 10,
          width: 480,
          height: 270
        },
        {
          type: 'text',
          content: this.data.active.prize_name1,
          fontSize: 28,
          color: "#000",
          textAlign: 'left',
          top: 290,
          left: 20,
          breakWord: true,
          MaxLineNumber: 1,
          width: 460,
         
        },

        {
          type: 'text',
          content: openStr,
          fontSize: 24,
          color: "#777",
          textAlign: 'left',
          top: 350,
          left: 20,
          breakWord: true,
          width: 460,

        }
      ]
    }

   this.setData({
     painting:param
   });


  },

  eventGetImage:function(e){
    
    this.setData({
      shareImg: e.detail.tempFilePath
    });

    
  },
  
  switchAction: function () {
    
    this.setData({

      actionHidden: !this.data.actionHidden
    });
    setTimeout(() => {
      this.setData({
        isShowAct: !this.data.isShowAct,

      });
    }, 50);
  },
  hideAction:function(){
   
    this.setData({
      actionHidden: true,
      isShowAct: false
    })
  },
  
  //跳到分享图
  toShare: function () {
    this.hideAction();
    wx.showLoading({
      title: '加载中',
    })
    var param = {};
    var scene = "a=" + this.data.active.active_id;
    if (this.data.invite_user_id) {
      scene += "&b=" + this.data.invite_user_id;
      param.scene = scene;
      param.page_url = "welfare/pages/detail/detail";

      app.getCodePicGroup(param).then((filePath) => {
        wx.setStorageSync("qrcode", filePath);
        wx.setStorageSync("active", this.data.active);

        wx.navigateTo({
          url: '../share/share?type=1',
        })
      });
    }else{
      param.scene = scene;
      param.page_url = "welfare/pages/detail/detail";
      app.getCodePic(param).then((filePath) => {
        wx.setStorageSync("qrcode", filePath);
        wx.setStorageSync("active", this.data.active);

        wx.navigateTo({
          url: '../share/share?type=1',
        })
      }).catch((res) => {
        this.data.getCodeNum ++;

        if (this.data.getCodeNum < 10){
          setTimeout(() => {
            wx.hideLoading()
            this.toShare();
          }, 1000);
        }else{
          wx.hideLoading();
          this.data.getCodeNum = 0;


          wx.setStorageSync("qrcode", "/img/main-qrcode.jpg");
          wx.setStorageSync("active", this.data.active);

          wx.navigateTo({
            url: '../share/share?type=1',
          })
        }
        
        
      });
    }
    
  },
  
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    
    this.hideAction();
   
    

    var path = "/welfare/pages/detail/detail?active_id=" + this.data.active.active_id;
    if (this.data.invite_user_id){
      path += "&invite_user_id=" + this.data.invite_user_id;
    }
    path += "&zf=1";
    
  
    return {
      title: app.globalData.userInfo.nickName + '邀请你参加[' + this.data.active.prize_name1 + ']抽奖',
      path: path,
      imageUrl: this.data.shareImg
    }
  },

  openKl: function () {
    
    this.setData({
      hiddenKl: !this.data.hiddenKl
    });
  },

  koulinInput: function (e) {
    var val = e.detail.value;
    this.setData({
      koulin: val
    });

  },

  confirmkL: function (e) {
    
    if (this.data.koulin == this.data.active.active_key) {
      this.openKl();
      this.data.component.submitJoinActive();
    
    } else {
      wx.showToast({
        icon: "none",
        title: '口令不正确'
      });
    }
  },

  onPageScroll:function(e){
    console.log(e);
  },

 
  showShi:function(){
    
     const animation = wx.createAnimation({
        duration: 400
      })

    animation.scale(0.5, 0.5).step();
    
    
    this.setData({
      showShi:true,
      shiAniData: animation.export()
    });

   
    setTimeout(() => {
      animation.scale(1, 1).step();
      this.setData({

        shiAniData: animation.export()
      });
    },10);

    
    
  },

  hideShi:function(){
    this.setData({
      showShi: false
    });
  },

  toLiao:function(){
    wx.navigateTo({
      url: '../start/start?type=2',
    })
  },

  setWishData:function(e){
    //this.triggerEvent("setWishData", { isWin: this.data.isWin, win_lev: this.data.win_lev, ref_id: this.data.ref_id });
    this.setData({
      isWin:e.detail.isWin,
      win_lev: e.detail.win_lev,
      ref_id:e.detail.ref_id,
      winPrizeList: e.detail.winPrizeList
    });
  },

  chooseAddress:function(){
    this.data.component.chooseAddress();
  },

  flaunt:function(){
    this.data.component.flaunt();
  },

  toNameList:function(){
    this.data.component.toNameList();
  },

  setInviteUserId:function(e){
    this.setData({
      invite_user_id : e.detail.invite_user_id
    });
    
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
    app.checkLogin();
    
  },

  onReachBottom:function(){
   
    
    // wx.redirectTo({
    //   url: '/welfare/pages/detail/detail?active_id=' + this.data.active_id
    // })
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

  }

 

 
})