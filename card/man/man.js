// card/man/man.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '人脉展示',
    barBg: '#ffffff',
    color: '#000',
    selectedCardList:[]
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
    var list = wx.getStorageSync("selectedCardList");
    for(var p of list){
      p.firstChar = p.name.charAt(0);
    }
    if (list == "" || list == null) {
      list = [];
    }
    this.setData({
      selectedCardList: list
    });

   
  },

  deleteMan:function(e){
    
    var card_id = e.currentTarget.dataset.id;
    for (var i in this.data.selectedCardList){
      if (this.data.selectedCardList[i].card_id == card_id){
        this.data.selectedCardList.splice(i,1);
      }
    }
    this.setData({
      selectedCardList: this.data.selectedCardList
    });
    wx.setStorageSync("selectedCardList", this.data.selectedCardList);

  
  },

  save:function(){
    
    var card_ids = [];
    for (var c of this.data.selectedCardList){
      card_ids.push(c.card_id);
    }
  
    
    app.post(
      "Card/updateTop3Users",
      { card_ids: card_ids},
      (res) => {
        wx.navigateBack({
          delta:1
        })
      },false
    );
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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