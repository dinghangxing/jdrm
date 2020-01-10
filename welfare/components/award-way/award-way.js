// component/award/award-way.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type: Number,
      observer: function (newVal, oldVal, changedPath) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title:"按时间自动开奖",
    actionHidden: true,
    isShowAct: false,
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
     
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select:function(e){
      // if(this.data.type == 4){
      //   return;
      // }

      var val = e.currentTarget.dataset.val;
      var title = e.currentTarget.dataset.title;
      this.setData({
        title:title
      });
      this.triggerEvent("openTypeChange", parseInt(val));

      this.switchAction();
     
    },

    switchAction: function () {

      this.setData({

        actionHidden: !this.data.actionHidden
      });
      setTimeout(() => {
        this.setData({
          isShowAct: !this.data.isShowAct,

        });
      }, 50);

    },
   
  }
})
