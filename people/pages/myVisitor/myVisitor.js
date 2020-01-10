// people/myVisitor/myVisitor.js
const app = getApp();
const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');
var jump = require('../../../util/aplets.js');
var business = require('../../business/business.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我的访客',
    barBg: '#ffffff',
    holderBg:'#00000000',
    color: '#000',

    isLoadFinish: false,
    dataSource: [],
    dataSourceCat:[],
    page: 0,
    size: 10,
    hasMore: true,

    cardId: 0,
    shareImg: null,
  },
  
  createCardShare: function () {
    this.data.shareImg = wx.getStorageSync("MY_SHARE_BG_IMG");
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.createCardShare();
    this.setData({
      cardId: wx.getStorageSync("CARD_ID"),
    })


    this.data.page= 0;
    this.loadMyVisitorList();
  },

  mergeData:function(data){
    var listCard = data.visitors;
    var listNoCard = data.visitors_no_card;

    var list = [];
    for (var card of listCard) {
      card.nickname = app.base64Decode(card.nickname);
      list.push(card);
    }
    
    for (var card of listNoCard) {
      card.nickname = app.base64Decode(card.nickname);
      list.push(card);

    }
   
    return list;
  },

  loadMyVisitorList:function(){
    if (!this.data.hasMore) {
      return;
    }
    this.data.page++;

    app.post(constant.PEOPLE_GET_VISITORS, {
      page: this.data.page,
      size: this.data.size,
    },
      (res) => {

        console.log("我的访客:", res);

        var list = this.mergeData(res.data.data);
        
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
          list = this.myVisitorInfo(this.data.dataSourceCat);
         // list = this.myVisitorInfo(list);
          if (list == null) {
            return;
          } 
          var dataList = list; 
          //this.data.dataSource.concat(list);
          console.log("====dataList=====", dataList);
          this.setData({
            dataSource: dataList,
            isLoadFinish: true
          });
        }
      }, true);
  },

  myVisitorInfo: function (array) {
 
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

  clickMyVisitorItem: function (e) {

    var cardId = e.currentTarget.dataset.id;
    jump.jump(cardId);
  },

  //创建我的名片
  clickCreateCardBtn: function () {
    var cardId = this.data.cardId;//wx.getStorageSync("CARD_ID");
    jump.jump(cardId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMyVisitorList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var titleText = "这是我的红包名片，请您惠存";

    var path = "/card/detail/detail?card_id=" + this.data.cardId + "&share=1";

    return {
      title: titleText,
      path: path,
      imageUrl: this.data.shareImg
    }
  }
})