module.exports = {

  /** 
   * 时间戳转化为年 月 日 时 分 秒 
   * number: 传入时间戳  13位
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
   */
  formatTime: function(number, format) {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));

    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    returnArr.push(this.formatNumber(date.getSeconds()));

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  },


  //数据转化
  formatNumber: function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  dateFromString: function(time) {
    time = time.replace(/-/g, ':').replace(' ', ':')
    time = time.split(':')
    var time1 = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])

    var monthDate = this.formatNumber(time1.getMonth() + 1) + "." + this.formatNumber(time1.getDate());
    return monthDate;
  },

  dateFromString1: function (time) {
    time = time.replace(/-/g, ':').replace(' ', ':')
    time = time.split(':')
    var time1 = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])

    var minutes=0;
    if (time1.getMinutes() == 0) {
      minutes = "00";
    } else {
      minutes = time1.getMinutes();
    }
    var result = this.formatNumber(time1.getMonth() + 1) + "月" + this.formatNumber(time1.getDate() + "日" + time1.getHours() + ":" + minutes);
    return result;
  },

  getTimeSec:function(ctsTime) {
    return new Date(ctsTime.replace(/-/g, "/")).getTime(); 
  },

  createDate: function (time){
    
    time = time.replace(/-/g, ':').replace(' ', ':')
    time = time.split(':')
    time = time.map((item) => {
      return parseInt(item);
    })
    var time1 = new Date(time[0], (time[1] - 1), time[2], time[3], time[4])
    return time1;
  }

}