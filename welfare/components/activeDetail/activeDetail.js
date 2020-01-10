// welfare/components/activeDetail/activeDetail.js
const date = require("../../../util/date.js");

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    invite_user_id:Number,
    is_more:Boolean,
    active:Object,
    isSeries:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageHidden:true,

    hiddenKl: true,
    actionHidden: true,
  
    //当前活动
    active: null,
    user_id: wx.getStorageSync("user_id"),

    //倒计时的显示字符串
    timeDownStr: "",
    //参与者列表
    activeUserList: [],
    //参与者总数
    activeUserTotal: 0,
    //队伍成员列表
    teamUserList: [],
 
    //我的抽奖码
    ref_id: "",
    //是否选择了地址
    isChooseAddress: false,
    //地址详情
    address: "",
    //tab
    tab: "图文",
    //中奖者列表 [{nickname:"",icon:"",ref_id:'',win_lev:1}]
    winUserList: [],
    //中奖者列表，带奖品名称
    winPrizeList:[],
    //我是否中奖
    isWin: false,
    //我中了那个奖品
    win_lev: 0,
    //中奖概率
    probable: 0,

    nickname: "",

    joined:false,
    nextActiveBottom:-200,

    bili: 750 / app.globalData.myDevice.screenWidth
  },

  lifetimes: {
   
    attached() {
      
      this.setData({
        nickname: wx.getStorageSync("NICK_NAME"),
        active_id:this.data.active.active_id
      });
      
      Promise.all([
       
        //我是否参加抽奖
        this.isJoin()
      ]).then(() => {
        

        //开奖时间倒计时
        this.timeDown();

        this.setData({
          pageHidden: false
        });
        //显示开奖结果
        if (this.data.active.status == 1) {
          this.showResult();
        }
        //获取参与者列表
        this.getActiveUserList();
        //判断是否组队
        if (this.data.active.group_user_limit == 0) {
          
        } else {
          //判断是否我参加抽奖
            
         
            //获得队长的token
            this.getCaptainId().then(() => {
              //获取队伍成员列表
              return this.getTeamUserList();
            }).then(() => {
              this.setTeamBtn();
            });
          

        }
      });
      
     },

     ready:function(){
     
     }

   
  },

  pageLifetimes: {
  
    show() {
      var address = wx.getStorageSync("address");
      this.setData({
        address: address
      });
     },
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
   
    switchAction: function () {

      this.triggerEvent("switchAction");
     
    
    },

    //提交参与抽奖
    submitJoinActive: function () {
     

      var param = {};
      param.active_id = this.data.active_id;
      param.formID = this.data.formId;
      if (this.data.invite_user_id) {
        param.invite_user_id = this.data.invite_user_id
      }
      if (this.data.active.active_key != "" && this.data.active.active_key != null) {
        param.active_key = this.data.active.active_key
      }

      app.post(
        "User/joinActive",
        param,
        (res) => {
          wx.setStorageSync("HAVE_JOINED", true);
          wx.setStorageSync("I_JOIN_ACTIVE", this.data.active_id);

          var joinedList = wx.getStorageSync("JOINED_LIST");
          if (joinedList){
            joinedList.push(this.data.active_id);
          }else{
            joinedList = [];
            joinedList.push(this.data.active_id);
          }
          wx.setStorageSync("JOINED_LIST", joinedList);

          //res.data.data.ref_id
          this.setData({
            ref_id: res.data.data.ref_id
          });

          
          //判断是否组队
          if (this.data.active.group_user_limit == 0) {

          } else {
            
            if(!this.data.invite_user_id){
              this.setData({
                invite_user_id: this.data.user_id
              });
            }
            this.triggerEvent("setInviteUserId", { invite_user_id: this.data.invite_user_id});
            //后去队伍成员列表
            this.getTeamUserList().then(() => {
              this.setTeamBtn();
            });
          }
          //获取参与者列表
          this.getActiveUserList().then(() => {

            if (this.data.active.open_type == 2 && this.data.activeUserList.length >= this.data.active.open_users) {
              this.showResult();
            }

          });;

        }

      );
    },


    //点击参与抽奖的按钮
    joinActive: function (e) {
      if (this.data.joined) {
        return;
      }

      this.setData({
        joined:true
      });



      //参与抽奖按钮展示时，说明未被点击，状态false
      wx.setStorageSync("HAVE_JOINED", false);
      var formId = e.detail.formId;
      if (formId == "the formId is a mock one") {
        formId = "af34ba5800199516f1c5e2d1f994555a";
      }

      // af34ba5800199516f1c5e2d1f994555a
      this.data.formId = formId;

      //判断是否需要口令
      if (this.data.active.active_key == "" || this.data.active.active_key.length == 0) {

        this.submitJoinActive();
      } else {
        
        this.triggerEvent("openKl");
      }

      //判断是否需要组队
    },



    //我是否参加抽奖
    isJoin: function () {

      return new Promise((resolve) => {
        app.post(
          "User/isJoin",
          { active_id: this.data.active_id },
          (res) => {
            console.log("isJoin:", res);

            if (res.data.data) {
              var ref_id = res.data.data.ref_id;
              this.setData({
                ref_id: ref_id,
                joined:true
              });
             
            } else {
              this.setData({
                ref_id: ""
              });
              
            }
            resolve();
          },
          false
        );
      });

    },


  
    //获得参与者列表
    getActiveUserList: function () {


      return new Promise((resolve) => {
        app.post(
          "Active/getActiveUserList",
          {
            active_id: this.data.active_id,
            page: 1,
            size: 8
          },
          (res) => {

            console.log("getActiveUserList:", res);
            var total = res.data.data.total;
            var userList = res.data.data.userlist;
            for (var obj of userList) {
              obj.nickname = app.base64Decode(obj.nickname);
            }
            this.setData({
              activeUserTotal: total,
              activeUserList: userList
            });

            resolve();
          },
          false
        );
      });
    },


    //获得中奖者列表
    getWin: function () {
      return new Promise((resolve) => {
        app.post(
          "Active/getWonUserList",
          { active_id: this.data.active_id },
          (res) => {
            
            var list = res.data.data;
            
            var arr = [
              { prize_name: this.data.active.prize_name1, win_lev:1,num_text:"一",users:[]},
              { prize_name: this.data.active.prize_name2, win_lev: 2, num_text: "二", users: []},
              { prize_name: this.data.active.prize_name3, win_lev: 3, num_text: "三", users: []}
            ]
            
            for (var obj of list) {
              obj.nickname = app.base64Decode(obj.nickname);
              obj.prizeName = this.data.active["prize_name" + obj.win_lev];

              arr[obj.win_lev - 1].users.push(obj);

              if (obj.ref_id == this.data.ref_id) {
                this.setData({
                  isWin: true,
                  win_lev: obj.win_lev
                });

                
              }
            }

            for(var i = arr.length - 1; i >=0;i--){
              if(arr[i].users.length == 0){
                arr.splice(i,1);
              }
            }
            
            this.setData({
              winUserList: list,
              winPrizeList:arr
            });
            
            this.triggerEvent("setWishData", 
              { 
                isWin: this.data.isWin, 
                win_lev: this.data.win_lev, 
                ref_id: this.data.ref_id,
                winPrizeList: arr
              });
            resolve();
          },
          false
        );
      });

    },


    //获得队长的token
    getCaptainId: function () {


      return new Promise((resolve) => {
        if (this.data.invite_user_id){
          resolve();
          return;
        }
        app.post(
          "Active/getGroupID",
          {
            active_id: this.data.active_id
          },
          (res) => {
            
            this.setData({
              invite_user_id: res.data.data
            });
            this.triggerEvent("setInviteUserId", { invite_user_id: this.data.invite_user_id });
            resolve();
          },
          false
        );
      });

    },


    //获得队伍成员列表
    getTeamUserList: function () {

      return new Promise((resolve) => {
        
        var param = {};
        param.active_id = this.data.active_id;
        if (this.data.invite_user_id) {
          param.group_id = this.data.invite_user_id;
        } else {
          param.group_id = wx.getStorageSync("user_id");
        }

        app.post(
          "Active/getGroupUsers",
          param,
          (res) => {

            

            var userList = res.data.data;
            for (var obj of userList) {
              obj.nickname = app.base64Decode(obj.nickname);
            }
            this.setData({

              teamUserList: userList
            });

            resolve();
          },
          false
        );
      });

    },


    //开奖时间倒计时
    timeDown: function () {

      setTimeout(() => {

        var open_date = this.data.active.open_date;
        var d = new Date(open_date.replace(/-/g, '/'));
        var now = new Date();
        var offset = d.getTime() - now.getTime();
        if (offset <= 0) {
          this.setData({
            timeDownStr: "0天0小时0分0秒"
          });
        } else {
          var second = Math.floor(offset / 1000);
          var day = Math.floor(second / 3600 / 24);

          second = second - day * 3600 * 24;
          var hour = Math.floor(second / 3600);

          second = second - hour * 3600;
          var minute = Math.floor(second / 60);

          second = second - minute * 60;

          this.setData({
            timeDownStr: day + "天" + hour + "小时" + minute + "分" + second + "秒"
          });

          this.timeDown();
        }


      }, 1000);
    },


   


    //炫耀
    flaunt: function () {
     
        var param = {};
        param.scene = "1";
        param.page_url = "pages/welfare/index/index";

      // app.getCodePicGroup(param).then((filePath) => {
        
      //   wx.setStorageSync("qrcode", filePath);
      //   wx.setStorageSync("active", this.data.active);
      //   wx.setStorageSync("ref_id", this.data.ref_id);
      //   wx.setStorageSync("probable", this.data.probable);
      //   wx.setStorageSync("win_lev", this.data.win_lev);
      //   wx.setStorageSync("activeUserTotal", this.data.activeUserTotal);
      //   wx.navigateTo({
      //     url: '../share/share?type=2',
      //   })
      // });
      
      wx.setStorageSync("qrcode", "/img/main-qrcode.jpg");
      wx.setStorageSync("active", this.data.active);
      wx.setStorageSync("ref_id", this.data.ref_id);
      wx.setStorageSync("probable", this.data.probable);
      wx.setStorageSync("win_lev", this.data.win_lev);
      wx.setStorageSync("activeUserTotal", this.data.activeUserTotal);
      wx.navigateTo({
        url: '../share/share?type=2',
      })

    },

    //显示开奖结果
    showResult: function () {
      this.setData({
        tab: "开奖"
      });
      //获取中奖者
      this.getWin().then(() => {
        //如果我中奖了，去获得地址
        if (this.data.isWin) {
          this.getAddress();
          //计算中奖概率
          if (this.data.activeUserTotal == 0) {
            this.getActiveUserList().then(() => {
              var probable = this.data.winUserList.length / this.data.activeUserTotal;
              this.setData({
                probable: probable
              });
            });
          } else {
            var probable = this.data.winUserList.length / this.data.activeUserTotal;
            this.setData({
              probable: probable
            });
          }
        }
      });
    },


    //手动开奖
    openActive: function () {
      app.post(
        "Active/openActiveByManual",
        { active_id: this.data.active_id },
        (res) => {

          //显示开奖结果

          this.setData({
            "active.status": 1
          });
          this.showResult();

        }
      );
    },


    //领取积分
    getPoint: function () {
      return new Promise((resolve) => {
        app.post(
          "Active/getPoint",
          {
            active_id: this.data.active_id
          },
          function (res) {
            
            if (res.data.error_code == 0) {
              wx.showToast({
                title: res.data.data
              })
            } else {
              wx.showToast({
                title: res.data.mssage
              })
            }



            resolve();
          }
        );
      });

    },

    toCardDetail: function () {

      var card_id = this.data.active.id;
      if (card_id == null || card_id == "" || card_id == 0) {
        wx.showToast({
          title: 'TA还未创建名片',
          icon: "none"
        })
        return;
      }

      wx.navigateTo({
        url: '/card/detail/detail?card_id=' + card_id
      })
    },
   
    //选择地址
    chooseAddress: function () {
      wx.setStorageSync("active", this.data.active)
      wx.navigateTo({
        url: '../address/address?type=1',
      })
    },
    //去修改地址
    updateAddress: function () {
      wx.setStorageSync("active", this.data.active)
      wx.navigateTo({
        url: '../address/address?type=2',
      })
    },
    //获得收货地址
    getAddress: function () {
      return new Promise((resovle) => {
        app.post(
          "User/getMyOrder",
          { active_id: this.data.active_id },
          (res) => {

            if (res.data.data) {
              this.setData({
                address: res.data.data
              });
              wx.setStorageSync("address", res.data.data);
            } else {
              this.setData({
                address: ""
              });
              wx.setStorageSync("address", "");
            }

            resovle();

          }
        );
      });

    },
    //跳转中奖者详情
    toWinner: function () {
      wx.setStorageSync("active", this.data.active);
      wx.navigateTo({
        url: '../winner/winner',
      })
    },


    //切换tab
    changeTab: function (e) {

      var tab = e.target.dataset.tab;
      this.setData({
        tab: tab
      });
    },
    //打开别的小程序
    openApp: function () {

      var param = {};
      param.appId = this.data.active.appid;
      if (this.data.active.applets_url != null && this.data.active.applets_url != "") {
        param.applets_url = this.data.active.applets_url;
      }

      wx.navigateToMiniProgram(param);
    },

    //一键复制到剪切板
    copy: function (e) {
      console.log(e);
      wx.setClipboardData({
        data: e.currentTarget.dataset.content,
        success(res) {


        }
      })
    },
    //查看口令
    lookKoulin:function(){
      wx.showModal({
        title: '查看口令',
        content: this.data.active.active_key,
        cancelText:"取消",
        cancelColor:"#000",
        confirmText:"复制",
        confirmColor:"#576B95",
        success:(res) => {
          if (res.confirm) {
            wx.setClipboardData({
              data: this.data.active.active_key,
              success:(res) => {

                wx.showToast({
                  title: '口令已复制',
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    //显示下一个活动
    showNextActive:function(){
      
      const animation = wx.createAnimation({
        duration: 400
      })
      
      animation.translateY(-100).step();
      var a = animation.export()
      this.setData({
        nextAniData: a,
        isShowNextActive:true
      });


    },

    setTeamBtn:function(){
    

      this.setData({
        teamBtnLeft: 750 * 0.2
      });

      if (this.data.ref_id && this.data.teamUserList.length < this.data.active.group_user_limit){
        this.setData({
          teamBtnLeft: -750 * 0.4
        });
      }
      
      
    },

    teamStart:function(e){
      if(!this.data.ref_id){
        return;
      }
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
      this.data.x = x;
      this.data.y = y;
      this.data.left = e.currentTarget.offsetLeft;
      this.data.posX = this.data.teamBtnLeft;
      this.setData({
        transition:"0ms"
      })
    },
    teamMove: function (e) {
      if (!this.data.ref_id) {
        return;
      }
      var x = e.touches[0].clientX;
      this.data.lastX = x;

      var offsetX = x - this.data.x;
     
    
      this.setData({
        teamBtnLeft: (this.data.left + offsetX) * this.data.bili
      });
      
    },
    teamEnd: function (e) {
      if (!this.data.ref_id) {
        return;
      }
      this.setData({
        transition: "400ms"
      })
    
      var offsetX = this.data.lastX - this.data.x;
      if (this.data.posX == 750 * 0.2){
        if (offsetX < - 100){
          this.setData({
            teamBtnLeft: -750 * 0.4
          });
        }else{
          this.setData({
            teamBtnLeft: 750 * 0.2
          });
        }
      }
      if (this.data.posX == -750 * 0.4){
        if (offsetX > 100){
          this.setData({
            teamBtnLeft: 750 * 0.2
          });
        }else{
          this.setData({
            teamBtnLeft: -750 * 0.4
          });
        }
      }
      
    },

    showShi:function(){
      this.triggerEvent("showShi")
    },

    toNameList:function(){
      //winUserList: [],
      //winPrizeList: [],
      wx.setStorageSync("winUserList", this.data.winUserList);
      wx.setStorageSync("winPrizeList", this.data.winPrizeList);
      wx.navigateTo({
        url: '../nameList/nameList',
      })
    },

    waitPublic:function(){
      wx.showToast({
        title: '福利正在审核中...',
        icon:"none"
      })
    }
  }
})
