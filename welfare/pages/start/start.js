const app = getApp();
const constant = require("../../../util/constant.js");
const date = require("../../../util/date.js");
//推广类型
const PRODUCT = {
  FREE: 1,
  FUN: 2,
  PRO: 3,
  TOP: 4
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '发起福利',
    barBg: '#ffffff',
    color: '#000',

    ui: "main",
    //是否开启组队
    isTeam: false,
    //队伍的人数
    teamNum: 0,
    coverImage: "/img/demo_image.jpg",
    //是否有封面图
    haveCoverImage: false,

    //图文node
    nodeList: [],
    //图文html
    html: "",


    //推广方式
    type: PRODUCT.FREE,
    //开奖方式
    open_type: 1,
    //开奖人数
    open_users_num: 0,
    //参与者分享
    is_share: true,
    //一句广告
    one_ad: "",
    //上传图片的路经
    imageUploadUrl: "",
    //
    isSelfBack: false,
    //是否同步到名片
    is_sync: true,
    //是否将专业版显示在首页
    is_top:true,
    //专业券
    pro_ticket_num: 0,
    animationData: null,
    showModal: false,
    isShowViewInIos: true,
    formid:"",
    card_id:0,
  
    actionHidden: true,
    isShowAct: false,
    openNumNull: false
  },
  selfBack: function() {
    if (this.data.ui == "cut-image") {

    } else if (this.data.ui == "editor") {

    }
    this.setData({
      ui: "main",
      isSelfBack: false
    });
  },
  //一句广告收入事件
  advertInput: function(e) {
    var val = e.detail.value;

    this.setData({
      one_ad: val
    });
  },
  //参与者分享切换事件
  shareChange: function(e) {
    var val = e.detail.value;

    this.setData({
      is_share: val
    });
  },
  //开奖人数输入（当开奖方式为“按人数自动开奖”）
  renShuInput: function(e) {
    // console.log(e.detail.value);
    var val = e.detail.value
    this.setData({
      open_users_num: val
    });
    if(val == ""){
      this.setData({
        openNumNull:true
      });
    }else{
      this.setData({
        openNumNull: false
      });
    }
  },
  //开奖方式切换事件
  openTypeChange: function(e) {

    this.setData({
      open_type: e.detail
    });
  },

  //推广方式切换事件
  typeChange: function(e) {
    console.log(e.detail);
    this.setData(e.detail);
  },
  //组队信息变更时
  teamChange: function(e) {

    this.setData(e.detail);
  },

  
  //一键复制到剪切板
  copy: function(e) {
    console.log(e);
    wx.setClipboardData({
      data: e.target.dataset.content,
      success(res) {


      }
    })
  },

  //前往图文编辑
  toEditor: function() {

    wx.setStorageSync("nodeList", this.data.nodeList);
    wx.navigateTo({
      url: '../edit/edit',
    })
  },

  //提交发起抽奖
  submit: function(e) {
    if (this.data.type == PRODUCT.FUN){
     // this.selectComponent("#setFunCom").check();
    }else{
      this.selectComponent("#setPrizeCom").check();
    }
    
    
    var formId = e.detail.formId;
    if (formId == "the formId is a mock one") {
      formId = "af34ba5800199516f1c5e2d1f994555a";
    }
    this.setData({
      formid:formId
    });


    var self = this;

    var open_date = wx.getStorageSync("open_date");
    var prizeList = wx.getStorageSync("prizeList");
   

    if (this.data.open_type == 2) {
      if (this.data.open_users_num == 0 || this.data.open_users_num == "") {
       this.setData({
         openNumNull:true
       });
        return;
      }
    }

    for (var prize of prizeList) {
      
      if (prize.prize_name == "") {
       
        return;
      }
      if (prize.prize_num == "") {
        
        return;
      }
      if (parseInt(prize.prize_num) > 100){
        return;
      }
      if (this.data.isTeam && prize.team_num == "") {
        
        return;
      }
     

    }
    
    if (this.data.type == PRODUCT.FREE) {
      
       
        this.submitFee();
    

    } else if (this.data.type == PRODUCT.FUN) {
   
      this.submitFun();

    } else if (this.data.type == PRODUCT.PRO) {

     
        this.submitPro();
    

    } else if (this.data.type == PRODUCT.TOP) {
      
        
        this.submitTop();
    

    }

  },
 
  //构建参数
  getParam: function() {
    
    var param = {};
    //封面图
    param.cover_img = this.data.coverImage;
    //开奖方式
    param.open_type = this.data.open_type;
    //奖品列表
    
    var prize_list = this.data.prize_list;
    param.prize_list = {};
    for (var key in prize_list) {
      if (prize_list[key].team_num == "") {
        prize_list[key].team_num = 1;
      }
     
      key = parseInt(key);
      param.prize_list[key + 1] = prize_list[key];
    }
    
    //开奖时间
    param.open_date = wx.getStorageSync("open_date");
    //开奖人数（当开奖方式为：“按人数开奖”）
    param.open_users_num = this.data.open_users_num;

    
    //一句话广告
    param.one_ad = this.data.one_ad;
    
    if (this.data.type >= PRODUCT.PRO) {
      //图文详情
      //param.open_content = encodeURIComponent(JSON.stringify(this.data.nodeList));
      param.open_content = JSON.stringify(this.data.nodeList);
      //是否同步到名片
      if (this.data.is_sync) {
        param.is_sync = 1;
      }
      //是否升级
      if (this.data.is_top) {
        param.is_top = 1;
      }

      
      //是否开启分享
      param.is_share = this.data.is_share ? 1 : 0;

      //队伍成员数量
      if (this.data.isTeam) {
        param.group_user_limit = this.data.teamNum;
      } else {
        param.group_user_limit = 0;
      }
      //口令
      if (wx.getStorageSync("isKoulin")) {
        param.active_key = wx.getStorageSync("active_key");
      } else {
        param.active_key = "";
      }
      //是否余额优先
      param.balance_first = 1; //1余额优先 混合支付 0直接支付
    }

    if (this.data.type >= PRODUCT.TOP) {
      
      var product = wx.getStorageSync("product");
      param.formid = this.data.formid;
      param.p_id = product.p_id;
      //性别限制
      if (wx.getStorageSync("openGender")) {
        param.is_gender = wx.getStorageSync("is_gender");
      } else {
        param.is_gender = 0;
      }
      //发布时间
      param.start_date = wx.getStorageSync("start_date");
      //开奖时间
      var d = date.createDate(param.start_date);
      var t = d.getTime() + 1000 * 3600 * 24 * product.p_num;
      param.open_date = date.formatTime(t,"Y-M-D h:m");

     
      //小程序推广
      // if (wx.getStorageSync("isSpread")){
      //     param.applets = { 
      //       'appid': wx.getStorageSync("appid"), 
      //       'applets_name': wx.getStorageSync("applets_name"),
      //       'applets_url': wx.getStorageSync("applets_url"), 
      //       'applets_param': wx.getStorageSync("applets_param") 
      //      };    
      // }

    }
    return param;
  },
  //提交强推版
  submitTop: function() {
    
    var self = this;
    this.uploadAllImg().then(() => {

      var param = this.getParam();
    
      

      app.post("Active/createActiveForTop", param, function(res) {
        
        if (res.data.data.timeStamp) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success() {
              self.createSuccess();
            },
            fail() {
              wx.showToast({
                title: '支付失败',
                icon: "none"
              })
            }
          })
        } else {
          self.createSuccess(res.data.data.active_id);
        }

      });
    });
  },


  //提交专业版
  submitPro: function() {


    var self = this;

    this.uploadAllImg().then(() => {
      var param = this.getParam();

      

     

      app.post("Active/createActiveForPro", param, function(res) {

        if (res.data.data.timeStamp) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success() {
              self.createSuccess();

            },
            fail() {
              wx.showToast({
                title: '支付失败',
                icon: "none"
              })
            }
          })
        } else {
          self.createSuccess(res.data.data.active_id);
        }

      });
    });

  },
  //提交趣味版
  submitFun:function(){
   
    this.uploadAllImg().then(() => {
      var param = this.getParam();
      app.post("Active/createActiveForFun", param, (res) => {

        this.createSuccess(res.data.data.active_id);
      });
    });
  },


  //提交免费版的
  submitFee: function() {
    var self = this;

    this.uploadAllImg().then(() => {
      var param = this.getParam();
      app.post("Active/createActiveForFree", param, function (res) {

        self.createSuccess(res.data.data.active_id);
      });
    });

  },
  //上传所有的图片
  uploadAllImg:function(){
    var allPromise = [];
    for (let node of this.data.nodeList){
      if (node.name === 'img' && !node.attrs._uploaded) {
        var promise = new Promise(function (resolve) {
          app.uploadFile(node.attrs.src,).then((res) => {
            node.attrs.src = res;
            node.attrs._uploaded = true;
            resolve();
          });
         
        })
        allPromise.push(promise);
      } 
    }
    var prize_list = wx.getStorageSync("prizeList");
    
    this.data.prize_list = prize_list;
    if(this.data.type != PRODUCT.FUN){
      for (let i in prize_list) {
        if (prize_list[i].prize_img.indexOf("demo_image.jpg") == -1) {
          var promise = new Promise((resolve) => {
            app.uploadFile(prize_list[i].prize_img).then((res) => {
              this.data.prize_list[i].prize_img = res;

              resolve();
            });
           
          });
          allPromise.push(promise);
        }
      }
    }
    
    return Promise.all(allPromise);

  },
  
  //成功创建活动后调用
  createSuccess: function (active_id) {
    
    var self = this;
    wx.showToast({
      title: '福利发起成功',
      mask: true,
      success: function() {
        setTimeout(function() {
         
          
          wx.redirectTo({
            url: '/welfare/pages/detail/detail?active_id=' + active_id
          })
        }, 1500);

      }
    })
    
    var param = {};
    var scene = "a=" + active_id;
    param.scene = scene;
    param.page_url = "welfare/pages/detail/detail";
    app.getCodePicBackgroud(param);
  },

  
  setFunCoverImg: function(e) {

   
   
   wx.getImageInfo({
     src: e.detail,
     success: (res) => {
       

       this.setData({
         coverImage: res.path
       });
       
     },
     fail: function(res) {},
     complete: function(res) {},
   })
    
  },

  showToastTips:function(tips){
    wx.showToast({
      title: tips,
    })
  },


  toFunType: function() {
    this.showToastTips("已切换至趣味版");
    this.setData({
      type: PRODUCT.FUN,
      title:"撩一下"
    });

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },

  toProType: function() {

    //判断是否有优惠券
    if (this.data.pro_ticket_num > 0) {
      this.showToastTips("已切换至专业版");
      this.setData({
        type: PRODUCT.PRO
      });

      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    } else {
     


      this.showModal();
      
    }

  },

  toBuyPro:function(){
    //设置一个标识，说明去购买专业券
    wx.setStorageSync("go_to_buy_pro", 1);
    //没有优惠券，去购买优惠券
    wx.navigateTo({
      url: '/my/pages/welfareProfessionCoupon/addService/addService',
    })

    this.hideModal();
  },
  //切换同步到名片
  syncChange: function(e) {
    var val = e.detail.value;

    this.setData({
      is_sync: val
    });
  },
   //切换专业版是否显示在首页
  isTopChange: function (e) {
    var val = e.detail.value;

    this.setData({
      is_top: val
    });
  },
  //查询专业券
  getProTicket: function() {
    return new Promise(resolve => {
      app.post(
        constant.GET_MY_INFO, {},
        (res) => {


          this.setData({
            pro_ticket_num: res.data.data.pro_ticket_num
          });
          resolve();
        }
      );
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options.type) {
      this.setData({
        type: parseInt(options.type)
      });
    }

    this.setData({
      isShowViewInIos: app.judgePhoneType(),
    })

    wx.getSystemInfo({
      success: (res) => {
        this.data.windowHeight = res.screenHeight;
      }
    })

    
 
    this.setData({
      card_id: wx.getStorageSync("CARD_ID")
    });

    wx.setStorageSync("isSpread", false);

    wx.removeStorageSync("nodeList");

    wx.removeStorageSync("coverImage");
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
   

    //判断我是否刚买了专业券
    
    var go_to_buy_pro = wx.getStorageSync("go_to_buy_pro");
    if (go_to_buy_pro != null && go_to_buy_pro != "") {
      wx.removeStorageSync("go_to_buy_pro")
      this.getProTicket().then(() => {
        if (this.data.pro_ticket_num > 0){
          this.toProType();
        }
       
      });
    } else {
      //查询专业券
      this.getProTicket();
    }
    
    var nodeList = wx.getStorageSync("nodeList");
    for (var i = nodeList.length - 1;i>=0;i--){
      var temp = nodeList[i];
      if (temp.name == "p" && (!temp.children[0].text)){
        nodeList.splice(i,1);
      }
    }
    if (nodeList !== "" && nodeList != null) {
      this.setData({
        nodeList: nodeList
      })

    }

    

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
    }, 200);



  },
  tip:function(){
   

    this.selectComponent("#myModal").open({
      title: '同步到名片',
      content: '开启后，您本次发起的福利会显示在您的名片上，方便您进行推广。'
    });
  },
  tipIsTop:function(){

    this.selectComponent("#myModal").open({
      title: '上首页',
      content: '开启后，可显示在福利广场自助福利模块，帮您强力引流宣传。限时开放，免费体验福利广场推广服务。'
    });

   
  },

  setFunImg:function(e){
    
    this.setData({
      coverImage:e.detail.funImg
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
  
  onPullDownRefresh: function () {

  },
   */

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