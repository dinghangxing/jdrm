// people/pages/search/search.js
var app = getApp();
const constant = require("../../../util/constant.js");
var jump = require('../../../util/aplets.js');
const sortUtil = require("../../../util/sortUtil.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '搜索',
    barBg: '#ffffff',
    color: '#000',

    keyValue: '', //搜索的内容
    defauleHintKeyWord: "搜索",
    dataList: [],
    page: 0,
    size: 10,
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //实时搜索框文本内容显示
  inputBind: function(e) {
    this.search(e.detail.value);
   
  },

  //确定搜索后触发
  confirm: function(e) {
    this.search(e.detail.value);
  },

  //key用户输入的查询关键字
  search: function(keyWord) {
    this.setData({
      keyValue: keyWord,
    })
      
    this.data.page = 0;
    this.getSearchList();


  },

  getSearchList: function() {

    if (!this.data.hasMore) {
      return;
    }
    this.data.page++;

    app.post(constant.PEOPLE_SEARCH, {
        page: this.data.page,
        size: this.data.size,
        keywords: this.data.keyValue,
      },
      (res) => {
        console.log("搜索结果:", res);

        if (res.data.error_code == 0) {
          var list = res.data.data;
          if (list == null || list.length == 0) {
            return;
          }

          if (list.length < this.data.size) {
            this.setData({
              hasMore: false
            });
          }

          for (var item of list) {
            item.firstChar = item.name.charAt(0);
          }

          var searchList = this.data.dataList.concat(list);

          this.setData({
            dataList: searchList,
          })
        }


        //this.data.dataList = getHilightStrArray("name", this.data.keyValue);
      }
    );
  },

  //返回一个使用key切割str后的数组，key仍在数组中
  getHilightStrArray: function(str, key) {
    return str.replace(new RegExp('${key}', 'g'), '%%${key}%%').split('%%');
  },

  clickSearchItem: function(e) {

    var cardId = e.currentTarget.dataset.id;
    jump.jump(cardId);
  },


  deleteKeyWord: function() {
    this.setData({
      defauleHintKeyWord: "搜索",
      keyValue: "",
    })
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
    this.getSearchList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})