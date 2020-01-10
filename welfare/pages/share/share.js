//index.js
var date = require("../../../util/date.js");
const app = getApp();
Page({
  data: {
    title: '生成分享图片',
    barBg: '#ffffff',
    color: '#000',

    painting: {},
    shareImage: '',
    isShow:false,

    top:0,

    bgList:[
      {
        big:"/welfare/img/b1.png",
        thum:"/welfare/img/t1.png",
        color:"#fff",
        bgColor:"#bd3d2a",
        img:""
      },

      {
        big: "/welfare/img/b2.png",
        thum: "/welfare/img/t2.png",
        color: "#fff",
        bgColor: "#d6e5d0",
        img: ""
      },

      {
        big: "/welfare/img/b3.png",
        thum: "/welfare/img/t3.png",
        color: "#fff",
        bgColor: "#0d1735",
        img: ""
      },

      {
        big: "/welfare/img/b4.png",
        thum: "/welfare/img/t4.png",
        color: "#fff",
        bgColor: "#77c3fd",
        img: ""
      },

      {
        big: "/welfare/img/b5.png",
        thum: "/welfare/img/t5.png",
        color: "#fff",
        bgColor: "#fbbbbf",
        img: ""
      }

     

    ],
   
    bgIndex:0
  },
  onLoad (options) {
    
    this.setConHeight();
    
   
    this.data.active = wx.getStorageSync("active");
    
    this.data.qrcode = wx.getStorageSync("qrcode");
    console.warn(this.data.qrcode);
    var openDate = "";
    switch (this.data.active.open_type) {
      case 1:
        this.data.active.open_date = date.formatTime(new Date(this.data.active.open_date.replace(/-/g, '/')), "M月D日 h:m");
        openDate = this.data.active.open_date + " 自动开奖";
        break;
      case 2:
        openDate = "达到" + this.data.active.open_users + "人，自动开奖";
        break;
      case 3:
        openDate = "手动开奖";
        break;
    }
    this.data.openDate = openDate;




    var type = parseInt(options.type);
    this.setData({
      type:type
    });
    if(type == 1){
      this.share();
    }else if(type == 2){
     
      this.flaunt();
    }
    
  },

 

  //绘制分享图
  share:function(){
    


    if (this.data.active.active_type == 1) {
      this.data.desc = "趣味夺宝";
    } else {
      this.data.desc = "";
      if (this.data.active.group_user_limit > 0) {
        this.data.desc = "组队夺宝";
      } else if (this.data.active.active_key != "") {
        this.data.desc += "/口令夺宝";
      }
    }

    var height = 1490;
    var width = 750;
    if (this.data.active.prize_img2){
      height += 565;
    }
    if (this.data.active.prize_img3) {
      height += 565;
    }

    var param = {
      width: width,
      height: height,
      clear: true
    
    }

    this.data.top = 0;
    this.data.views = [];
    this.data.views.push({
      type: "rect",
      background: this.data.bgList[this.data.bgIndex].bgColor,
      top: 0,
      left: 0,
      width: width,
      height: height
    });
    // this.data.views.push({
    //   type: "image",
    //   url: this.data.bgList[this.data.bgIndex].big,
    //   top: 0,
    //   left: 0,
    //   width: 750,
    //   height: 580
    // });

    this.data.top += 40;
    this.data.views.push({
      type: 'image',
      url: this.data.active.icon,

      top: this.data.top,//35
      left: 319,
      width: 112,
      height: 112,
      borderRadius: 56
    });

    this.data.top += 136;
    this.data.views.push({
      type: 'text',
      content: this.data.active.nickname,
      fontSize: 30,
      color: this.data.bgList[this.data.bgIndex].color,
      textAlign: 'center',
      top: this.data.top,//150
      left: width / 2,
    });

    this.data.top += 45;
    this.data.views.push({
      type: 'text',
      content: "发起了一个福利",
      fontSize: 30,
      color: this.data.bgList[this.data.bgIndex].color,
      textAlign: 'center',
      top: this.data.top,//220
      left: width / 2,
    });

    this.data.top += 54;
    this.data.views.push({
      type: "rect",
      background: "#fff",
      top: this.data.top,
      left: 30,
      width: 690,
      height: height - this.data.top - 30
    });

    this.data.top += 25;
    this.pushPrize(1);
    if(this.data.active.prize_img2){
      this.pushPrize(2);
    }
    if (this.data.active.prize_img3) {
      this.pushPrize(3);
    }

    

    
    this.data.views.push({
      type: "rect",
      background: "#999",
      top: this.data.top,//895
      left: 30,
      width: 690,
      height: 1
    });

    this.data.top += 100;
    this.data.views.push({
      type: 'image',
      url: this.data.qrcode,
      top: this.data.top,//905
      left: 285,
      width: 180,
      height: 180
    });

    this.data.top += 260
    this.data.views.push({
      type: 'text',
      content: "长按识别小程序，参与抽奖",
      fontSize: 30,
      color: '#000',
      textAlign: 'center',
      top: this.data.top,//1095
      left: width / 2,
    });

    this.data.top += 70;
    this.data.views.push({
      type: "rect",
      background: "#999",
      top: this.data.top,//1145
      left: 30,
      width: 690,
      height: 1
    });

    this.data.top += 10;
    this.data.views.push({
      type: 'text',
      content: "福利说明：" + (this.data.active.one_ad == "" ? "无" : this.data.active.one_ad),
      fontSize: 35,
      color: '#000',
      textAlign: 'left',
      top: this.data.top,//1155
      left: 55,
      breakWord: true,
      MaxLineNumber: 3,
      width: 640,
      lineHeight: 50
    });

    param.views = this.data.views;
    
    this.eventDraw(param)
  },

  //添加奖品到图片中
  pushPrize:function(num){
    var isMorePrize = false;
    if(this.data.active.prize_img2){
      isMorePrize = true;
    }
    var desc = "";
    if (isMorePrize){
      switch (num){
        case 1:
          desc = "奖项一：";
        break;
        case 2:
          desc = "奖项二：";
          break;
        case 3:
          desc = "奖项三：";
          break;
      }
    }else{
      desc = "奖品：";
    }


   
    this.data.views.push({
      type: 'image',
      url: this.data.active["prize_img" + num],
      top: this.data.top,//307
      left: 55,
      width: 640,
      height: 360
    });

    this.data.top += 384;
   
    this.data.views.push({
      type: 'text',
      content: desc + this.data.active["prize_name" + num] + " ×" + this.data.active["prize_num" + num],
      fontSize: 35,
      color: '#000',
      textAlign: 'left',
      top: this.data.top,//725
      left: 55,
      breakWord: true,
      MaxLineNumber: 2,
      width: 640,
      lineHeight: 50
    });

    this.data.top += 105;
    this.data.views.push({
      type: 'text',
      content: this.data.openDate,
      fontSize: 30,
      color: '#999',
      textAlign: 'left',
      top: this.data.top,//830
      left: 55
    });

    this.data.top += 75;
    
  },


  //绘制炫耀图
  flaunt:function(){
    

    var ref_id =  wx.getStorageSync("ref_id");
    var probable = wx.getStorageSync("probable");
    var win_lev = wx.getStorageSync("win_lev");
    var activeUserTotal = wx.getStorageSync("activeUserTotal");
    var top = 0;

    var width = 710;
    var height = 950;
    var param = {
      width: width,
      height: height,
      clear: true,
      views: [
        {

          type: "rect",
          background: this.data.bgList[this.data.bgIndex].bgColor,
          top: 0,
          left: 0,
          width: width,
          height: height
        }
      ]
    }

    top += 40;
    param.views.push({
        type: 'image',
        url: this.data.active.icon,
        top: top,
        left: 310,
        width: 90,
        height: 90,
        borderRadius: 45
    });

    top += 98;
    param.views.push({
      type: 'text',
      content: this.data.active.nickname,
      fontSize: 30,
      color: this.data.bgList[this.data.bgIndex].color,
      textAlign: 'center',
      top: top,
      left: 355
    });

    top += 50;
    param.views.push({
      type: 'text',
      content: "我中奖了：" + this.data.active["prize_name" + win_lev],
      fontSize: 30,
      color: this.data.bgList[this.data.bgIndex].color,
      textAlign: 'center',
      top: top,
      left: 355,
      breakWord: true,
      MaxLineNumber: 2,
      width: 650,
      lineHeight: 50
    });

    top += 120;
    param.views.push({
      type: "rect",
      background: "#fff",
      top: top,
      left: 20,
      width: 670,
      height: 624
    });

    top += 10;
    param.views.push({
      type: 'image',
      url: this.data.active["prize_img" + win_lev],
      top: top,
      left: 30,
      width: 650,
      height: 365
    });

    top += 405;
    param.views.push({
      type: 'text',
      content: this.data.openDate,
      fontSize: 24,
      color: '#999',
      textAlign: 'left',
      top: top,
      left: 40,
    });

    param.views.push({
      type: 'text',
      content: "参与人数：" + activeUserTotal,
      fontSize: 24,
      color: '#999',
      textAlign: 'right',
      top: top,
      left: 670,
    });

    top += 40;
    param.views.push({
      type: "rect",
      background: "#ccc",
      top: top,
      left: 20,
      width: 670,
      height: 1
    });

    top += 30;
    param.views.push({
      type: 'image',
      url: this.data.qrcode,
      top: top,
      left: 40,
      width: 130,
      height: 130
    });

    top += 20;
    param.views.push({
      type: 'text',
      content: "长按识别小程序",
      fontSize: 24,
      color: '#333',
      textAlign: 'left',
      top: top,
      left: 190,
    });

    top += 50;
    param.views.push({
      type: 'text',
      content: "来口袋社群领取福利",
      fontSize: 24,
      color: '#333',
      textAlign: 'left',
      top: top,
      left: 190,
    });


    this.eventDraw(param);
  },

  change:function(e){
    
    var index = e.currentTarget.dataset.index;

    if (this.data.bgList[index].img) {
      

      this.setData({
        isShow: false,
        bgIndex: index,
        shareImage: this.data.bgList[index].img
      });
      wx.showLoading({
        title: '绘制分享图片'
      })
      setTimeout(() => {
        wx.hideLoading()
        this.setData({
          isShow: true
        });
      },200);
     
    }else{
      this.setData({
        bgIndex: index
      });

      if (this.data.type == 1) {
        this.share();
      } else if (this.data.type == 2) {

        this.flaunt();
      }
      
    }
  },


  
  eventDraw (param) {
    wx.showLoading({
      title: '绘制分享图片'
      
    })

    this.setData({
      painting: param,
      isShow:false
    })
  },
  eventSave () {
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success (res) {
        wx.hideLoading();
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
  })
  },
  eventGetImage (event) {
    
    console.log(event)
   
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
      this.data.bgList[this.data.bgIndex].img = tempFilePath;


      setTimeout(() => {
        wx.hideLoading(),
          this.setData({

            isShow: true
          })
      }, 100);
    }

   
  },
  setConHeight:function(){
    
    var device = app.globalData.myDevice;
    var height = device.screenHeight;
    var width = device.screenWidth;
    var ratio = 750 / width;
    
    var a = height - 68 - 256 / ratio;
    this.setData({
      conHeight: height - 68 - 256 / ratio - 20
    });
  }
})
