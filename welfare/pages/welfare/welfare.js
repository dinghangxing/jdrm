// pages/recommend/welfare/welfare.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '公共福利',
    barBg: '#ffffff',
    color: '#000',

    currentTab: 0,
    startList:[],
    startPage:0,
    startMore:true,
    noticeList:[],
    noticePage:0,
    noticeMore: true,
    size:10
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  getStart:function(){
    if (!this.data.startMore){
      return;
    }
    this.data.startPage ++;
    app.post(
      "Active/getPubActiveList", 
      {
        page: this.data.startPage,
        size: this.data.size,
        status: 2
      },
      (res) =>  {

        var list = res.data.data.active_list;
        if(list.length < this.data.size){
          this.setData({
            startMore: false
          });
        }
        list = this.data.startList.concat(list);
        this.setData({
          startList: list
        });

      }
    );
  },
  getNotice:function(){
    if (!this.data.noticeMore) {
      return;
    }
    this.data.noticePage++;
    app.post(
      "Active/getPubActiveList",
      {
        page: this.data.noticePage,
        size: this.data.size,
        status: 3
      },
      (res) => {

        var list = res.data.data.active_list;
        if (list.length < this.data.size) {
          this.setData({
            noticeMore: false
          });
        }
        list = this.data.noticeList.concat(list);
        this.setData({
          noticeList: list
        });
      }
    );
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getStart();
    this.getNotice();
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