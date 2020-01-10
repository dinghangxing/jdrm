// pages/shootCard/shootCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '名片识别',
    barBg: '#ffffff',
    color: '#000',


    showImg:false,
    src:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setCameraHeight();
    if(options.pai){
      this.data.pai = true;
    }
  },

  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
      
        this.setData({
          src: res.tempImagePath,
          showImg:true
        })
      }
    })
  },

  select(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success : (res) => {
        
        this.setData({
          src: res.tempFilePaths[0],
          showImg: true
        })
      }
    })
  },

  restart(){
    this.setData({
     
      showImg: false
    })
  },

  done(){

    var tempFilePath = this.data.src;
      wx.setStorageSync("SHOOT_IMG", tempFilePath);
      wx.getFileSystemManager().readFile({
        filePath: tempFilePath, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: res => { //成功的回调
          wx.showLoading({
            title: '正在识别图片',
            mask: true
          });
          var img = res.data;
          wx.request({
            url: 'https://dm-57.data.aliyun.com/rest/160601/ocr/ocr_business_card.json',
            method: "POST",
            data: {
              image: img
            },
            header: {
              'content-type': 'application/json; charset=UTF-8',
              'Authorization': 'APPCODE ' + "95d51aa6c29047b38a41b56218b50d25"
            },
            success: (res) => {
              wx.hideLoading();

              wx.setStorageSync("SHOOT_RES", res);
              if(this.data.pai){

                wx.redirectTo({
                  url: '/card/edit/edit?type=3'
                })
                
              }else{
                wx.navigateBack({
                  delta: 1
                })
              }
             
              
            

            },
            fail: function (e) {
              wx.hideLoading();
              wx.showToast({
                title: '请求出错！',
              });

            

            },
          })

        }
      })

    
  },

  setCameraHeight(){
    let systemInfo = wx.getSystemInfoSync();
    let reg = /ios/i;
    let pt = 20; //导航状态栏上内边距
    let h = 44; //导航状态栏高度
    if (reg.test(systemInfo.system)) {
      pt = systemInfo.statusBarHeight;
      h = 44;
    } else {
      pt = systemInfo.statusBarHeight;
      h = 48;
    }
    var bili = 750 / systemInfo.windowWidth;
    this.setData({
      height: systemInfo.windowHeight - h - 20,

      rectTop: (systemInfo.windowHeight * bili - 660) / 2
    });
  },

  back(){
    wx.navigateBack({
      delta:1
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