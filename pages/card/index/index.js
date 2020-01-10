const app = getApp();
const common = require("../../../util/common.js");
Page({
  data: {
    title: '示例名片',
    barBg: '#ffffff',
    color: '#000',

    actionHidden:true,
    isShowAct: false,
    pageHidden: true,
    card: null,
    card_id: 0,
    isMy: true,
    nameArr: [],
    haveCard: false,
    shareImg: "",
    avatarUrl: "",
    isShowQrcode: false,
    qrcodePath: "",
    products: [],

    stepWidth:0,
    stepHeight:0,
    stepImgs:[
      "/img/step1.png",
      "/img/step2.png",
      "/img/step3.png",
    ],
    stepImgs_iphonex: [
      "/img/step11.png",
      "/img/step22.png",
      "/img/step33.png",
    ],
    stepIndex:0,
    showStep:false
    
  },

  toSerivce: function() {

  },

  copy: function(e) {

    var val = e.currentTarget.dataset.cp;
    if (val == null || val.length == 0) {
      return;
    }

    wx.setClipboardData({
      data: val,
      success(res) {
       
      }
    })
  },

  onShow: function() {
    app.checkLogin();
    var cardRequest = this.getMyCard();
    if (cardRequest == null) { 
      return;
    }

    cardRequest.then(() => {
      this.setData({
        pageHidden: false
      });
    //   this.getProducts();
      this.loadFont();

      if (this.data.card){
        //创建分享图
        app.createShareImg(this.data.card, (path) => {

          this.setData({
            shareImg: path
          });
        });
      }
     
    });

    var CREATE_CARD = wx.getStorageSync("CREATE_CARD");
    if (CREATE_CARD) {
      wx.removeStorageSync("CREATE_CARD");
      wx.showToast({
        title: '名片创建成功，+1000积分',
        mask: true,
        icon: "none"
      })
    }


  },

  onLoad: function() {
    
    
   
   
    //导航栏自适应
    let systemInfo = wx.getSystemInfoSync();
    var screenWidth = systemInfo.screenWidth;
    var screenHeight = systemInfo.screenHeight;
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
    var stepHeight = screenHeight - h - pt;

    var deviceMode = app.jumpDeviceMode();
    this.setData({
      deviceMode: deviceMode,
      stepWidth: screenWidth,
      stepHeight: stepHeight
    });

    
    



  },
  //获取的我名片
  getMyCard: function() {
    var token = wx.getStorageSync("token");
    if (token == "" || token == null) {
      return null;
    }

    return new Promise((resolve) => {
      app.post(
        "Card/getMyCardStatus", {},
        (res) => {
          
          
        

          if (res.data.error_code != 0) {
            this.setData({
              title: '示例名片',
              showStep: true
            });
            resolve();
            return;
          }

          var card = res.data.data.card_info;
          card.jobArr = common.splitByPoint(card.job);
          card.jobStr = card.jobArr.join(" ");
          if (card) {
            wx.setStorageSync("MY_CARD", card);
            wx.setStorageSync("CARD_ID", card.id);
            this.setData({
              card: card,
              card_id: card.id,
              haveCard: true,
              title: '我的名片'
            })
          } else {

            this.setData({
              title: '示例名片',
              showStep:true
            });


            
          }

          resolve();

        }
      );
    });

  },

  //查询产品列表
//   getProducts: function() {

//     return new Promise((resolve) => {
//       if (this.data.card == null){
//         resolve();
//       }else{
//         app.post(
//           "Card/getProducts", {
//             card_id: this.data.card.id
//           },
//           (res) => {
//             this.setData({
//               products: []
//             });

//             if (res.data.data == "" || res.data.data == null) {
//               return;
//             }
//             var products = res.data.data.products;

//             if (products == null || products.length == 0) {
//               return;
//             }
//             products = JSON.parse(products);
//             var list = [];
//             for (var k in products) {
//               list.push(products[k]);
//             }
//             this.setData({
//               products: list
//             });
//             resolve();
//           }, false
//         );
//       }
      
//     });

//   },

  //去修改名片
  toUpdateCard: function() {

    wx.navigateTo({
      url: '/card/edit/edit?type=2'
    })
  },

  loadFont: function() {
    if(this.data.card == null){
      return;
    }
    var arr = this.data.card.name.split("");
    var ss = arr.map((s) => {
      var obj = {};
      obj.str = s;
      obj.code = s.charCodeAt();
      return obj;
    })
    for (var o of ss) {
      wx.loadFontFace({
        family: 'f' + o.code,
        source: 'url("https://ddg-font.oss-cn-hangzhou.aliyuncs.com/' + o.code + '.ttf")',
        success: (res) => {}
      })
    }

    this.setData({
      nameArr: ss
    });


  },


  toDetail: function() {

    if (!this.data.haveCard) {
      return;
    }

    wx.navigateTo({
      url: '/card/detail/detail?card_id=' + this.data.card.id
    })

  },

  createQrcode: function() {

    this.switchAction();
   



    var param = {};
    var scene = "a=" + this.data.card.id;

    param.scene = scene;
    param.page_url = "card/detail/detail";


    var qrcodePath = wx.getStorageSync("qrcodePath");
    if (qrcodePath == "" || qrcodePath == null) {
     
      app.getCodePic(param).then((filePath) => {
        wx.setStorageSync("qrcodePath", filePath)
        this.setData({
          qrcodePath: filePath
        });

        this.drawCardImage();
      }).catch((filePath) => {
        wx.setStorageSync("qrcodePath", filePath)
        this.setData({
          qrcodePath: filePath
        });

        this.drawCardImage();
      });
    } else {
      this.setData({
        qrcodePath: qrcodePath
      });

      this.drawCardImage();
    }

  },

  hideQrcode: function() {
    this.setData({

      isShowQrcode: false
    });
  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
   

    var titleText;
    var imageUrl;
    var path;
    if (res.from == "button") {
      //1: 服务评价邀请
      if (res.target.dataset.id == 1) {
        titleText = "Hi，给我的产品业务攒个口碑吧~";
      } else if (res.target.dataset.id == 2) {
        //2: 伙伴印象邀请
        titleText = "Hi，给我的好友印象来个点评吧~";
      } else if (res.target.dataset.id == 3) {
        //3: 发名片
        titleText = "这是我的红包名片，请您惠存";
        this.switchAction();
      }

      imageUrl = this.data.shareImg;
      path = "/card/detail/detail?card_id=" + this.data.card.id + "&share=1";
    } else if (res.from == "menu") {
      if(this.data.card){
        titleText = "这是我的红包名片，请您惠存";
        imageUrl = this.data.shareImg;
        path = "/card/detail/detail?card_id=" + this.data.card.id + "&share=1";
      }else{
        titleText = "推荐简单人脉给您，来试试";
        imageUrl = "/img/share_aplet_img.png";
        path = "/pages/card/index/index";
      }
      
       
    }

    
    return {
      title: titleText,
      path: path,
      imageUrl: imageUrl,
    }
  },

  switchAction:function(){
    
    this.setData({
     
      actionHidden: !this.data.actionHidden
    });
    setTimeout(() => {
      this.setData({
        isShowAct: !this.data.isShowAct,
      
      });
    },50);
    
  },

 
  //绘制名片图
  drawCardImage:function(){
    wx.showLoading({
      title: '正在生成',
    })


    var card = this.data.card;
    var width = 620;
    var top = 0;
    var param = {
      width: width,
      height: 946,
      clear: true,
      views:[
        {
          type: "rect",
          background: "#fff",
          top: 0,
          left: 0,
          width: width,
          height: 946
        },

        {
          type:"image",
          url: card.tpl_list ? card.tpl_list : card.banner_img,
          top: top += 15,
          left: 15,
          width: 590,
          height: 330
        },
        {
          type: "rect",
          background: "#fff",
          top: top + 222,
          left: 222,
          width: 176,
          height: 176,
          borderRadius:88
        },
        {
          type: "image",
          url: app.globalData.userInfo.avatarUrl,
          top: top += 230,
          left: 230,
          width: 160,
          height: 160,
          borderRadius:80
        },
        {
          type: 'text',
          content: card.name,
          fontSize: 36,
          color: '#000',
          textAlign: 'center',
          top: top += 180,
          left: width / 2
        },
        {
          type: 'text',
          content: card.full_name ? card.full_name : "单位/公司名",
          fontSize: 26,
          color: '#000',
          textAlign: 'center',
          top: top += 55,
          left: width / 2
        },
        {
          type: 'text',
          content: card.job ? card.jobStr : "职位/职业",
          fontSize: 26,
          color: '#000',
          textAlign: 'center',
          top: top += 45,
          left: width / 2,
        },
        {
          type: "image",
          url: this.data.qrcodePath,
          top: top += 45,
          left: 206,
          width: 208,
          height: 208
        },

        {
          type: 'text',
          content: "扫码看看,领好友红包",
          fontSize: 28,
          color: '#777777',
          textAlign: 'center',
          top: top += 230,
          left: width / 2,
        },
      ]

    }
    this.setData({
      cardPainting: param,
      isShow: false
    })
    
   
  },

  toggleStep: function () {
    
    this.setData({
      showStep: !this.data.showStep
    });
  },

  stepChange:function(e){
    
    var index = e.detail.current;
    if(index == 3){
      this.toggleStep();
    }
  },


  //接受绘制的名片图
  eventGetCardImage:function(e){
    
    wx.hideLoading()
    if (e.detail.tempFilePath){
      this.setData({
        cardImage: e.detail.tempFilePath,
        isShowQrcode: true,
      });
    }else{
      this.setData({
       
        isShowQrcode: true,
      });
    }
   
    
  },

  eventSave() {
    this.hideQrcode();
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.cardImage,
      success(res) {
        wx.hideLoading();
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },


})