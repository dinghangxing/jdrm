Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
   
    tabBar: {
     
     
      "borderStyle": "#dcdcdc",
      "backgroundColor": "#ffffff",


      "selectedColor": "#3ca1e1",
      "color": "#777",
      "list": [
        {
          "pagePath": "pages/card/index/index",
          "text": "名片",
          "selectedIconPath": "/img/icon-mingpian.png",
          "iconPath": "/img/icon-mingpian-hui.png"
        },
        {
          "pagePath": "pages/people/index/index",
          "text": "人脉",
          "selectedIconPath": "/img/icon-renmai-lan.png",
          "iconPath": "/img/icon-renmai-hui.png"
        },
        {
          "pagePath": "pages/welfare/index/index",
          "text": "福利",
          "selectedIconPath": "/img/icon-gift-lan.png",
          "iconPath": "/img/icon-gift-hui.png"
        },
        {
          "pagePath": "pages/my/index/index",
          "text": "我的",
          "selectedIconPath": "/img/icon-wode-lan.png",
          "iconPath": "/img/icon-wode-hui.png"
        }
      ]
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change: function(e) {
      
      var index = e.currentTarget.dataset.index * 1
      if(index == this.data.index){
        return;
      }


      var item = this.data.tabBar.list[index]
      wx.reLaunch({
        url: "/"+item.pagePath
      })
    }
  }
})