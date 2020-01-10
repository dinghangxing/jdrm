// my/pages/cardProfessionCoupon/addService/addService.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '增值服务',
    barBg: '#ffffff',
    color: '#000',

    addServiceArr: ["无广告", "个性化主题", "可展示五项产品与服务", "可展示BOSS好评", "可嵌入福利"],

    buyUseCouponArr: [{ card: "月卡", price: "￥19.9/月", savePrice: "节省0%", selected: false }, { card: "季卡", price: "￥15.8/月", savePrice: "节省20%", selected: true }, { card: "年卡", price: "￥9.9/月", savePrice: "节省50%", selected: false }],

    isClickItemCoupon: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  clickBuyCoupon: function (e) {
    var id = e.currentTarget.dataset.id;
    var list = this.data.buyUseCouponArr;
    for (var i = 0; i < list.length; i++) {
      if (id == i) {
        list[i].selected = true;
      } else {
        list[i].selected = false;
      }
    }

    this.setData({
      buyUseCouponArr: list,
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