
var date = require('../util/date.js');

module.exports = {

  data: {
    PAGE_SIZE: 10,
    //待提交
    SUBMIT: 4,
    //待发布
    RELEASE: 3,
    // 待开奖
    LOTTERY: 2,
    // 已结束
    HAD_OVER: 1,

  },

  saveInfo: function(data){
    
    console.log("数据+" + data.total + ": ", data);

    var list = data.active_list;
    var saveList = [];
    if (list != null && list.length > 0) {

      for (let i = 0; i < list.length; i++) {
        var activeId = list[i].active_id;
        var background = list[i].prize_img1;
        var nickName = app.base64Decode(list[i].nickname);

        var prizeItem;
        if (list[i].prize_name1.length > 0) {
          prizeItem = list[i].prize_name1 + "x" + list[i].prize_num1;
        }

        if (list[i].prize_name2.length > 0) {
          prizeItem = prizeItem + "," + list[i].prize_name2 + "x" + list[i].prize_num2;
        }

        if (list[i].prize_name3.length > 0) {
          prizeItem = prizeItem + "," + list[i].prize_name3 + "x" + list[i].prize_num3;
        }

        //发布时间
        var timeStamp2 = Date.parse(date.dateFromString(list[i].start_date));
        let releaseTime = date.formatTime(timeStamp2, 'Y年M月D日 h:m');

        //1 自动开奖; 2 人数满开奖; 3 手动开奖
        let lottery;
        if (list[i].open_type == 1) {
          lottery = "自动开奖";
          //开奖时间  时间转时间戳 如："2018-12-13 14:30:44"
          var timeStamp = Date.parse(date.dateFromString(list[i].open_date));
          let time = date.formatTime(timeStamp, 'Y年M月D日h:m');

          lottery = " " + time + lottery;

        } else if (list[i].open_type == 2) {
          lottery = "人数达到" + list[i].open_users + "人自动开奖";

        } else if (list[i].open_type == 3) {
          lottery = "由发起人手动开奖";
        }


        let gender;
        if (list[i].is_gender == 0) {
          gender = "不限";
        } else if (list[i].is_gender == 1) {
          gender = "男";
        } else if (list[i].is_gender == 2) {
          gender = "女";
        }

        let activeKey;
        if (list[i].active_key.length > 0) {
          activeKey = true;
        } else {
          activeKey = false;
        }

        let groupUserLimit;
        if (list[i].group_user_limit == 0) {
          groupUserLimit = false;
        } else {
          groupUserLimit = true;
        }

        saveList.push({
          activeId: activeId,
          background: background,
          prizes: prizeItem,
          nickName: nickName,
          releaseTime: releaseTime,
          gender: gender,
          activeKey: activeKey,
          groupUserLimit: groupUserLimit,
          lottery: lottery,
        });
      }

      return saveList;

    } else {

      return null;
      
    }

  },

  getTotalPageValue: function (total) {
    var totalPage;
  
    if (total % this.data.PAGE_SIZE == 0) {
      totalPage = total / this.data.PAGE_SIZE;
    } else {
      totalPage = Math.ceil(total / this.data.PAGE_SIZE);
    }

    return totalPage;
  },

  judgeUpPage: function (page, totalPage) {

    if (page == totalPage) {
      return false;

    } else {
      return true;

    }
  },

}