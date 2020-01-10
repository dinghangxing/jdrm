const common = require("../util/common.js");
module.exports = Behavior({
  /**
   * 组件的属性列表
   */
  properties: {
    isMy: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changedPath) {

      }
    },
    isShare: Boolean,
    status: Number,
    step: Number,
    card: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {

        if (newVal) {

          if (newVal.job != "" && newVal.job != null) {


            newVal.jobArr = common.splitByPoint(newVal.job);
            this.setData({
              "card.jobArr": newVal.jobArr
            });
          }

          this.loadFont();
        }

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

    nameArr: [],

  },

  /**
   * 组件的方法列表
   */
  methods: {


    loadFont: function () {

      var arr = this.data.card.name.split("");
      var ss = arr.map((s) => {
        var obj = {};
        obj.str = s;
        obj.code = s.charCodeAt();
        return obj;
      })
      for (var o of ss) {
        wx.loadFontFace({
          family: 'f' + o.code,
          source: 'url("https://ddg-font.oss-cn-hangzhou.aliyuncs.com/' + o.code + '.ttf")',
          success: () => {

          }
        })
      }

      this.setData({
        nameArr: ss
      });


    },

    //去修改名片
    toUpdateCard: function () {
      wx.setStorageSync("card", this.data.card);
      wx.navigateTo({
        url: '/card/edit/edit?type=2'
      })
    },

    copy: function (e) {

      var val = e.currentTarget.dataset.cp;
      if (val == null || val.length == 0) {
        return;
      }


      wx.setClipboardData({
        data: val,
        success(res) {
          var title = e.currentTarget.dataset.title;
          wx.showToast({
            title: title + '已复制',
          })
        }
      })
    },
  }
})