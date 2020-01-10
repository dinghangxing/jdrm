// pages/my/component/lottery/lottery.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showUI: String,
    list: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached: function() {
 
    console.log(this.data.showUI);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    deleteLotteryItem:function(e) {
      wx.showModal({
        title: '确定要删除这个抽奖活动？',
        content: '删除后，已支付的费用不会退还。',
        success :(res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            var id = e.currentTarget.dataset.id;
            this.triggerEvent("deleteLottery", { active_id: id });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    
    }
  }
})