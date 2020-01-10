// people/peopleWelfare/peopleWelfare.js
const app = getApp();
const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');
var business = require('../../business/business.js');
var jump = require('../../../util/aplets.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '人脉福利',
    barBg: '#ffffff',
    holderBg: '#00000000',
    color: '#000',

    isLoadFinish: false,
    dataSource: [],
    dataSourceCat: [],
    cardId: 0,

    page: 0,
    size: 10,
    hasMore: true,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.data.page = 0;
    this.loadPeopleWelfareList();
  },

  loadPeopleWelfareList: function() {
    if (!this.data.hasMore) {
      return;
    }
    this.data.page++;

    app.post(constant.PEOPLE_GET_AWARDS, {
        page: this.data.page,
        size: this.data.size,
      },
      (res) => {

        console.log("人脉福利:", res);

        var list = res.data.data;
        if (this.data.page == 1 && list.length == 0) {
          this.setData({
            dataSource: null,
            isLoadFinish: true,
          });
        } else {
          if (list.length < this.data.size) {
            this.setData({
              hasMore: false,
              page: this.data.page,
            });
          }

          this.data.dataSourceCat = this.data.dataSourceCat.concat(list);
          list = this.newPeopleInfo(this.data.dataSourceCat); 
          //list = this.newPeopleInfo(res.data.data);
          if (list == null) {
            return;
          } 
          var dataList = list;
          //this.data.dataSource.concat(list);

          this.setData({
            dataSource: dataList,
            isLoadFinish: true,
          });
        }

      }, true);
  },

  newPeopleInfo: function(array) {

    if (!array || array.length == 0) {
      
      return null;
    }

    var peopleList = business.configurationNewPeopleArr(array);

    var resultList = [];
    if (peopleList != null || peopleList.length > 0) {
      var dataTimeArr = business.getTimeItemFromPeopleList(peopleList);
      resultList = business.getResultPeopleData(dataTimeArr);

      for (var item of array) {
        var firstName = business.getFirstChar(item);
        var time = business.getToolBarTime(item.cts_time);
        var temIndex = dataTimeArr.indexOf(time);

        resultList[temIndex].firstChar.push(firstName);
        resultList[temIndex].dataList.push(item);

      }
    }

    console.log("===resultList:" + resultList);
    return resultList;
  },

  getItemIndex: function(id) {
    var infoArr = [{
      pos: "",
      index: ""
    }];

    var msgList = this.data.dataSource;
    for (var i = 0; i < msgList.length; i++) {
      var dataList = msgList[i].dataList;
      for (var j = 0; j < dataList.length; j++) {
        if (dataList[j].card_id == id) {
          infoArr.pos = i;
          infoArr.index = j;

          return infoArr;
        }

      }
    }

    return -1;
  },

  clickPeopleWelfareItem: function (e) {

    var infoArr = this.getItemIndex(e.currentTarget.dataset.id);
    var activeType = this.data.dataSource[infoArr.pos].dataList[infoArr.index].active_type;
    var activeId = this.data.dataSource[infoArr.pos].dataList[infoArr.index].active_id;
    var cardId = e.currentTarget.dataset.id;

    
    this.jumpIntoDetail(activeType, cardId, activeId);
  },


  receiveBtn: function(e) {

    var infoArr = this.getItemIndex(e.currentTarget.dataset.id);
    var activeType = this.data.dataSource[infoArr.pos].dataList[infoArr.index].active_type;
    var activeId = this.data.dataSource[infoArr.pos].dataList[infoArr.index].active_id;
    var cardId = e.currentTarget.dataset.id;

    app.post(constant.PEOPLE_CHECK_AWARDS, {
        active_type: activeType,
        active_id: activeId,
      },
      (res) => {
        console.log("领取:", res);

        if (res.data.error_code == 0) {
          this.jumpIntoDetail(activeType, cardId, activeId);

        } else {

          wx.showToast({
            title: res.data.mssage,
          })
        }

      });

  },

  //去找福利
  findWelfareBtn: function(e) {
    wx.switchTab({
      url: '/pages/welfare/index/index'
    })
  },

  //领取跳转相应页面
  jumpIntoDetail: function (type, cardId, activeId) {
    wx.setStorageSync("HAVE_JOINED", false);
    this.data.cardId = cardId;
    //1：红包 2：福利
    if (type == 1) {
      wx.navigateTo({
        url: "/card/detail/detail?card_id=" + cardId,
      });
    } else if (type == 2) {
      wx.navigateTo({
        url: "/welfare/pages/detail/detail?active_id=" + activeId,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var hadReceive = wx.getStorageSync("HAVE_JOINED");
    //点击过领取后返回当前页面触发
    if (hadReceive) {
    
      if (this.data.cardId != 0) {
        debugger
        var infoArr = this.getItemIndex(this.data.cardId);
        var param = {};
        var string = 'dataSource[' + infoArr.pos + '].dataList[' + infoArr.index + '].status';

        param[string] = 1; //1代表已领取

        this.setData(param)
       
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadPeopleWelfareList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})