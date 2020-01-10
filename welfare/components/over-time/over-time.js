// component/over-time/over-time.js
const dateUtil = require("../../../util/date.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    curOffset:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    days: [],
    hours: [],
    minutes: [],

    kjTime: [0, 12, 34],

    isSelectKjTime: false,

    kjsj_text: "根据发布时间和展示天数确定开奖时间"
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.initTime();
      
     setTimeout(() => {
      this.setData({
        kjTime:this.data.kjTime
      });
     },500);
     
     
    
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  pageLifetimes: {
    show: function () {
     
      // 页面被展示
     // this.initTime();
     
    },
    hide: function () {
      // 页面被隐藏
     
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openSelectKjTime: function () {
      this.setData({
        isSelectKjTime: !this.data.isSelectKjTime
      });
    },
    kjTimeChange: function (e) {
      var val = e.detail.value
      this.setData({
        kjTime: val
      });


      this.transmit();

    },
    initTime: function () {
    
      var now = new Date();
      now = now.getTime() + 1000 * 3600 * this.data.curOffset;
      now = new Date(now);

      var days = [];
      var hours = [];
      var minutes = [];
      for (var i = 0; i < 7; i++) {
        var time = now.getTime() + 1000 * 3600 * 24 * i;
        var tempDate = new Date(time);
        var year = tempDate.getFullYear();
        var month = tempDate.getMonth();
        var date = tempDate.getDate();
        var day = tempDate.getDay();
        var weekday = ["日", "一", "二", "三", "四", "五", "六"];
        var str = (month + 1) + "月" + (date < 10 ? "0" + date : date) + "日 周" + weekday[day];
        var obj = {
          year:year,
          month: month,
          date: date,
          day: weekday[day],
          str: str,
          dateObj: tempDate
        }
        days.push(obj);

      }
      
      for (let i = 0; i <= 23; i++) {
        hours.push(i)
      }

      for (let i = 0; i <= 59; i++) {
        minutes.push(i)
      }

     
      this.setData({
        days: days,
        hours: hours,
        minutes: minutes,
        kjTime: [0, now.getHours(), now.getMinutes()]
      });


      this.transmit();
      

    },

    transmit:function(){
        var dateObj = this.data.days[this.data.kjTime[0]];
        var year = dateObj.year;
      var month = dateObj.month < 10 ? "0" + (dateObj.month + 1) : (dateObj.month + 1);
      var date = dateObj.date < 10 ? "0" + dateObj.date : dateObj.date;

        var hour = this.data.hours[this.data.kjTime[1]];
        hour = hour < 10 ? "0" + hour : hour;

        var minute = this.data.minutes[this.data.kjTime[2]];
      minute = minute < 10 ? "0" + minute : minute;

      var str = year + "-" + month + "-" + date + " " + hour + ":" + minute; 
        if(this.data.title == "开奖时间"){
         
          wx.setStorageSync("open_date", str);
         
        } else if (this.data.title == "发布时间"){
         
          wx.setStorageSync("start_date", str);

          var product = wx.getStorageSync("product");

          var d = dateUtil.createDate(str);
          var t = d.getTime() + 1000 * 3600 * 24 * product.p_num;
          d = new Date(t);
        
        
          var year = d.getFullYear();
          var month = d.getMonth();
          var date = d.getDate();
          var day = d.getDay();
          var h = d.getHours();
          var m = d.getMinutes();

          var weekday = ["日", "一", "二", "三", "四", "五", "六"];
          var kjsj_text = (month + 1) + "月" + (date < 10 ? "0" + date : date) + "日 周" + weekday[day] + " " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
         
          this.setData({
            kjsj_text: kjsj_text
          });

        }
    }

  }
})
