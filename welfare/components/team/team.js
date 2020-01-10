// component/team/team.js
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
    teamNumList: [2, 4, 6, 8],
    teamNumIndex: 0,


    isTeam: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    teamChange: function (e) {
      

      var isKoulin = wx.getStorageSync("isKoulin");
      if (isKoulin == true) {
        wx.showToast({
          title: '口令与组队只可选择一种',
          icon: "none"
        })
        this.setData({
          isTeam:false
        });
        return;
      }    



      var val = e.detail.value;
      this.setData({
        isTeam: val
      });
      wx.setStorageSync("isTeam", this.data.isTeam);
      this.triggerEvent("teamChange",{isTeam:this.data.isTeam,teamNum:this.data.teamNumList[this.data.teamNumIndex]});
    },

    changeTeamNum: function (e) {

      var index = e.target.dataset.index;
      this.setData({
        teamNumIndex: index
      });

      this.triggerEvent("teamChange", { isTeam: this.data.isTeam, teamNum: this.data.teamNumList[this.data.teamNumIndex] });
    },

    tip: function () {
     

      this.selectComponent("#myModal").open({
        title: '组队',
        content: '开启后，参与者可邀请好友组队参与福利，帮助福利传播，一人中奖则全队中奖。发起人需提供额外份数的奖品，例如8人组队，中奖后，共需提供8个奖品。'
      });
    }

  }
})
