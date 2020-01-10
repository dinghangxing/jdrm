// card/edit/edit.js
const common = require("../../util/common.js");
const app = getApp();
var Decrypt = require("../../util/decrypt.js");
const EDIT_TYPE = {ADD:1,EDIT:2,SHOOT:3};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '新建名片',
    barBg: '#ffffff',
    color: '#000',

    type: EDIT_TYPE.ADD,

    focus:{
      name:false,
      job:false,
      company:false,
      phone:false,
      email:false,
      address:false
    },

    showSave:true,
    scrollTop:0,
   
    //公司
    company:{
      //公司名称
      full_name:""
     
    },
    //公司列表
    companyList:[],
    //是否显示公司列表
    showCompanyList:false,
    card:{
      source :"",
      //名字
      name: "",
      //头像
      head_img: "",//app.globalData.userInfo.avatarUrl,
      //名片顶部展示位图片
      banner_img :"",
      //职位
      job :"",
      //邮箱
      email:"",
      //微信号
      weixin_id :"",
      //公司ID
      company_id :"",
      //电话
      phone :"",
      //主题ID
      tpl_id :"",
       //公司logo
      logo: "",
      //公司地址
      address: ""
    },
    //主题列表
    themeList:[],
    //选中的主题
    curTheme:null,
    //当前主题图片
    curCover:null,
    //当前主题图片下标
    current:0,
    //输入公司名称时防抖
    timer:null,
    //是否更换了Logo
    isChangeLogo:false,

    customImg: "",
    isCustomImg: false,

  },

  loadFont: function (card) {

    if (card.name == "" && card.name.length == 0) {
      card.name = "姓名"
    }
    var arr = card.name.split("");
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
        success: () => {

        }
      })
    }

    this.setData({
      nameArr: ss
    });


  },


  //获取手机号码
  getPhoneNumber:function(res){
   
    var encryptedData = res.detail.encryptedData;
    var iv = res.detail.iv;
    if (encryptedData){
      var d = new Decrypt("wx7adc154ae850d878", wx.getStorageSync("session_key"));
      var data = d.decryptData(encryptedData, iv)
      console.log('解密后 data: ', data)
      var phoneNumber = data.phoneNumber;
      console.log(phoneNumber);
      this.setData({
        "card.phone": phoneNumber
      });
    }
   
  },
  //选择地址
  chooseLocation:function(){

    wx.chooseAddress({
      success:(res) => {
        

        this.setData({
          "card.address": res.provinceName + res.cityName + res.countyName + res.detailInfo
        });
      }
    })
    return;
    wx.getSetting({
      success: (res) => {
        
        if (res.authSetting["scope.userLocation"]){
          wx.chooseLocation({
            success: (res) => {
              console.log(res);
              this.setData({
                "card.address": res.address
              });

            }
          })
        }else{
          wx.authorize({
            scope: 'scope.userLocation',
            success :() => {
              wx.chooseLocation({
                success: (res) => {
                  
                  console.log(res);
                  

                }
              })
            }
          })
        }
      }
    });

   
    
  },
  //拍名片
  chooseImage:function(){
    // app.shoot(() => {
    //   this.setShootData();
    // }); 
    // return;
    wx.navigateTo({
      url: '/pages/shootCard/shootCard',
    })
    
  
  },
  //设置名片识别的数据
  setShootData(){
   
    var res = wx.getStorageSync("SHOOT_RES");
    if(!res){
      return;
    }
    wx.removeStorageSync("SHOOT_RES")
    this.setData({
      "company.full_name": res.data.company[0],
      "card.address": res.data.addr[0],
      "card.name": res.data.name,
      "card.job": res.data.title[0],
      "card.jobArr": common.splitByPoint(res.data.title[0]),
      "card.email": res.data.email[0],
      "card.phone": res.data.tel_cell[0],

      "card.company_id": ""
    });

    wx.showToast({
      title: '信息已更新',
    })

    this.loadFont(this.data.card);

    this.getCompanyList(res.data.company[0]).then((list) => {

      if (list) {
        for (var company of list) {
          this.setData({
            "card.logo": company.logo
          });
        }
      }
    });


    this.pageScrollToBottom();
  },
  //获取主题列表
  getTheme:function(){

    return new Promise(resolve => {
      app.post(
        "Card/getTheme",
        {},
        (res) => {
         
          var list = [];
          for (var key in res.data.data){
            list.push({
              type:key,
              cover: res.data.data[key][0].tpl_list,
              name: res.data.data[key][0].name,
              list: res.data.data[key]
            });
          }
        
          if (this.data.card.tpl != "" && this.data.card.tpl != null){
            list[0].list[1] = {
              name: list[0].list[0].name,
              tpl_id: 0,
              tpl_list: this.data.card.tpl,
              tpl_type: list[0].list[0].tpl_type,
              tpl: this.data.card.tpl
            };
          }
          



          this.setData({
            themeList: list,
            curTheme: list[0],
            curCover:list[0].list[0]
          });
          console.log("themeList:",list);
          resolve();
        }
      );
    });

    
  },
  //选择主题
  selectTheme:function(e){
    
    var type = e.currentTarget.dataset.type;
    for(var obj of this.data.themeList){
      if (obj.type == type){
        this.setData({
          curTheme:obj,
          curCover: obj.list[0],
          current:0
        });

        break;
      }
    }
  },

  changeCover:function(e){
    
    var current = e.detail.current;
    for(var i in this.data.curTheme.list){
      if (current == i){
        this.setData({
          curCover: this.data.curTheme.list[i]
        });
      }
    }
    
  },
  
  //input输入
  inputHandle:function(e){
 
    var key = e.currentTarget.dataset.key;
    var val = e.detail.value;
    var param = {};
    param[key] = val;
   
    
    this.setData(param);

    if (key == "card.name") {
      this.data.card.name = val;
      this.loadFont(this.data.card);
    }

    if(key == "card.job"){
     
      var arr = common.splitByPoint(this.data.card.job);
      if(arr.length > 2){
        wx.showToast({
          title: '只能输入两个职位',
          icon:"none"
        })
        return;
      }
      for(var index in arr){
        
        var t = arr[index]
        if(t.length > 8){
          wx.showToast({
            title: '职位' + (parseInt(index) + 1) +'长度超过8个汉字',
            icon: "none"
          })
          return;
        }
      }

      this.setData({
        "card.jobArr": common.splitByPoint(this.data.card.job)
      });
    }
    
  },
  //公司input输入事件
  
  inputCompany:function(e){
    var val = e.detail.value;
    if(this.data.timer){
      clearTimeout(this.data.timer);
    }

    this.data.timer = setTimeout(() => {
      this.setData({
        "company.full_name":val,
        "card.company_id":""
      });
      this.getCompanyList(val).then((list) => {
        this.setData({
          companyList: list
        });
      
      });
    },200);
  },
  //提交
  submit:function(){
    if(this.data.type == EDIT_TYPE.ADD){
      //创建名片
      this.create();
    }else if(this.data.type == EDIT_TYPE.EDIT){
      //修改名片
      this.update();
    } else if (this.data.type == EDIT_TYPE.SHOOT){
      //拍名片
      this.shoot();
    }
  },
  //保存拍名片
  shoot:function(){
    //判断时候有card.company_id，有则直接添加card,无则先查询到card.company_id
    if (this.data.card.company_id == "" || this.data.card.company_id == null) {
      //无则先查询到card.company_id
      this.getCompanyList(this.data.company.full_name).then((list) => {
        if (list.length > 0) {
          //如果数据库里有该公司，直接设置该公司的company_id
          this.setData({
            "card.company_id": list[0].id
          });
          this.addShoot();
        } else {
          //如果数据库里没有改公司，就新建公司
          this.addCompany().then(() => {
            this.addShoot();
          });
        }
      });

    } else {
      //有则直接添加card
      this.addShoot();
    }
  },
  //保存拍名片
  addShoot:function(){
    
    if (!this.verifyCardData()) {
      return;
    }

    Promise.all([this.uploadShootImg(), this.uploadLogo()]).then(() => {

      var param = this.data.card;
      //param.head_img = app.globalData.userInfo.avatarUrl;
      param.tpl_id = 0;
      param.banner_img = this.data.shootImg;
      param.tpl_list = this.data.shootImg;


      app.post(
        "Card/createCardFromCam",
        param,
        (res) => {
          
          wx.showToast({
            title: '已保存名片',
            mask: true
          })

          wx.navigateBack({
            delta: 1
          })

          //发送短信
          app.post(
            "Sms/send",
            {
               phone: param.phone,
               user_name: wx.getStorageSync("NICK_NAME")
            
            },
            () => {

            }
          );
        }
      );
    });
  },
  //上传拍摄版的图片
  uploadShootImg:function(){
    return new Promise((resolve) => {
      app.uploadFile(this.data.shootImg).then((res) => {
        this.data.shootImg = res;
        resolve();
      });
     
    });
  },
  //创建名片
  create:function(){
    //判断时候有card.company_id，有则直接添加card,无则先查询到card.company_id
    if (this.data.card.company_id == "" || this.data.card.company_id == null){
      //无则先查询到card.company_id
      this.getCompanyList(this.data.company.full_name).then((list) => {
        if(list.length > 0){
          //如果数据库里有该公司，直接设置该公司的company_id
          this.setData({
            "card.company_id": list[0].id
          });
          this.addCard();
        }else{
          //如果数据库里没有改公司，就新建公司
          this.addCompany().then(() => {
            this.addCard();
          });
        }
      });

    }else{
      //有则直接添加card
      this.addCard();
    }

  },
  //添加公司
  addCompany:function(){
    return new Promise((resolve,reject) => {
      if (this.data.company.full_name == "" || this.data.company.full_name == null){
        this.setData({
          "card.company_id": 0
        });
        resolve();
      }else{
        app.post(
          "Card/addNewCompanyInfo",
          this.data.company,
          (res) => {

            this.setData({
              "card.company_id": res.data.data.company_id
            });
            resolve();
          }
        );
      }
      
      
    });
  },
  //添加名片
  addCard:function(){
    if(!this.verifyCardData()){
      return;
    }
   
    this.uploadLogo().then(() => {

     


      var param = this.data.card;
      param.head_img = app.globalData.userInfo.avatarUrl;
      param.tpl_id = this.data.curCover.tpl_id;
     
      param.tpl_list = this.data.curCover.tpl_list;

      app.uploadFile(this.data.customImg).then((res) => {
        param.tpl = res;
        param.banner_img = this.data.curCover.tpl_list;
        if (param.tpl_id == 0) {
          param.banner_img = res;

        }

        app.post(
          "Card/createCard",
          param,
          (res) => {
            
            if (res.data.error_code == 0) {
              var card_id = res.data.data.card_id;
              var param = {};
              var scene = "a=" + card_id;
              param.scene = scene;
              param.page_url = "card/detail/detail";
              app.getCodePicBackgroud(param);

              wx.setStorageSync("CREATE_CARD", "1");
              setTimeout(() => {

                wx.switchTab({
                  url: '/pages/card/index/index',
                })
                // var pages = getCurrentPages();
                // if (pages[pages.length - 2].route == "card/detail/detail") {
                //   wx.navigateBack({
                //     delta: 1
                //   })
                // } else {
                //   wx.switchTab({
                //     url: '/pages/card/index/index',
                //   })
                // }
              }, 1500);
            } else {
              wx.showToast({
                title: res.data.mssage,
              })
            }

          }
        );

      });
      
      
      
      
      
    });
   
  },

  //修改名片
  update:function(){
    //判断时候有card.company_id，有则直接修改card,无则先查询到card.company_id
    if (this.data.card.company_id == "" || this.data.card.company_id == null) {
      //无则先查询到card.company_id
      this.getCompanyList(this.data.company.full_name).then((list) => {
        if (list.length > 0) {
          //如果数据库里有该公司，直接设置该公司的company_id
          this.setData({
            "card.company_id": list[0].id
          });
          this.updateCard();
        } else {
          //如果数据库里没有改公司，就新建公司
          this.addCompany().then(() => {
            this.updateCard();
          });
        }
      });

    } else {
      //有则直接修改card
      this.updateCard();
    }
  },
  //修改名片
  updateCard: function () {
    if (!this.verifyCardData()) {
      return;
    }

    this.uploadLogo().then(() => {
      var param = this.data.card;
      param.head_img = app.globalData.userInfo.avatarUrl;
      param.card_id = param.id;
      param.tpl_id = this.data.curCover.tpl_id;
      delete param.id;


      app.uploadFile(this.data.customImg).then((res) => {
        if(res != ""){
          param.tpl = res;
        }
        
        param.banner_img = this.data.curCover.tpl_list;
        if (param.tpl_id == 0 && res != "") {
          param.banner_img = res;
        }


        app.post(
          "Card/updateCard",
          param,
          () => {
            wx.showToast({
              title: '已修改您的名片',
              mask: true
            })



            wx.navigateBack({
              delta: 1
            })
          }
        );
      });
    })
  },
 
  
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = parseInt(options.type);
   
    if (type == EDIT_TYPE.ADD){
      //新建card
      this.loadFont(this.data.card);
      this.getTheme();
    } else if (type == EDIT_TYPE.EDIT){
      //修改card
   
      this.setData({
        title: '编辑名片'
      });
      var card = wx.getStorageSync("card");
     
      card.jobArr = common.splitByPoint(card.job);
     
      this.loadFont(card); 

      this.setData({
        card:card,
        "company.full_name":card.full_name,
        isChangeLogo:false
      });
      this.getTheme().then(() => {
        
        for (var theme of this.data.themeList){
          for(var i in theme.list){
            
            if (theme.list[i].tpl_list == card.banner_img){
              
              this.setData({
                curTheme:theme,
                curCover: theme.list[i],
                current:i
              });
            }
          }
        }
      });
    } else if (type == EDIT_TYPE.SHOOT){
   
  
      this.setData({
        title: '拍名片'
      });
     
    
      this.setData({
        shootImg: wx.getStorageSync("SHOOT_IMG")
      });

      this.setShootData();

    }

    
    this.setData({
      type: type
    });
  },

  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom,
        duration: 0
      })
    }).exec()
  },

  //查询公司列表
  getCompanyList:function(name){

    return new Promise((resolve,reject) => {
      if (name == "" || name == null) {
       
        resolve([]);
      }else{
        app.post(
          "Card/selectCompany",
          {
            company_name: name,
            page: 1,
            size: 100
          },
          (res) => {
            console.log(res);
            resolve(res.data.data);
            
          }
        );
      }
      
    });

    
  },

  //选择一个公司
  selectCompany:function(e){
    var id = e.currentTarget.dataset.id;
    for(var company of this.data.companyList){
      if(id == company.id){
        
        this.setData({
          "company.full_name": company.full_name,

          "card.company_id": id,
          "card.logo": company.logo,
          showCompanyList:false
        });
        break;
      }
    }
   
    
  },

  //换LOGO
  changeLogo: function () {
    wx.chooseImage({
      count: 1,
      success: res => {

        var img = res.tempFilePaths[0];
        this.setData({
          "card.logo": img,
          isChangeLogo:true
        });
      }
    })
  },
  //上传LOGO
  uploadLogo: function () {
    return new Promise((resolve) => {
      if (this.data.card.logo == "" || this.data.isChangeLogo == false) {
        resolve();
      } else {
        app.uploadFile(this.data.card.logo).then((res) => {
          this.setData({
            "card.logo": res
          });
          resolve();
        });
        
      }
    });
  },

  verifyCardData:function(){
    
    // if (this.data.card.company_id == "" || this.data.card.company_id == null) {
    //   wx.showToast({
    //     title: '请填写公司名称',
    //     icon: 'none',
    //     mask: true
    //   })
    //   return false;
    // }
    if (this.data.card.name == "" || this.data.card.name == null) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        mask: true
      })
      return false;
    }
    if (this.data.card.phone == "" || this.data.card.phone == null) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        mask: true
      })
      return false;
    }
    // if (this.data.card.address == "" || this.data.card.address == null) {
    //   wx.showToast({
    //     title: '请填写地址',
    //     icon: 'none',
    //     mask: true
    //   })
    //   return false;
    // }

    return true;
  },
  //企业定制
  customize:function(){
    wx.showModal({
      title: '提示',
      content: '请联系公众号“简单人脉”',
      showCancel:false,
      success(res) {
       
      }
    })
  },

  focused:function(e){
    
    var key = e.currentTarget.dataset.key;
    
    for (var k in this.data.focus){
      
      this.data.focus[k] = false;
    }
    this.data.focus[key] = true;

    this.setData({
      focus: this.data.focus
    });
   
  },

  inputFocus:function(e){
    
    var id = e.currentTarget.id;
    if(id == "input-company"){
      this.setData({
        showCompanyList:true
      });
    }


    this.setData({
      showSave:false
    });
  },

  inputBlur:function(){
    this.setData({
      showSave: true
    });
    this.pageScrollToBottom();

    setTimeout(() => {
      this.setData({
        showCompanyList: false
      });
    },500);

   
  },

 
  //自定义主题
  customTheme:function(){
    wx.chooseImage({
      count: 1,
     
      sourceType: ['album', 'camera'], 
      success:  (res) => {
        var tempFilePaths = res.tempFilePaths
        wx.setStorageSync("IS_CUSTOM_THEME", "1");
        wx.navigateTo({
          url: '/pages/cutImg/cutImg?image=' + tempFilePaths,
        })
        
      },
      fail: function (res) {
        
      }
    })

    
  },

  setCustomTheme:function(){
    var IS_CUSTOM_THEME = wx.getStorageSync("IS_CUSTOM_THEME");
    if (IS_CUSTOM_THEME !== "") {
      wx.removeStorageSync("IS_CUSTOM_THEME");
      
      var coverImage = wx.getStorageSync("coverImage");
      if (coverImage == ""){
        return;
      }

       
        this.data.themeList[0].list[1] = {
          name: this.data.themeList[0].list[0].name, 
          tpl_id: 0, 
          tpl_list: coverImage, 
          tpl_type: this.data.themeList[0].list[0].tpl_type, 
          tpl: coverImage
        };

        this.setData({
          themeList: this.data.themeList,
          curTheme: this.data.themeList[0],
          curCover: this.data.themeList[0].list[1],
          isCustomImg:true,
          customImg: coverImage
        });
       

       
   
      
    }
    
  },
  //保存自定义主题
  saveCustomTheme:function(img){
    if (this.data.type == EDIT_TYPE.EDIT){
      var param = { tpl: img}
      app.post(
        "Card/updateCard",
        param,
        () => {

         
        }
      );
    }
    
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
    
    this.setCustomTheme();
    this.setShootData();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

