//app.js
const createParam = require("./util/createParam.js");
const constant = require("./util/constant.js");
const base64 = require("./util/base64.js");
const common = require("./util/common.js")
App({

 
  onLaunch: function () {


    console.log("onLaunch..........");
    this.globalData.myDevice = wx.getSystemInfoSync();

  },

  checkLogin:function(){
    var that = this
    wx.getSetting({
      success: res => {

        var a = that.globalData;
        if (res.authSetting['scope.userInfo']) {

          wx.checkSession({
            success: () => {
              // session_key 未过期，并且在本生命周期一直有效
              var token = wx.getStorageSync("token");
              if (token == "" || token == null) {
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              } else {
                wx.getUserInfo({
                  success: res => {
                    this.globalData.userInfo = res.userInfo;
                    wx.setStorageSync("NICK_NAME", res.userInfo.nickName);
                    wx.setStorageSync("USER_IMAGE", res.userInfo.avatarUrl);
                  }
                })
              }

            },
            fail: () => {
              // session_key 已经失效，需要重新执行登录流程
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          })



        } else {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  },

  

  post: function (method, param, success,mask=true) {
    //暂时默认是false； 不需要加载框
    mask = false;
    if(mask){
    
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    

    console.log(JSON.stringify(createParam.create(param, method)));
    wx.request({
      url: constant.BASE_URL,
      data: createParam.create(param, method),
      header: {
        'Content-Type': 'application/json'
       
      },
      method: "POST",
      success: function (res) {
       if(mask){
        
        wx.hideLoading();
       }
       
        success(res);
      },
      fail: function (e) {
        wx.hideLoading();
        wx.showToast({
          title: '请求出错！',
        });
        console.warn(createParam.create(param, method));
      },
      complete: function () {
     

      }
    })
  },
/*
  uploadFile: function (tempFilePaths,callback){
  
    wx.showLoading({
      title:"正在上传图片",
      mask:true
    });

    var token = wx.getStorageSync("token");
    console.warn(tempFilePaths);
    wx.uploadFile({
      url: constant.UPLOAD_FILE + "?token=" + encodeURIComponent(token), 
     
      filePath: tempFilePaths,
      name: 'file',
      formData: {
        
      },
      success(res) {
        wx.hideLoading();
        var data = JSON.parse(res.data);
        if (callback){
          callback(data.url);
        }
     
      },
      complete: function () {
       

      },
      fail:function(res){
        wx.hideLoading();
        
      }

    })
  },
*/
  // 上传图片OSS
  uploadFile: function (tempFilePaths) {
    return new Promise((resolve) => {
      
      if (tempFilePaths == "" || tempFilePaths == null){
        resolve("");
        return;
      }

      wx.showLoading({
        title: "正在上传图片",
        mask: true
      });
      var that = this;
      var param = createParam.getUploadParam(tempFilePaths);
      param.name = tempFilePaths;
      wx.uploadFile({
        url: constant.UPLOAD_FILE,
        filePath: tempFilePaths,
        name: "file",
        /**上传的参数**/
        formData: param,
        success: function (res) {
          wx.hideLoading();
        
          resolve(constant.UPLOAD_FILE + "/" + param.key);
        

        },
        fail: function (res) {
          wx.hideLoading();
          console.log(res)
          resolve("上传失败");
        }
      })
    });
    
  },
  //拍名片
  shoot:function(func){
    wx.chooseImage({
      count: 1,
      success: res => {
        wx.setStorageSync("SHOOT_IMG", res.tempFilePaths[0]);
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            wx.showLoading({
              title: '正在识别图片',
              mask: true
            });
            var img = res.data;
            wx.request({
              url: 'https://dm-57.data.aliyun.com/rest/160601/ocr/ocr_business_card.json',
              method: "POST",
              data: {
                image: img
              },
              header: {
                'content-type': 'application/json; charset=UTF-8',
                'Authorization': 'APPCODE ' + "95d51aa6c29047b38a41b56218b50d25"
              },
              success: (res) => {
                wx.hideLoading();
                wx.setStorageSync("SHOOT_RES", res);
                func();
               
              },
              fail: function (e) {
                wx.hideLoading();
                wx.showToast({
                  title: '请求出错！',
                });

              },
            })

          }
        })


      }
    })
  },





  getSysInfo: function (cb) {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        typeof cb == "function" && cb(res);
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this;
    var auth = wx.getStorageSync("@appauth")
    console.log("get_auth", auth )
    let time = new Date().getTime()
    if (auth && auth.time && time - auth.time < 3600 * 1000) {
      console.log('cache login', auth)
      that.globalData.userInfo = auth
      typeof cb == "function" && cb(auth)
    } else if (this.globalData.userInfo && this.globalData.userInfo.token) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
  },
  showmsg(msg, duration = 2000) {
    if( !!msg ){
      wx.showToast({
        title: msg,
        icon: 'info',
        duration: duration,
        mask: true
      })
    }
  },

  //创建名片分享图
  createShareImg: function (card,func) {
    if(!card){
      return;
    }
    const ctx = wx.createCanvasContext('shareCan')
    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, 500, 400);

  
    wx.getImageInfo({
      src: card.tpl_list ? card.tpl_list : card.banner_img,
      complete: res => {
        
        var cover_img = res.path;
      
      
        ctx.drawImage(cover_img, 0, 0, 500, 270);
       
        ctx.setFontSize(60)
        ctx.setFillStyle('#000');
        ctx.fillText(card.name, 15, 380);
        var nameWidth = ctx.measureText(card.name).width;


        ctx.setFontSize(30);
        ctx.setFillStyle('#777');
        
       
        var jobArr = common.splitByPoint(card.job);
        if(jobArr.length == 1){
          ctx.fillText(jobArr[0], 15 + nameWidth + 20, 380);
        }else{
          ctx.setFontSize(24);
          ctx.fillText(jobArr[0], 15 + nameWidth + 20, 350);
          ctx.fillText(jobArr[1], 15 + nameWidth + 20, 380);
         
        }
       
        
        wx.getImageInfo({
          src: card.logo ? card.logo : "/img/logo-de.jpg",
          complete: res => {
            if (res.path == "img/logo-de.jpg"){
              res.path = "/" + res.path;
            }
            ctx.drawImage(res.path, 415, 310, 80, 80);



            ctx.draw(true, () => {
              wx.canvasToTempFilePath({
                canvasId: 'shareCan',
                quality: 1,
                fileType: "jpg",
                success: (res) => {

                  func(res.tempFilePath);

                }
              })

            })
          },
          fail:function(res){
            debugger
          }
        })

        

      }
    })

  },
  //提前创建二维码
  getCodePicBackgroud:function(param){
    return new Promise((resolve) => {
      this.post(
        "Info/getCodePicBackgroud",
        param,
        (res) => {
          
        }
      );
    });
    
  },

  //获取二维码URL
  getCodePic: function (param) {
    return new Promise((resolve, reject) => {
      this.post(
        "Info/getCodePic",
        param,
        (res) => {
          
          if (res.data.error_code == 0) {
            resolve(res.data.data);
          } else {
            reject("/img/main-qrcode.jpg");
          }

        }
      );
    });
  },


  //即时获取二维码图片
  getCodePicGroup: function (param) {
    return new Promise((resolve, reject) => {
      this.post(
        "Info/getCodePicGroup",
        param,
        (res) => {
          
          var base64 = res.data.data;
          if (res.data.error_code == 0) {
            const fsm = wx.getFileSystemManager();
            const FILE_BASE_NAME = 'tmp_base64src';
            const format = "jpg";
            const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
            const buffer = wx.base64ToArrayBuffer(base64);
            fsm.writeFile({
              filePath,
              data: buffer,
              encoding: 'binary',
              success: () => {
                resolve(filePath);

              },
              fail() {

              },
            });
          } else {
            reject();
          }

        }
      );
    });
  },

  downloadImage:function(arr){
    var list = [];
    for(var item of arr){
      var pro = new Promise((resolve) => {
        wx.getImageInfo({
          src: item,
          success :(res) => {
            resolve(res.path);
          }
        })
      });
      list.push(pro);
    }

    return Promise.all(list);
  },


  onShow: function () {
    
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  jumpDeviceMode:function(){
    var myDevice = this.globalData.myDevice;

    var model = myDevice.model.toLocaleLowerCase();
    var system = myDevice.system.toLocaleLowerCase();
    console.log("Device model:", model);
    console.log("Device system:", system);
    if (model.includes("iphone x")) {
      return "iphone x";
    }else if (model.includes("iphone") || system.includes("ios")) {
      return "iphone";
    } else if (model.includes("redmi note")) {
      return "redmi"
    } else {
      return "android";
    }
    
  },

  judgePhoneType: function () {
    var myDevice = this.globalData.myDevice;

    var model = myDevice.model.toLocaleLowerCase();
    var system = myDevice.system.toLocaleLowerCase();
    console.log("Device model:", model);
    console.log("Device system:", system);
    if (model.includes("iphone") || system.includes("ios")) {
      return true;
    } else {
      return false;
    }

  },

  globalData: {
    userInfo: {},
    point: {},
    myDevice: null
    
  },

  base64Encode:function(str){
    return base64.encode(str);
    
  },
  base64Decode:function(str){
    
    if(str == null){
      return;
    }
    var a = base64.decode(str);
    if (a == "" || a.length == 0) {
      return str;
    }
    return base64.decode(str);
  }
 
})