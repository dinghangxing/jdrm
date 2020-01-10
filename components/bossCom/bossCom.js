// card/bossCom/bossCom.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    card_id:Number,
    isMy:Boolean,
    iHave:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    //boss评价选项
    bossComData: [],
    //boss评价列表
    bossComList: [],
    //选中的boss评价
    selectedBossCom: {},
    //是否显示boss评价弹框
    isShowBossCom: false,
    //最近评价
    user_list:[],
     //评价总数
    total_count:0,
    //统计列表
    countList:[],
    //是否显示统计弹窗
    isShowCount:false,
    //最大的统计对象
    maxCount:null,


    //isOpenNoCard:false
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      
     
     
     },
     ready() {
      
       this.getBossComData().then(() => {
         this.getBossComList()
       });
       
       this.getRecentBossCom();
   
     }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() { 
      this.getRecentBossCom();
    }
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toShare:function(res){
   
      wx.setStorageSync("shareText","111111");
    },
    //获取Boss评价选项
    getBossComData: function () {
      return new Promise(resolve => {
        app.post(
          "Impress/getBossCommentList",
          {},
          (res) => {
            
            this.setData({
              bossComData: res.data.data
            });

            resolve();
          },
          false
        );
      });
     
    },
    //获取boss评价
    getBossComList: function () {
      app.post(
        "Impress/getBossComment",
        { card_id: this.data.card_id },
        (res) => {
        
          var list = res.data.data;

          var arr = [].concat(this.data.bossComData);
          var total_count = 0;
          var maxCount = { total_count :0}
          for(var a of arr){
            a.total_count = 0;
            for(var l of list){
              if(a.content == l.content){
                a.total_count = l.total_count;
                total_count += a.total_count;

                if (a.total_count > maxCount.total_count){
                  maxCount = a;
                }
              }
            }
          }
          
          this.setData({
            total_count: total_count,
            countList:arr,
            maxCount: maxCount
          });
          
        },
        false
      );
    },

    //获得最近boss评价
    getRecentBossCom: function () {
      app.post(
        "Impress/bossRecentComment",
        {card_id:this.data.card_id},
        (res) => {
          
          this.setData({
            user_list: res.data.data.user_list
          });
        },
        false
      );
    },
    //打开boss评价弹框
    showBossCom: function () {
      if(this.data.isMy){
        this.setData({
          isShowCount:true
        });
      }else{
        this.setData({
          isShowBossCom: true
        });
      }

      
     
    },
    //关闭boss评价弹框
    closeBossCom: function () {
      if(this.data.isMy){
        this.setData({
          isShowCount: false
        });
      }else{
        this.setData({
          isShowBossCom: false
        });
      }

     
    },
    //选择boss评价
    selectBossCom: function (e) {
      if (!this.data.iHave){
        this.openNoCard();
        return;
      }

      var id = e.currentTarget.dataset.id;
      for (var o of this.data.bossComData) {
        if (o.id == id) {
          this.setData({
            selectedBossCom: o
          });
          break;
        }
      }
    },
    //提交boss评价
    submitBossCom: function () {
      if (this.data.selectedBossCom.id == null) {
        wx.showToast({
          title: '请选择一个评价',
          icon: "none",
          mask: true
        })
        return;
      }
   
      app.post(
        "Impress/bossComment",
        {
          card_id: this.data.card_id,
          content: this.data.selectedBossCom.content,
          impress_id: this.data.selectedBossCom.id
        },
        (res) => {

          if (res.data.error_code == 0) {
            wx.showToast({
              title: '评价成功',
            
              mask: true
            })
           
          }else{
            wx.showToast({
              title: '已经评价过了',
              icon: "none",
              mask: true
            })
          }
          this.closeBossCom();
         

          this.getBossComList()
          this.getRecentBossCom();
        },
        false
      );
    },

    createCard:function(){
    //  this.closeNoCard();
     wx.navigateTo({
       url: '/card/edit/edit?type=1',
     })
    },

    openNoCard: function () {
      var self = this;
      wx.showModal({
        content: '您还未创建名片，无法评价',
        cancelText:"取消",
        confirmText:"立即创建",
        confirmColor: "#3ca1e1",
        success(res) {
          if (res.confirm) {
            self.createCard();
          } else if (res.cancel) {
            
          }
        }
      })

      // this.setData({
      //   isOpenNoCard:true
      // });
    },

    // closeNoCard:function(){
    //   this.setData({
    //     isOpenNoCard: false
    //   });
    // }
  }
 
})
