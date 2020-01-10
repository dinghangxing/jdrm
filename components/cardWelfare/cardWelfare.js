// components/cardWelfare/cardWelfare.js
const app = getApp();
const constant = require("../../util/constant.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isMy:{
      type: Boolean, 
      value: false,
      observer(newVal, oldVal, changedPath) {
       
      }
    },
    card_id:{
      type: Number,
      value: 0,
      observer(newVal, oldVal, changedPath) {
        
        this.getActiveInfo();
      }
    },
    card:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    //红包板块or福利板块数据
    joinList: [],
    animationData: {},
    showOpenRP: false,
    animationIntervalId: 0,
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() { },
    moved() { },
    detached() { },
  },

 

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() { 
      
      if(this.data.isMy){
        this.getActiveInfo();
      }
      
    },
    hide() { },
    resize() { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setActive: function () {
      
      //判断是自己的详情页，还是别人的详情页
      if (this.data.isMy) {
        //是自己
        wx.setStorageSync("JOIN_LIST", this.data.joinList);
        wx.setStorageSync("card", this.data.card);
        wx.navigateTo({
          url: '/card/welfare/welfare',
        })
      }
    },

    //查询活动信息
    getActiveInfo: function () {
      
      app.post(
        "Card/getActiveInfo", {
          card_id: this.data.card_id
        },
        (res) => {
          
          if (res.data.data.info == null) {
            this.setData({
              joinList: null
            });
          } else {
            var info = res.data.data.info;
            info.active_id = res.data.data.active_id;
            info.active_type = res.data.data.active_type;
            info.nickname = app.base64Decode(info.nickname);
            
            this.setData({
              joinList: info
            });
          }

        }, false
      );
    },

    //点击详情页中的红包
    clickOpenRedPackage: function () {
      //人脉福利中需要用到状态保存
      wx.setStorageSync("HAVE_JOINED", false);
      if (this.data.joinList == null) {
        return;
      }
      //判断是红包，还是福利
      if (this.data.joinList.active_type == 1) {
debugger
        //是红包
        app.post(
          constant.CHECK_IS_ALLOW, {
            lucky_id: this.data.joinList.active_id,
          },
          (res) => {
            console.log("检查是否可以展示抢红包页面",res);
            if (res.data.error_code == 0) {
              this.setData({
                joinList: this.data.joinList,
                showOpenRP: true,
              })
            } else {
              if (res.data.error_code != 0) {
                this.receiveLimit(res.data.mssage);
              }
            }
          }
        );


        
      } else {
        //是福利
        wx.navigateTo({
          url: '/welfare/pages/detail/detail?active_id=' + this.data.joinList.active_id,
        })
      }
    },

    clickOpenRP: function () {

      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
        delay: 0,
      })

      this.animation = animation

      this.setData({
        animationData: animation.export()
      })
      var n = 0;
      //连续动画需要添加定时器,所传参数每次+1就行
      this.data.animationIntervalId = setInterval(function () {
        n = n + 1;
        //this.animation.translateY(-60 * (n)).step()
        // console.log(n);
        this.animation.rotateY(360 * (n)).step()
        this.setData({
          animationData: this.animation.export()
        })
      }.bind(this), 800)


      var self = this;
      setTimeout(function () {
        self.stopAnimationInterval();
        self.setData({
          showOpenRP: false,
        })

        if (self.data.joinList != null) {
          wx.setStorageSync("JOIN_LIST", self.data.joinList);

          self.judgeIsMayJumpToRpDetail(self.data.joinList.active_id);

        }

      }, 1500);

    },

    judgeIsMayJumpToRpDetail: function (luckId) {

      app.post(constant.GET_LUCKY,
        {
          lucky_id: luckId,
        }, (res) => {
          console.log("判断是否可以进入抢红包页面返回：", res);

          if (res.data.error_code == 0) {
            
            wx.setStorageSync("HAVE_JOINED", true);
            
            wx.navigateTo({
              url: '/card/redPackage/openRP/rpDetail',
            })

          } else {
            if (res.data.error_code == 1) {
              this.receiveLimit(res.data.mssage);
            }
          }
        });
    },

   receiveLimit:function(msg){
     wx.showModal({
       title: '领取限制',
       content: msg,
       showCancel: false,
     })
   },

    /**
     * 停止旋转
     */
    stopAnimationInterval: function () {
      var animationId = this.data.animationIntervalId;
      if (animationId > 0) {
        clearInterval(animationId);
        this.data.animationIntervalId = 0;
      }
    },

    clickCheckReceiveDetail: function () {
      var self = this;
      setTimeout(function () {
        self.setData({
          showOpenRP: false,
        })
      }, 1000);

      wx.setStorageSync("JOIN_LIST", self.data.joinList);
      wx.navigateTo({
        url: '/card/redPackage/openRP/rpDetail',
      })

    },

    closeRPView: function () {
      this.setData({
        showOpenRP: false,
      })
    },

    heHasNot:function(){
      wx.showToast({
        title: 'TA未添加福利',
        icon:"none"
      })
    }
  }
})
