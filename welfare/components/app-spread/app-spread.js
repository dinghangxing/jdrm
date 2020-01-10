// component/app-spread/add-spread.js
Component({
 // externalClasses: ['cj-item', 'cj-item-top',"cj-item-val"],
  /**
   * 组件的属性列表
   */
  properties: {
  
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSpread: false
  },

  attached:function(){
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    spreadChange: function (e) {
      var val = e.detail.value;
      this.setData({
        isSpread: val
      });

      wx.setStorageSync("isSpread", val)
    },

    inputAppId:function(e){
      var val = e.detail.value;
    
      wx.setStorageSync("appid", val);
    
    },

    inputAppName:function(e){
      var val = e.detail.value;
     
      wx.setStorageSync("applets_name", val);
    },

    inputAppUrl:function(e){
      var val = e.detail.value;
    
      wx.setStorageSync("applets_url", val);
    },

    inputAppData:function(e){
      var val = e.detail.value;
     
      wx.setStorageSync("applets_param", val);
    }

  }
})
