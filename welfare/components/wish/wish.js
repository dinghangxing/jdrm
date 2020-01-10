// welfare/components/wish/wish.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isWin:{
      type: Boolean,
     
     
    },
    ref_id:{
      type: String,
      value: "aaaaa",
      observer(newVal, oldVal, changedPath) {
        this.start();
      }
    },
    win_lev:Number,
    active:Object,
    address:String,
    winPrizeList:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    isJoin:false,
    isOpen:false
  },
  ready() {
  
   
  },


  /**
   * 组件的方法列表
   */
  methods: {
    start:function(){
      
      if(this.data.ref_id == ""){
        this.setData({
          isJoin: false
        });
      }else{
        if(this.isLooked()){
          return;
        }

        this.setData({
          isJoin: true
        });
        setTimeout(() => {
          this.setData({
            isOpen: true
          });
        },1000);

      }
    },

    close:function(){
      this.setData({
        isJoin: false
      });
    },


    chooseAddress:function(){
    
      this.close();
      
      this.triggerEvent("chooseAddress")
    },
   
    flaunt:function(){
      this.close();
      this.triggerEvent("flaunt")
    },
    showShi:function(){
      this.close();
      this.triggerEvent("showShi")
    },
    toNameList:function(){
      this.close();
      this.triggerEvent("toNameList");
    },
    //是否看过结果
    isLooked:function(){
 
      var wishData = wx.getStorageSync("WISH_ACTIVE");
      if (wishData == ""){
        wishData = []
      }

      var flag = false;
      for (var item of wishData){
        if(item == this.data.ref_id){
          flag = true
        }
      }
      if (flag == false){
        wishData.push(this.data.ref_id);
        wx.setStorageSync("WISH_ACTIVE", wishData);
      }
     
      return flag;
    }
  }
})
