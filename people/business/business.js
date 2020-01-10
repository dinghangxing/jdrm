var date = require('../../util/date.js');

module.exports = {

  data: {
 //   now.getTime() - 3600 * 24 * 1000 * 3;
    withinThree:"近三天",
    afterThree: "三天前",
  },

  getCurrentData:function(){
    var now = new Date();
    var currentTime = date.formatTime(now.getTime(), 'M.D');
    
    return currentTime;
  },


  getToolBarTime:function(ctsTime){
    var ctsTimeSec = date.getTimeSec(ctsTime);
    var now = new Date();
    var currentSec = now.getTime();

    var sec = parseInt((currentSec - ctsTimeSec)/1000);
    var threeSec = 3600 * 24 * 3;
    
    if (sec <= threeSec){
      return this.data.withinThree ;
    } else {
      return this.data.afterThree;
    }
  },

  configurationNewPeopleArr: function (array) {
    var peopleList = [];

    for (var i = 0; i < array.length; i++) {
      var obj = {};
      //var todayDate = this.getCurrentData();
      //var monthDate = date.dateFromString(array[i].cts_time);
      // if (todayDate == monthDate) {
      //   monthDate = "今天";
      // }

      //obj.tag = monthDate;
      obj.tag = this.getToolBarTime(array[i].cts_time);
      obj.dataList = [];
      peopleList[i] = obj;
    }

    return peopleList;
  },

  getTimeItemFromPeopleList: function (peopleList) {
    var timeArr = [];
    var j = 0;
    for (var item of peopleList) {
      timeArr[j++] = item.tag;
    }

    timeArr = [...new Set(timeArr)];

    return timeArr;
  },

  getFirstChar: function (item) {
 
    var firstChar = null;
    if (item != null && item.name != null) {
      firstChar = item.name.substr(0, 1);
      firstChar = firstChar.toUpperCase();
    }
   
    return firstChar;
  },

  getResultPeopleData: function (dataTimeArr) {
    var temDataArr = [];
    for (var i = 0; i < dataTimeArr.length; i++) {
      var obj = {};
      obj.tag = dataTimeArr[i];
      obj.firstChar=[];
      obj.dataList = [];
      temDataArr[i] = obj;
    }

    return temDataArr;
  },


}