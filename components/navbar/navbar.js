const app = getApp();
Component({
  properties: {
    navbarData: {  
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { 

      }
    },
    title:String,
    home:{
      type:Boolean,
      value:false
    },
    back: {
      type: Boolean,
      value: true
    },
    search: {
      type: Boolean,
      value: false
    },
    isSelfBack:{
      type: Boolean,
      value: false
    }

  },
  data: {
    isReady:false
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
   
  },
  ready:function() { 
    setTimeout(() => {
      this.setData({
        isReady: true
      });
    },800);
    
  },
  methods: {
    // 返回上一页面
    _navback() {
   
      if (this.data.isSelfBack){
        this.triggerEvent("selfBack", {});
      }else{
        wx.navigateBack()
      }
      
    },

    //进入搜索
    _search() {
      wx.navigateTo({
        url: '../../../people/pages/search/search',
      })
      
    }, 

    //返回到首页
    _backhome() {
      wx.switchTab({
        url: '/pages/card/index/index',
      })
    }
  }

})

