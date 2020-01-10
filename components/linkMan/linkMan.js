// components/linkMan/linkMan.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isMy: { 
      type: Boolean,
      value: false, 
      observer(newVal, oldVal, changedPath) {
      
      }
    },

    card_id: {
      type: Number,
      value: 0,
      observer(newVal, oldVal, changedPath) {
        
        this.getSelectedCardList();
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    //TA的人脉
    selectedCardList: []
  },

  lifetimes: {
  
    attached() { 
     
    },
    moved() { },
    detached() { },
  },


  pageLifetimes: {
   
    show() {
      
      if(this.data.isMy){
        //获取TA的三个人脉
        this.getSelectedCardList();
      }
      
     },
    hide() { },
    resize() { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取TA的三个人脉
    getSelectedCardList: function () {
      
      app.post(
        "Card/getTop3Users", {
          card_id: this.data.card_id
        },
        (res) => {
          
          var list = res.data.data;
          for (var p of list) {
            p.firstChar = p.name.charAt(0);
          }
          
          this.setData({
            selectedCardList: list
          });

          wx.setStorageSync("selectedCardList", list)
        }, false
      );
    },

    toDetail:function(){

    }
  }
})
