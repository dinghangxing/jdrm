// pages/recommend/address/address.js
const dateUtil = require("../../../util/date.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '选择收货地址',
    barBg: '#ffffff',
    color: '#000',

    active:null,
    date:"",
    address: { info:""},
    show:false,
   
    type:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var active = wx.getStorageSync("active");
  
    var date = dateUtil.createDate(active.open_date).getTime() + 3600 * 24 * 1000 * 7;
    this.setData({
      active:active,
      date: dateUtil.formatTime(date,"M月D日 h:m"),
      type:options.type
    });

    this.getAddress();
  },
  chooseAddress:function(){
    wx.chooseAddress({
      success: (res) => {
  
        console.log(res);
        this.setData({
          address: {
            
            address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
            phone: res.telNumber,
            name: res.userName,
            zip_code:res.postalCode
          },
          show:true
        });
      }
    })
  },
  inputInfo:function(e){
    var val = e.detail.value;
    this.data.address.info = val;
  },
  submit:function(){
    if(this.data.address == null){
      wx.showToast({
        title: '请选择地址',
        icon:"none"
      })
      return;
    }
   
    var param = Object.assign({}, this.data.address);
    param.active_id = this.data.active.active_id;
  
 
    var url = "";
    if(this.data.type == "1"){
      url = "User/submitOrder";
    } else if (this.data.type == "2"){
      url = "User/updateMyOrder";
    }
    app.post(
      url,
      param,
      (res) => {
      
        wx.setStorageSync("address", param);
        wx.navigateBack({
          delta:1
        })
      }
    );
   
  },

  //获得收货地址
  getAddress: function () {
    return new Promise((resovle) => {
      app.post(
        "User/getMyOrder",
        { active_id: this.data.active.active_id },
        (res) => {
         
          if (res.data.data){
            this.setData({
              address: res.data.data,
              show:true
            });
          }
         
          resovle();

        }
      );
    });

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