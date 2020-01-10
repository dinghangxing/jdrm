// pages/users/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    title: '抽奖参与用户',
    barBg: '#ffffff',
    color: '#000',
    list:[],
    page:1,
    size: 100,
    total : 0,
    noMore:false,
    active_id:1,

    isShowDetail:false,
    user:{}
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var active_id = options.active_id;
    this.setData({active_id: active_id})
    this.getUserList()
  },

  getUserList() {
    if (this.data.noMore){
      return;
    }
    this.setData({ hidden: false })
    var param = { active_id: this.data.active_id,page: this.data.page, size: this.data.size }
    app.post('Active/getActiveUserList', param,  (res) => {
    
      this.setData({ hidden: true })
      var list = res.data.data.userlist;
     
      var total = res.data.data.total;

      if (list.length < this.data.size){
        this.setData({
          noMore:true
        });
      }
      list = this.data.list.concat(list);
      this.setData({ list: list, total: total })
     
    })
  },
  showDetail( e ){
    
    var idx = parseInt(e.currentTarget.dataset.id);
    var item = this.data.list[idx];
    item.nickname = app.base64Decode(item.nickname);
    this.setData({ user: item, isShowDetail:true})
  },
  hideDetail(){
    this.setData({ isShowDetail: false })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  loadMore: function(){
    this.data.page ++;
    this.getUserList();
    
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
  onShowHide: function () {
    this.setData({
      hiddenFlag: !this.data.hiddenFlag
    });
  },

  /**
  
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
    this.loadMore()
    wx.stopPullDownRefresh();
  },
  preview: function(){
    let url = this.data.user.icon
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  }
})