const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '中奖者详情',
    barBg: '#ffffff',
    color: '#000',
    active:null,
    winnerList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var active_id = options.active_id;
    this.setData({
      active: wx.getStorageSync("active")
    
    });

    this.getWinnerList();
   
  },

  getWinnerList:function(){
    app.post(
      "User/getWonUserList",
      { active_id: this.data.active.active_id},
      (res) => {
        
        console.log(res);
        var list = res.data.data;
        for(var obj of list){
          obj.nickname = app.base64Decode(obj.nickname);
        }
        
        this.setData({
          winnerList:list
        });
      }
    );
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