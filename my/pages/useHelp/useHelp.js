// my/pages/useHelp/useHelp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '帮助与反馈',
    barBg: '#ffffff',
    color: '#000',

    isShowDetail1: false,
    isShowDetail2: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  menuItemView1: function (e) {
    wx.navigateTo({
      url: '/my/pages/useHelp/userHDetail/userHDetail',
    })
  },

  menuItemView2:function(e){
    wx.navigateTo({
      url: '/my/pages/useHelp/userHDetail/userHDetail?scroll_height=605',
    })
  },

  menuItemView3: function (e) {
    wx.navigateTo({
      url: '/my/pages/useHelp/userHDetail/userHDetail?scroll_height=850',
    })
  },


  //clickArrowBtn1:function(e){
    // var isShow = this.data.isShowDetail1;
   
    // this.setData({
    //   isShowDetail1: !isShow,
    // })
    
    
  //},

  //clickArrowBtn2: function (e) {
    // var isShow = this.data.isShowDetail2;
    
    // this.setData({
    //   isShowDetail2: !isShow,
    // })
  
    
  //},


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