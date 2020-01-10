// component/spreadType/spreadType.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    versionType:"",

    bestList:[
      { name: "展示1天", dayNum: 1, newPrice: 88, oldPrice: 1500, p_id: 7},
      { name: "展示3天", dayNum: 3, newPrice: 188, oldPrice: 3000, p_id: 8},
      { name: "展示5天", dayNum: 5, newPrice: 288, oldPrice: 4500, p_id: 9}
    ],
    bestIndex:0,

    proList:[
      {name:"支付",price:9.9,priceDesc:"9.9/次",p_id:4},
      { name: "使用专业券", price: 100, priceDesc: "100张", desc: "剩余", p_id: 5},
      { name: "购买专业券\n10张", price: 88, priceDesc: "88", desc: 99, p_id: 6}
    ],
    proIndex:0,
  },

  attached:function(){
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change:function(e){
      console.log(e);

      var val = parseInt(e.detail.value);
      if(val == 2){
        wx.setStorageSync("p_id", this.data.proList[this.data.proIndex].p_id);
      }else if(val == 3){
        wx.setStorageSync("p_id", this.data.bestList[this.data.bestIndex].p_id);
      }

      this.setData({
        versionType:val
      });
      this.triggerEvent("typeChange",{type:val});
    },

    changeBest:function(e){
      
      this.setData({
        bestIndex: e.currentTarget.dataset.index
      });
      wx.setStorageSync("p_id", this.data.bestList[this.data.bestIndex].p_id);
    },
    changePro:function(e){
      this.setData({
        proIndex: e.currentTarget.dataset.index
      });

      wx.setStorageSync("p_id", this.data.proList[this.data.proIndex].p_id);
    }
  }
})
