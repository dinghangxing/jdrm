// people/newPeople/newPeople.js
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
    title: '新的人脉',
    barBg: '#ffffff',
    holderBg: '#00000000',
    color: '#000',

    isLoadFinish: false,

    pageHidden: true,
    dataSource: [],
    dataSourceCat: [],
    scrollY: true,
    page: 0,
    size: 10,
    hasMore: true,

    swipeCheckX: 35, //激活检测滑动的阈值
    swipeCheckState: 0, //0未激活 1激活
    maxMoveLeft: 85, //消息列表项最大左滑距离
    correctMoveLeft: 85, //显示菜单时的左滑距离
    thresholdMoveLeft: 75, //左滑阈值，超过则显示菜单
    lastShowMsgId: '', //记录上次显示菜单的消息id
    moveX: 0, //记录平移距离
    showState: 0, //0 未显示菜单 1显示菜单
    touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
    swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动

    cardId: 0,
    shareImg: null,

  },

  createCardShare: function() {
    this.data.shareImg = wx.getStorageSync("MY_SHARE_BG_IMG");

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad", options)
    this.createCardShare();
    this.setData({
      cardId: wx.getStorageSync("CARD_ID"),
    })

    this.data.page = 0;
    this.loadNewPeopleList();
  },

  mergeData: function (data) {
    var listCard = data.contacts;
    var listNoCard = data.contacts_no_card;

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

  loadNewPeopleList: function() {
    if (!this.data.hasMore) {
      return;
    }
    this.data.page++;

    app.post(constant.PEOPLE_GET_NEW_CONTACTS, {
        page: this.data.page,
        size: this.data.size,
      },
      (res) => {

        console.log("新的人脉:", res);

        //var list = res.data.data.contacts;
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
          list = this.newPeopleInfo(this.data.dataSourceCat);
          //list = this.newPeopleInfo(list);
          if (list == null) {
            return;
          }

          var dataList = list;
          //this.data.dataSource.concat(list);

          this.setData({
            dataSource: dataList,
            cardId: this.data.cardId,
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
        if (firstName != null) {
          resultList[temIndex].firstChar.push(firstName);
        }
        resultList[temIndex].dataList.push(item);

      }
    }

    console.log("===resultList:", resultList);
    return resultList;
  },

  slideGoback: function() {
    this.data.showState = 0;
    this.data.moveX = 0;
    this.translateXMsgItem(this.data.lastShowMsgId, 0, 200);
    this.data.lastShowMsgId = "";
  },

  ontouchstart: function(e) {

    if (this.data.showState == 1) {

      this.data.touchStartState = 1;
      this.slideGoback();
      return;
    }
    this.data.firstTouchX = e.touches[0].clientX;
    this.data.firstTouchY = e.touches[0].clientY;
    if (this.data.firstTouchX > this.data.swipeCheckX) {
      this.data.swipeCheckState = 1;
    }
    this.data.lastMoveTime = e.timeStamp;
  },

  ontouchmove: function(e) {

    if (this.data.swipeCheckState === 0) {
      return;
    }
    //当开始触摸时有菜单显示时，不处理滑动操作
    if (this.data.touchStartState === 1) {
      return;
    }
    var moveX = e.touches[0].clientX - this.data.firstTouchX;
    var moveY = e.touches[0].clientY - this.data.firstTouchY;
    //已触发垂直滑动，由scroll-view处理滑动操作
    if (this.data.swipeDirection === 2) {
      return;
    }
    //未触发滑动方向
    if (this.data.swipeDirection === 0) {
      console.log(Math.abs(moveY));
      //触发垂直操作
      if (Math.abs(moveY) > 4) {
        this.data.swipeDirection = 2;

        return;
      }
      //触发水平操作
      if (Math.abs(moveX) > 4) {
        this.data.swipeDirection = 1;
        this.setData({
          scrollY: true
        });
      } else {
        return;
      }

    }
    //禁用垂直滚动
    // if (this.data.scrollY) {
    //   this.setData({scrollY:false});
    // }

    this.data.lastMoveTime = e.timeStamp;
    //处理边界情况
    if (moveX > 0) {
      moveX = 0;
    }
    //检测最大左滑距离
    if (moveX < -this.data.maxMoveLeft) {
      moveX = -this.data.maxMoveLeft;
    }

    this.data.moveX = moveX;
    this.translateXMsgItem(e.currentTarget.id, moveX, 0);
  },

  ontouchend: function(e) {

    this.data.swipeCheckState = 0;
    var swipeDirection = this.data.swipeDirection;
    this.data.swipeDirection = 0;
    if (this.data.touchStartState === 1) {
      this.data.touchStartState = 0;
      this.setData({
        scrollY: true
      });
      return;
    }
    //垂直滚动，忽略
    if (swipeDirection !== 1) {
      return;
    }
    if (this.data.moveX === 0) {
      this.data.showState = 0;
      //不显示菜单状态下,激活垂直滚动
      this.setData({
        scrollY: true
      });
      return;
    }
    if (this.data.moveX === this.data.correctMoveLeft) {

      this.data.showState = 1;
      this.data.lastShowMsgId = e.currentTarget.id;
      return;
    }
    if (this.data.moveX < -this.data.thresholdMoveLeft) {
      this.data.moveX = -this.data.correctMoveLeft;

      this.data.showState = 1;
      this.data.lastShowMsgId = e.currentTarget.id;
    } else {
      this.data.moveX = 0;
      this.data.showState = 0;
      //不显示菜单,激活垂直滚动
      this.setData({
        scrollY: true
      });
    }

    this.translateXMsgItem(e.currentTarget.id, this.data.moveX, 500);
    //this.translateXMsgItem(e.currentTarget.id, 0, 0);
  },
  onDeleteMsgTap: function(e) {
    var self = this;
    wx.showModal({
      // title: '提示',
      content: '确认删除？',
      success: function(res) {
        if (res.confirm) {
          app.post(
            constant.PEOPLE_DELCONTACT, {
              card_id: e.currentTarget.id,
            },
            (res) => {
              console.log("删除新人脉：" + "成功");
              self.deleteMsgItem(e);

            });

        } else if (res.cancel) {

        }
      }
    })
  },

  onMarkMsgTap: function(e) {
    console.log(e);
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

  deleteMsgItem: function(e) {
    // var animation = wx.createAnimation({
    //   duration: 200
    // });
    // animation.height(0).opacity(0).step();
    // this.animationMsgWrapItem(e.currentTarget.id, animation);
    var self = this;
    setTimeout(function() {
      var infoArr = self.getItemIndex(e.currentTarget.id);
      var dataAbcTab = self.data.dataSource[infoArr.pos];
      var dataList = self.data.dataSource[infoArr.pos].dataList;

      for (var i = 0; i < dataList.length; i++) {
        if (infoArr.index == i) {
          if (dataList.length == 1) {
            dataAbcTab.tag = null;
          }
          dataList.splice(i, 1);
          break;
        }
      }

      self.setData({
        dataSource: self.data.dataSource,
        scrollY: true
      });

    });

    this.slideGoback();

    //   var itemData = self.data.dataSource([infoArr.pos].dataList[infoArr.index]);
    //   self.data.dataSource.splice(itemData, 1);
    //   self.setData({
    //     dataSource: self.data.dataSource
    //   });

    // });

    // this.showState = 0;
    // this.setData({
    //  scrollY: true
    // });
  },

  translateXMsgItem: function(id, x, duration) {
    var animation = wx.createAnimation({
      duration: duration
    });
    animation.translateX(x).step();
    this.animationMsgItem(id, animation);
  },
  animationMsgItem: function(id, animation) {
    var infoArr = this.getItemIndex(id);
    var param = {};
    //var indexString = 'dataSource[' + index + '].animation';
    var indexString = 'dataSource[' + infoArr.pos + '].dataList[' + infoArr.index + '].animation';
    param[indexString] = animation.export();
    this.setData(param);
  },

  animationMsgWrapItem: function(id, animation) {
    var infoArr = this.getItemIndex(id);
    var param = {};
    //var indexString = 'dataSource[' + index + '].wrapAnimation';
    var indexString = 'dataSource[' + infoArr.pos + '].dataList[' + infoArr.index + '].wrapAnimation';

    //var inderTag = 'dataSource['+infoArr.pos+'].tag' + '=' + "'PoundSign'";

    param[indexString] = animation.export();

    this.setData(param);

  },


  clickNewPeopleItem: function(e) {

    var cardId = e.currentTarget.id;
    jump.jump(cardId);

  },

  showToast:function(msg){
    wx.showToast({
      title: msg,
    })
  },

  //保存请求
  clickSavePeopleBtn: function(e) {

    app.post(
      constant.PEOPLE_SAVE_CONTACT, {
        card_id: e.currentTarget.id,
      },
      (res) => {
        console.log("保存请求人脉：", res);
        if (res.data.error_code == 0) {
          this.onRefreshList(e.currentTarget.id, res.data.data.status,res.data.data.step);
        } else {
          this.showToast(res.data.mssage);
        }
      });

  },

  //回递请求
  clickReplyPeopleBtn: function(e) {

    app.post(
      constant.PEOPLE_SEND_BACK, {
        card_id: e.currentTarget.id,
      },
      (res) => {
        console.log("回递请求人脉：", res);
        if (res.data.error_code == 0) {
          this.onRefreshList(e.currentTarget.id, res.data.data.status,res.data.data.step);
        } else{
          this.showToast(res.data.mssage);
        }

      });

  },

  //交换请求
  clickExchangePeopleBtn: function(e) {
    app.post(
      constant.PEOPLE_SEND_EXCHANGE, {
        card_id: e.currentTarget.id,
      },
      (res) => {
        console.log("交换请求人脉：", res);
        
        if (res.data.error_code == 0) {
          this.onRefreshList(e.currentTarget.id, res.data.data.status,res.data.data.step);
        } else {
          this.showToast(res.data.mssage);
        }
      });

  },

  //同意交换
  clickAgreeExChangeBtn: function(e) {

    app.post(
      constant.PEOPLE_AGREE_EXCHANGE, {
        card_id: e.currentTarget.id,
      },
      (res) => {
        console.log("同意交换请求：", res);
        
        if (res.data.error_code == 0) {
          this.onRefreshList(e.currentTarget.id, res.data.data.status,res.data.data.step);
        }else{
          this.showToast(res.data.mssage);
        }

      });
  },

  onRefreshList: function(carId, status, step) {
    
    var infoArr = this.getItemIndex(carId);
    var dataList = this.data.dataSource[infoArr.pos].dataList;

    for (var i in dataList) {
      if (infoArr.index == i) {
        dataList[i].status = status;
        dataList[i].step = step;
        break;
      }
    }

    this.setData({
      dataSource: this.data.dataSource,
    })
  },

  clickCreateCard: function() {
    debugger
    var cardId = this.data.cardId;
    jump.jump(cardId);

    // wx.navigateBack({
    //   delta: 1,
    // })

    // setTimeout(() => {
    //   var cardId = this.data.cardId;
    //   jump.jump(cardId);
    // }, 100); 

  },

  //创建名片
  clickCreateCardBtn: function(e) {
    var cardId = this.data.cardId; //wx.getStorageSync("CARD_ID");
    jump.jump(cardId);
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
    this.loadNewPeopleList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    
    var titleText = "推荐简单人脉给您，来试试";
    var imageUrl = "/img/share_aplet_img.png";
    var path = "/pages/card/index/index";

    return {
      title: titleText,
      path: path,
      imageUrl: imageUrl
    }
  }
})