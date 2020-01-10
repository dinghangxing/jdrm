// pages/people/index/index.js
const app = getApp();
const sortUtil = require("../../../util/sortUtil.js");
const constant = require("../../../util/constant.js");
var date = require('../../../util/date.js');
var jump = require('../../../util/aplets.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '人脉',
    barBg: '#ffffff',
    color: '#000',

    isLoadFinish: false,
    distanceTop: 0,

    alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],
    startTouchAlphabet: false,
    touchLetter: '',
    letterHeight: 0,
    dataSource: [],
    newPeople: [],
    myVisitor: [],
    peopleWelfare: [],
    isShowLoading: true,

    scrollY: true,

    swipeCheckX: 35, //激活检测滑动的阈值
    swipeCheckState: 0, //0未激活 1激活
    maxMoveLeft: 85, //消息列表项最大左滑距离   185
    correctMoveLeft: 85, //显示菜单时的左滑距离  165
    thresholdMoveLeft: 75, //左滑阈值，超过则显示菜单
    lastShowMsgId: '', //记录上次显示菜单的消息id
    moveX: 0, //记录平移距离
    showState: 0, //0 未显示菜单 1显示菜单
    touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
    swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动

    cardId: 0,
    card: null,
    shareImg: null,
    bottomHeight: false,

    allCard:0,
    cardNum:0,
    photodNum:0,
  },

  onInitLetterHeigth: function() {

    if (wx.createSelectorQuery) {
      var that = this
      var query = wx.createSelectorQuery().in(this)
      query.select('#alphabet').boundingClientRect(function(res) {
        if (res.height) {
          if (that.data.alphabet != null) {
            that.setData({
              letterHeight: res.height / that.data.alphabet.length,
              distanceTop: res.top
            })
          }
        } else {
          throw ('Initialization failed.')
        }
      }).exec()
    } else {
      throw ('当前基础库版本小于1.6.0，不支持alphabet-order-list组件')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this;
    this.data.bottomHeight=false;
    var wHeight;


    this.onInitLetterHeigth();
    this.setAbcInfo();

  },

  getLastPeopleFuli: function() {
    app.post(constant.PEOPLE_GET_LAST_FULI, {}, (res) => {
      console.log("人脉福利更新展示返回：", res);

      if (res.data.error_code == 0) {
        if (res.data.data != null) {

          this.setData({
            peopleWelfare: res.data.data,

          })
        }
        //人脉福利比对结束
      } else {
        this.setData({
          peopleWelfare: null,
        })
      }

    }, this.data.isShowLoading);
  },

  loadGetNotify: function(e) {

    app.post(constant.PEOPLE_GET_LAST_NOTIFY, {},
      (res) => {

        console.log("通知:", res);

        if (res.data.error_code == 0) {
          if (res.data.data != null) {

            this.setData({
              newPeople: res.data.data.new_contact,

            })
          }

          //新的人脉比对结束

          //我的访问比对开始
          if (res.data.data.visitor != null) {

            this.setData({
              myVisitor: res.data.data.visitor,
            })
          }


          //我的访问比对结束

        } else {
          this.setData({
            newPeople: null,
            myVisitor: null,

          })
        }

      }, false);
  },

  loadMyPeopleContacts: function() {

    app.post(constant.PEOPLE_GET_MY_CONTACTS, {},
      (res) => {

        console.log("人脉:", res);

        if (res.data.error_code == 0) {

          this.data.dataSource = this.groupby(res.data.data);
     
          this.setData({
            dataSource: this.data.dataSource,
            isLoadFinish: true,
            cardNum: this.data.cardNum,
            allCard: this.data.photodNum + this.data.cardNum,
          })
        }

      }, false);
  },

  setAbcInfo: function() {

    var alphabet = this.data.alphabet
    // if (alphabet.length == 26) {
    //   alphabet.push('PoundSign')
    this.setData({
      alphabet: alphabet
    })
    // }
  },


  groupby: function(array) {

    if (!array || array.length == 0) {
      this.setData({
        alphabet: null,
      })

      return null;

    } else {
      this.data.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];

      this.setData({
        alphabet: this.data.alphabet,
      })
    }

    var results = [{
        tag: "A",
        firstChar: [],
        dataList: []
      },
      {
        tag: "B",
        firstChar: [],
        dataList: []
      },
      {
        tag: "C",
        firstChar: [],
        dataList: []
      },
      {
        tag: "D",
        firstChar: [],
        dataList: []
      },
      {
        tag: "E",
        firstChar: [],
        dataList: []
      },
      {
        tag: "F",
        firstChar: [],
        dataList: []
      },
      {
        tag: "G",
        firstChar: [],
        dataList: []
      },
      {
        tag: "H",
        firstChar: [],
        dataList: []
      },
      {
        tag: "I",
        firstChar: [],
        dataList: []
      },
      {
        tag: "J",
        firstChar: [],
        dataList: []
      },
      {
        tag: "K",
        firstChar: [],
        dataList: []
      },
      {
        tag: "L",
        firstChar: [],
        dataList: []
      },
      {
        tag: "M",
        firstChar: [],
        dataList: []
      },
      {
        tag: "N",
        firstChar: [],
        dataList: []
      },
      {
        tag: "O",
        firstChar: [],
        dataList: []
      },
      {
        tag: "P",
        firstChar: [],
        dataList: []
      },
      {
        tag: "Q",
        firstChar: [],
        dataList: []
      },
      {
        tag: "R",
        firstChar: [],
        dataList: []
      },
      {
        tag: "S",
        firstChar: [],
        dataList: []
      },
      {
        tag: "T",
        firstChar: [],
        dataList: []
      },
      {
        tag: "U",
        firstChar: [],
        dataList: []
      },
      {
        tag: "V",
        firstChar: [],
        dataList: []
      },
      {
        tag: "W",
        firstChar: [],
        dataList: []
      },
      {
        tag: "X",
        firstChar: [],
        dataList: []
      },
      {
        tag: "Y",
        firstChar: [],
        dataList: []
      },
      {
        tag: "Z",
        firstChar: [],
        dataList: []
      },
      {
        tag: "#",
        firstChar: [],
        dataList: []
      }
    ];

    var alphabet = this.data.alphabet;

    for (var i = 0; i < array.length; i++) {
      var text = array[i];
      if (text.user_id > 0 && text.user_id != null) {
        this.data.cardNum++;
      } else if (text.user_id == 0 || text.user_id == null){
        this.data.photodNum++;
      }

      var firstChar;
      if (text.name != null) {
        firstChar = text.name.substr(0, 1);
        firstChar = firstChar.toUpperCase();
        var reg = sortUtil.query(firstChar)[0];
        var temIndex = alphabet.indexOf(reg);
        if (temIndex == -1) {
          temIndex = 26;
        }
        results[temIndex].firstChar.push(firstChar);
        results[temIndex].dataList.push(text);
      }
    }

    var resultsList = [{}];

    //没有数据的剔除
    var j = 0;
    for (var i = 0; i < results.length; i++) {
      if (results[i].dataList.length == 0) {
        // results[i].tag = "PoundSign";
        continue;
      } else {
        resultsList[j++] = results[i];
        //resultsList[j++].dataList = results[i].dataList;
      }
    }


    return resultsList;
  },

  showOrHideNewPeopleSign: function(res) {
    var newContact = wx.getStorageSync("NEW_PEOPLE");
    if (newContact != null) {
      if (newContact == res.data.data.new_contact) {
        var hadIntoNewPeople = wx.getStorageSync("HAD_INTO_NEW_PEOPLE");
        if (hadIntoNewPeople != "true") {
          //有更新，但没进入过
          //展示
          this.setData({
            newPeople: res.data.data.new_contact,
          })
        } else {
          //隐藏
          this.setData({
            newPeople: null,

          })
        }
      } else {
        //有更新，不是上一个
        //展示
        this.setData({
          newPeople: res.data.data.new_contact,
        })
      }
    }
  },

  showOrHideNewVisitorSign: function(res) {

  },

  showOrHideNewPeopleWelfareSign: function(res) {

  },

  letterTouchStartEvent: function(e) {

    var pageY = e.changedTouches[0].pageY - this.data.distanceTop;
    var index = parseInt(pageY / (this.data.letterHeight));
    var letter = this.data.alphabet[index];
    console.log("高度Y pageY:" + pageY);
    this.setData({
      startTouchAlphabet: true,
      touchLetter: letter,
    })
  },

  letterTouchMoveEvent: function(e) {
    var pageY = e.changedTouches[0].pageY - this.data.distanceTop;
    var index = parseInt(pageY / (this.data.letterHeight));
    if (index > this.data.alphabet.length - 1) {
      index = this.data.alphabet.length - 1
    } else if (index < 0) {
      index = 0;
    }

    this.setData({
      touchLetter: this.data.alphabet[index]
    })
  },

  letterTouchEndEvent: function(e) {
    this.setData({
      startTouchAlphabet: false,
      touchLetter: ''
    })
  },

  letterTouchCancelEvent: function(e) {
    this.setData({
      startTouchAlphabet: false,
      touchLetter: ''
    })
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
              console.log("删除人脉返回：", res);
           
              if (res.data.error_code == 0) {
                wx.showToast({
                  title: '名片已删除',
                });

                //状态为2, 3提示
                // if (res.data.data == 3) {
                //   setTimeout(() => {
                //     wx.showToast({
                //       title: '名片回递已撤回',
                //     });
                //   }, 300);
                // } else if (res.data.data == 2) {
                //   setTimeout(() => {
                //     wx.showToast({
                //       title: '名片交换已撤回',
                //     });
                //   }, 300);
                // }

                self.deleteMsgItem(e);
                self.updateNotify();

              } else {
                wx.showToast({
                  title: '删除失败',
                  icon:"none"
                });
              }
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
    var infoArr = {
      pos: "",
      index: ""
    };

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

    var self = this;
    setTimeout(function() {

      var infoArr = self.getItemIndex(e.currentTarget.id);
      var dataAbcTab = self.data.dataSource[infoArr.pos];
      var dataList = self.data.dataSource[infoArr.pos].dataList;

      for (var i = 0; i < dataList.length; i++) {
        if (infoArr.index == i) {
          if (dataList.length == 1) {
            dataAbcTab.tag = "PoundSign";
          }

          if (dataList[i].user_id == 0 || dataList[i].user_id == null) {
            self.data.photodNum = self.data.photodNum - 1;
          } else {
            self.data.cardNum = self.data.cardNum - 1;
          }

          dataList.splice(i, 1);

          break;
        }
      }
      
      self.setData({
        cardNum: self.data.cardNum,
        allCard: self.data.cardNum + self.data.photodNum,
        dataSource: self.data.dataSource,
        scrollY: true
      });

    });

    this.slideGoback();

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

  clickNewPeopleView: function() {

    wx.navigateTo({
      url: '../../../people/pages/newPeople/newPeople',
    })

    var self = this;
    setTimeout(function() {
      self.setData({
        newPeople: null,
      })
    }, 200);
  },

  clickMyVisitorView: function() {

    wx.navigateTo({
      url: '../../../people/pages/myVisitor/myVisitor',
    })

    var self = this;
    setTimeout(function() {
      self.setData({
        myVisitor: null,

      })
    }, 200);
  },

  clickWelfareView: function() {

    wx.navigateTo({
      url: '../../../people/pages/peopleWelfare/peopleWelfare',
    })

    var self = this;
    setTimeout(function() {
      self.setData({
        peopleWelfare: null,

      })
    }, 200);
  },

  clickPeopleItem: function(e) {

    var cardId = e.currentTarget.id;

    wx.navigateTo({
      url: '../../../card/detail/detail?card_id=' + cardId,
    })

  },

  clickCardRecognitionView: function(e) {
    // app.shoot(() => {
    //   wx.navigateTo({
    //     url: '/card/edit/edit?type=3'
    //   })
    // }); 
    // return;
    wx.navigateTo({
      url: '/pages/shootCard/shootCard?pai=1',
    })
   
  },

  clickCreateCardBtn: function(e) {
    var cardId = this.data.cardId;
    jump.jump(cardId);
  },

  searchBtn: function() {
    wx.navigateTo({
      url: '../../../people/pages/search/search',
    })
  },

  createCardShare: function() {
    this.data.card = wx.getStorageSync("MY_CARD");
    if (this.data.card != null) {

      app.createShareImg(this.data.card, (res) => {
        this.data.shareImg = res;
        wx.setStorageSync("MY_SHARE_BG_IMG", this.data.shareImg);

      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  judgeShowCardOrCreateCardView: function() {
    this.data.cardId = wx.getStorageSync("CARD_ID"),
      this.setData({
        cardId: wx.getStorageSync("CARD_ID"),
      })

    this.createCardShare();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    this.judgeShowCardOrCreateCardView();

    var shootData = wx.getStorageSync("shootData");
    //如果是拍名片返回，就重新加载列表
    if (shootData != "" && shootData != null) {
      wx.removeStorageSync("shootData");
    }

    if (this.data.dataSource != null && this.data.dataSource.length > 0) {
      this.data.isShowLoading = false;
    } else {
      this.data.isShowLoading = true;
    }


    this.updateNotify();

    this.loadMyPeopleContacts();

  },

  updateNotify: function() {
    var self = this;
    setTimeout(function() {
      self.loadGetNotify();
      self.getLastPeopleFuli();
    }, 300);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

    this.data.allCard= 0;
    this.data.cardNum = 0;
    this.data.photodNum = 0;
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
    
  },

  bottomScrollTolower:function(){

    this.setData({
      bottomHeight: true,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var titleText;
    var imageUrl;
    var path;
    if (res.from == "menu") {
      titleText = "推荐简单人脉给您，来试试";
      imageUrl = "/img/share_aplet_img.png";
      path = "/pages/card/index/index";
    } else {
      titleText = "这是我的红包名片，请您惠存";
      imageUrl = this.data.shareImg;
      path = "/card/detail/detail?card_id=" + this.data.cardId + "&share=1";
    }

   

    return {
      title: titleText,
      path: path,
      imageUrl: imageUrl
    }
  }
})