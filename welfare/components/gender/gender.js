// component/gender/gender.js
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
    openGender:false,
    is_gender:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    genderSwitch:function(e){
      var val = e.detail.value;
      
      this.setData({
        openGender: val
      });
      wx.setStorageSync("openGender", this.data.openGender);
      wx.setStorageSync("is_gender", this.data.is_gender)
    },
    genderChange:function(e){
      var val = e.detail.value;
      this.setData({
        is_gender:val
      });
      wx.setStorageSync("openGender", this.data.openGender);
      wx.setStorageSync("is_gender", this.data.is_gender)
    },
    tip: function () {
      wx.showModal({
        title: '参与条件限制',
        content: '开启后，不满足对应条件的，将不允许参与抽奖活动。',
        showCancel: false
      })
    }
  }
})
