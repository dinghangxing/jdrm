// component/kou-lin/kou-lin.js
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isKoulin: false,
    active_key:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    koulinChange: function (e) {
     
      var isTeam = wx.getStorageSync("isTeam");
      if (isTeam == true){
        wx.showToast({
          title: '口令与组队只可选择一种',
          icon:"none"
        })
        this.setData({
          isKoulin:false
        });
        return;
      }      

      var val = e.detail.value;
      this.setData({
        isKoulin: val
      });

      wx.setStorageSync("isKoulin", this.data.isKoulin);
    },

    input:function(e){
      var val = e.detail.value;
      this.setData({
        active_key: val
      });

      wx.setStorageSync("active_key", this.data.active_key);
    },

    tip:function(){
     

      this.selectComponent("#myModal").open({
        title: '口令',
        content: '需输入口令才能参与福利，可使用关注公众号或加好友的方式获取口令。'
      });
    }
  }
})
