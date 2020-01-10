// card/detail/detail.js
const app = getApp();
const constant = require("../../util/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我的名片',
    barBg: '#ffffff',
    color: '#000',

    pageHidden: true,
    isHome: false,
    isBack: true,
    //是否我的名片？
    isMy: false,
    //我是否有名片
    iHave: false,
    //我的名片
    myCard: null,
    //名片ID
    card_id: null,
    //名片信息
    card: null,
    nameArr: [],

    //产品服务
    products: [],

    isShare :false,




    //名片状态
    status: 0,
    userAvatarUrl: "",
    userNickName: "",
    //分享图
    shareImg: "",

    isInit:false

  },
  //查询名片详情
  getCard: function() {
    return new Promise((resovle) => {

     
        app.post(
          "Card/getCard", {
            card_id: this.data.card_id
          },
          (res) => {
            
            if (res.data.error_code != 0) {
              resovle();
              return;
            }
            var card = res.data.data.card_info;
            card.id = this.data.card_id;
            this.setData({
              card: res.data.data.card_info

            });
            wx.setStorageSync("card", this.data.card);

            //创建分享图
            app.createShareImg(this.data.card, (path) => {
              
              this.setData({
                shareImg: path
              });
            });

            resovle();
          },
          false
        );
     
      
    });

  },



  //查询产品列表
  getProducts: function() {
    app.post(
      "Card/getProducts", {
        card_id: this.data.card_id
      },
      (res) => {
        if (res.data.data == "" || res.data.data == null) {
          return;
        }
        var products = res.data.data.products;

        if (products == null || products.length == 0) {
          return;
        }
        products = JSON.parse(products);
        var list = [];
        for (var k in products) {
          list.push(products[k]);
        }
        this.setData({
          products: list
        });
      }, false
    );
  },



  //获取的我名片
  getMyCard: function() {
    return new Promise((resolve) => {
      if (this.data.myCard == null){
        app.post(
          "Card/getMyCardStatus", {},
          (res) => {
            
            if (res.data.error_code != 0){
              resolve();
              return;
            }
            var card = res.data.data.card_info;
            if (card) {
              this.setData({
                iHave: true,
                myCard: card
              });

              if (card.id == this.data.card_id) {
                this.setData({
                  isMy: true
                });

              }
            } else {
              this.setData({
                iHave: false
              });
            }
            resolve();
          },
          false
        );
      }else{
        resolve();
      }

      
    });

  },

  //我与该名片的关系
  userCard: function() {
    return new Promise((resolve,reject) => {
      if (this.data.card_id == null){
        reject();
      }

      app.post(
        "People/userCard", {
          card_id: this.data.card_id
        },
        (res) => {
          
          if (res.data.data) {
            
            this.setData({
              status: res.data.data.status,
              step: res.data.data.step
            });
          }else{
            this.setData({
              status: 0,
              step:0
            });
          }

         
          resolve();
        },
        false
      );
    });
    
  },









  //保存名片
  saveCard: function() {
    
    if (this.data.card.user_id == 0){
      //return;
    }
    app.post(
      "People/saveContact", {
        card_id: this.data.card_id
      },
      (res) => {
        console.log("--------saveContact---------");
        console.log(res);
        console.log("--------saveContact---------");
        if (res.data.error_code == 0) {
          
          this.setData({
            status: res.data.data.status,
            step: res.data.data.step
          });
          wx.showToast({
            title: '名片已保存',
            mask: true
          })
        }else{
          wx.showToast({
            title: res.data.mssage,
          })
        }
      },
      false
    );
  },

  //回递名片
  sendCard: function() {
    app.post(
      "People/sendBack", {
        card_id: this.data.card_id
      },
      (res) => {
        console.log("--------sendCard---------");
        console.log(res);
        console.log("--------sendCard---------");
        if (res.data.error_code == 0) {
          this.setData({
            status: res.data.data.status,
            step: res.data.data.step
          });
          if(this.data.step == 3){
            wx.showToast({
              title: '已回递名片',
              mask: true
            })
          }else{
            wx.showToast({
              title: '已互存名片',
              mask: true
            })
          }
          
        } else {
          wx.showToast({
            title: res.data.mssage,
          })
        }
      }
    );
  },
  //交换名片
  exchangeCard:function(e){
    var formId = e.detail.formId;
    if (formId == "the formId is a mock one") {
      formId = "af34ba5800199516f1c5e2d1f994555a";
    }
  
    app.post(
      "People/sendExchange", {
        card_id: this.data.card_id,
        form_id: formId
      },
      (res) => {
        console.log("--------sendExchange---------");
        console.log(res);
        console.log("--------sendExchange---------");
        if (res.data.error_code == 0) {
          this.setData({
            status: res.data.data.status,
            step: res.data.data.step
          });
          wx.showToast({
            title: '已申请交换名片',
            mask: true
          })
        }else{
          wx.showToast({
            title: res.data.mssage,
          })
        }
      }
    );
  },

  //同意交换
  agreeExChangeBtn: function (e) {

    app.post(
      constant.PEOPLE_AGREE_EXCHANGE, {
        card_id: this.data.card_id,
      },
      (res) => {
        console.log("--------agreeExChange---------");
        console.log(res);
        console.log("--------agreeExChange---------");

        if (res.data.error_code == 0) {
          this.setData({
            status: res.data.data.status,
            step: res.data.data.step
          });
          wx.showToast({
            title: '已互存名片',
            mask: true
          })
        } else {
          wx.showToast({
            title: "请求已过期"
          })
        }

      });
  },


  addPhone: function() {
    if ((!this.data.isShare) && this.data.card.public_card == 0 && (!this.data.status)){
      wx.showToast({
        title: '交换名片可保存',
        icon:"none"
      })
      return;
    }
    var arr = this.data.card.name.split("");
     var name1,name2,name3;
    if (arr.length < 3) {
      wx.addPhoneContact({
        firstName: arr[1] ? arr[1] : "",
        lastName: arr[0] ? arr[0] : "",
        mobilePhoneNumber: this.data.card.phone,
        success(res) {
          
        },
        fail(res) {
          
        }
      });
    } else {
        wx.addPhoneContact({
          firstName: arr[2] != null ? arr[2] : "",
          middleName: arr[1] ? arr[1] : "",
          lastName: arr[0] ? arr[0] : "",
          mobilePhoneNumber: this.data.card.phone,
          success(res) {
            
          },
          fail(res) {
            
          }
        });
    }
    
  },

  reportCardId: function() {
    app.post(
      "People/visited", {
        card_id: this.data.card_id
      },
      (res) => {
        console.log("上报返回：", res);
      }, false
    );
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var card_id;
    if (options.scene) {
      //扫码进入
      var scene = decodeURIComponent(options.scene);
      var arr = scene.split("&");
      card_id = parseInt(arr[0].split("=")[1]);


      this.setData({
        isBack: false,
        isHome: true
      });

    } else if (options.share) {
      //转发进入
      card_id = parseInt(options.card_id);
      this.setData({
        isBack: false,
        isHome: true,
        isShare:true
      });
    } else {
      //跳转进入

      card_id = parseInt(options.card_id);
    }



    this.setData({
      card_id: card_id
    });

    app.checkLogin();
 
    

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(!this.data.isInit){
      this.init();
    }
   

    
    if (this.data.isMy && this.data.isOnShow){
      //如果是我的名片，每次页面显示都要更新数据
      this.getCard();
      //查询产品列表
      this.getProducts();
    }
    
    this.data.isOnShow = true;
  },

  init:function(){
    wx.showLoading({
      title: '加载中',
    })

    Promise.all([
      //获取当前名片
      this.getCard(),
      //获取我的名片 
      this.getMyCard(),
      //获取我跟该名片的关系 
      this.userCard()
    ]).then(() => {
      //判断是不是我的名片
      if (this.data.isMy) {
        //是我的名片
        this.setData({
          title: '我的名片',
          status: 6
        });

      } else {
        //不是我的名片
        this.setData({
          title: this.data.card.name + '的名片'
        });
        //我与该名片的关系

        if (this.data.status == 0 || this.data.status == null) {
          //如何使分享进来的，自动保存名片
          if (this.data.isShare) {
            this.saveCard();
          }

        }
        //上报card_id给后端
        this.reportCardId();
      }
      this.setData({
        pageHidden: false,
        isInit:true
      });

      wx.hideLoading();
    });
  },

  loadFont: function() {

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
        success: () => {

        }
      })
    }

    this.setData({
      nameArr: ss
    });


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

  deleteCard: function (e) {
   
    wx.showModal({
      // title: '提示',
      content: '确认删除？',
      success: (res) => {
        
        if (res.confirm) {
          app.post(
            constant.PEOPLE_DELCONTACT, 
            {
              card_id: this.data.card_id,
            },
            (res) => {
              
              wx.showToast({
                title: '已删除',
                mask:true,
                success : () => {
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  },1500);
                  
                }
              })
            });

        } 
      }
    })

  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  onShareAppMessage: function(res) {
    
    var titleText;
   
    if (this.data.card.user_id == 0) {
      //拍摄进来的用户
      titleText = "这是" + this.data.card.name + '的名片，推荐给您'
    } else {
      //自己的卡片或通过分享进来的用户
      if (res.from == "button") {
        //1: 服务评价邀请
        if (res.target.dataset.id == 1) {
          titleText = "Hi，给我的产品业务攒个口碑吧~";
        } else if (res.target.dataset.id == 2) {
          //2: 伙伴印象邀请
          titleText = "Hi，给我的好友印象来个点评吧~";
        } else if (res.target.dataset.id == 3) {
          //3: 发名片
          if (this.data.isMy) {
            titleText = "这是我的红包名片，请您惠存";
          } else {
            titleText = "这是" + this.data.card.name + '的红包名片，推荐给您'
          }

        }
      } else {
        if (this.data.isMy) {
          titleText = "这是我的红包名片，请您惠存";
        } else {
          titleText = "这是" + this.data.card.name + '的红包名片，推荐给您'
        }
      }
    }

    var path = "/card/detail/detail?card_id=" + this.data.card_id + "&share=1";
  
    return {
      title: titleText,
      path: path,
      imageUrl: this.data.shareImg
    }
  }


})