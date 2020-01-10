const app = getApp();
const sortUtil = require("../../util/sortUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '选择人脉',
    barBg: '#ffffff',
    color: '#000',

    showSearch:true,
    searchValue:"",

   
    proportion: 0,

    alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    alphabetTop:0,
    startTouchAlphabet: false,
    touchLetter: '',
    letterHeight: 0,
    //源数据
    dataSource: [],
    //过滤后的人脉列表
    cardList: [],
    //真实人脉列表
    realCardList:[],
    //选中的人脉
    selectedCardList:[],
    //防抖
    timer:null
  },

  onInitLetterHeigth: function () {

    if (wx.createSelectorQuery) {
      var that = this
      var query = wx.createSelectorQuery().in(this)
      query.select('#alphabet').boundingClientRect(function (res) {
      
        if (res.height) {

          that.setData({
            letterHeight: res.height  / that.data.alphabet.length,
            alphabetTop: res.top
          })
        } else {
          throw ('Initialization failed.')
        }
      }).exec()
    } else {
      throw ('当前基础库版本小于1.6.0，不支持alphabet-order-list组件')
    }
  },

  searchInput:function(e){
    var val = e.detail.value;
    console.log(val);
    this.setData({
      searchValue:val
    });


    clearTimeout(this.data.timer);
    this.data.timer = setTimeout(() => {
      var list = [];
      for (var card of this.data.realCardList) {
        if (card.name.includes(val)) {
          list.push(card);
        }
      }
      this.setData({
        cardList: list
      });
      this.createDataSource();
    },500)
    

  },
  searchFocus:function(){
    this.setData({
      showSearch:false
    });
  },
  searchBlur:function(){
    var show = true;
    if (this.data.searchValue == ""){
      show = true;
    }else{
      show = false;
    }
    this.setData({
      showSearch: show
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var wHeight;
    wx.getSystemInfo({
      success: function (res) {
    
        that.data.proportion = 750 / res.windowWidth;

        //将高度乘以换算后的该设备的rpx与px的比例
        console.log("像素 proportion:" + that.data.proportion);
      }
    });
    this.onInitLetterHeigth();
    this.setAbcInfo();

    

    //获取我的人脉列表
    this.getMyContacts().then(() => {
      var selectedCardList = wx.getStorageSync("selectedCardList");
      if (selectedCardList == "" || selectedCardList == null){
        selectedCardList = [];
      }
      this.setData({
        selectedCardList: selectedCardList
      });
      for (var c of this.data.cardList){
        c.checked = false;
        for (var s of selectedCardList){
          if(c.card_id == s.card_id){
            c.checked = true;
          }
        }
      }
      //创建数据列表
      this.createDataSource();
      
    });

   
  },

  //创建源数据列表
  createDataSource:function(){
    
    this.data.dataSource = this.groupby(this.data.cardList)
    this.setData({
      dataSource: this.data.dataSource,
    })
  },

  //获取我的人脉列表
  getMyContacts:function(){
    return new Promise(resolve => {
      app.post(
        "People/getMyContacts",
        {},
        (res) => {
         
          var list = res.data.data;
          for(var p of list){
            p.firstChar = p.name.charAt(0);
          }
          this.setData({
            cardList:list,
            realCardList:list
          });
          resolve();
        }
      );
    });
  },


  

  selectMan:function(e){
    
  
    var card_id = e.currentTarget.dataset.id;
    //是否已经选择了三个（最多三个）
    if (this.data.selectedCardList.length == 3){
      var have = false;
      for (var c of this.data.selectedCardList){
        if(c.card_id == card_id){
          have = true;
        }
      }

      if(!have){
         wx.showToast({
           title: '只能最多选择三个',
           icon:"none"
         })
        this.setData({
          dataSource: this.data.dataSource,
          selectedCardList: this.data.selectedCardList
        });
        return;
      }
    }

   
    for(var obj of this.data.dataSource){
      for(var man of obj.dataList){
        if (man.card_id == card_id){
          man.checked = !man.checked;
          
          if(man.checked){
            this.data.selectedCardList.push(man);
          }else{
            for (var si in this.data.selectedCardList){
              if (man.card_id == this.data.selectedCardList[si].card_id){
                this.data.selectedCardList.splice(si,1);
              }
            }
          }
          
        }
      }
    }
    this.setData({
      dataSource: this.data.dataSource,
      selectedCardList: this.data.selectedCardList
    });


   
  },

  save:function(){
   
    var list = this.data.selectedCardList;
    wx.setStorageSync("selectedCardList", list);

    wx.navigateBack({
      delta:1
    })
    
  },

  setAbcInfo: function () {

    var alphabet = this.data.alphabet
    // if (alphabet.length == 26) {
    //   alphabet.push('PoundSign')
    this.setData({
      alphabet: alphabet
    })
    // }
  },


  groupby: function (array) {

    if (!array || array.length == 0) {
      // this.setData({
      //   alphabet: null,
      // })

      return null;

    } else {
      this.setData({
        alphabet: this.data.alphabet,
      })
    }

    var results = [{
      tag: "A",
      dataList: []
    },
    {
      tag: "B",
      dataList: []
    },
    {
      tag: "C",
      dataList: []
    },
    {
      tag: "D",
      dataList: []
    },
    {
      tag: "E",
      dataList: []
    },
    {
      tag: "F",
      dataList: []
    },
    {
      tag: "G",
      dataList: []
    },
    {
      tag: "H",
      dataList: []
    },
    {
      tag: "I",
      dataList: []
    },
    {
      tag: "J",
      dataList: []
    },
    {
      tag: "K",
      dataList: []
    },
    {
      tag: "L",
      dataList: []
    },
    {
      tag: "M",
      dataList: []
    },
    {
      tag: "N",
      dataList: []
    },
    {
      tag: "O",
      dataList: []
    },
    {
      tag: "P",
      dataList: []
    },
    {
      tag: "Q",
      dataList: []
    },
    {
      tag: "R",
      dataList: []
    },
    {
      tag: "S",
      dataList: []
    },
    {
      tag: "T",
      dataList: []
    },
    {
      tag: "U",
      dataList: []
    },
    {
      tag: "V",
      dataList: []
    },
    {
      tag: "W",
      dataList: []
    },
    {
      tag: "X",
      dataList: []
    },
    {
      tag: "Y",
      dataList: []
    },
    {
      tag: "Z",
      dataList: []
    },
    {
      tag: "#",
      dataList: []
    }
    ];

    var alphabet = this.data.alphabet;
    for (var i = 0; i < array.length; i++) {
      var text = array[i];
   
      var firstChar = text.name.substr(0, 1);
      firstChar = firstChar.toUpperCase();
      var reg = sortUtil.query(firstChar)[0];
      var temIndex = alphabet.indexOf(reg);
      if (temIndex == -1) {
        temIndex = 26;
      }

      results[temIndex].dataList.push(text);
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

  letterTouchStartEvent: function (e) {
    var pageY = e.changedTouches[0].pageY - this.data.alphabetTop;
    var index = parseInt(pageY / (this.data.letterHeight));
    var letter = this.data.alphabet[index];
    console.log("高度Y pageY:" + pageY);
    this.setData({
      startTouchAlphabet: true,
      touchLetter: letter,
    })
  },

  letterTouchMoveEvent: function (e) {
    var pageY = e.changedTouches[0].pageY - this.data.alphabetTop;
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

  letterTouchEndEvent: function (e) {
    this.setData({
      startTouchAlphabet: false,
      touchLetter: ''
    })
  },

  letterTouchCancelEvent: function (e) {
    this.setData({
      startTouchAlphabet: false,
      touchLetter: ''
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})