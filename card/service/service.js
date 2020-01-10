// card/service/service.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '产品业务',
        barBg: '#ffffff',
        color: '#000',

        card_id: null,
        products: "",
        serviceList: [{
            content: "",
            img:""
        }],
        timer: null
    },

    //查询产品列表
    getProducts: function() {
        app.post(
            "Card/getProducts", {
                card_id: this.data.card_id
            },
            (res) => {
              if (!res.data.data) {
                return;
              }
              var products = res.data.data.products;


              products = JSON.parse(products);

              if (!(products instanceof Array)) {
                return;
              }
                
              if (products.length > 0){
                this.setData({
                  serviceList: products
                });
              } 
              
           
              
                
            }
        );
    },

    onInpunt: function(e) {

        var index = e.currentTarget.dataset.index;
        var val = e.detail.value;

        var key = "serviceList[" + index + "].content";

        //this.data.serviceList[index] = val;
        this.setData({
            [key]: val
        });



    },

    del: function(e) {
        var index = e.currentTarget.dataset.index;
        this.data.serviceList.splice(index, 1);
        this.setData({
            serviceList: this.data.serviceList
        });
    },

    delImg(e) {
      var index = e.currentTarget.dataset.index;
      var key = "serviceList[" + index + "].img";


      this.setData({
        [key]: ""
      });
    },

    add: function() {
        this.data.serviceList.push({
            content: "",
            img:""
        });
        this.setData({
            serviceList: this.data.serviceList
        });
    },

    submit: function() {
      this.uploadImg().then(() => {
        
        var list = this.data.serviceList;
        for (var index = list.length - 1; index >= 0; index--) {
          var temp = list[index];
          if (temp.content.trim() == "") {
            list.splice(index, 1);
          }
        }
        //list = JSON.stringify(list);
        
        app.post(
          "Card/updateProducts", {
            card_id: this.data.card_id,
            products: list,
            //product_img: this.data.product_img
          },
          (res) => {
            wx.navigateBack({
              delta: 1
            })

          }, false
        );
      });


     

    },

    selectImg(e){
      
      var index = e.currentTarget.dataset.index;
        wx.chooseImage({
            count: 1,
            sourceType: ['album', 'camera'],
            success: (res) => {
              
              var img = res.tempFilePaths[0];

              wx.setStorageSync("SERVICE_INDEX", index);
              wx.navigateTo({
                url: '/pages/cutImg/cutImg?image=' + img,
              })


              // var key = "serviceList[" + index + "].img";
              // this.setData({
              //   [key]: img
              // });
            },
            fail: function (res) {

            }
        })
    },

    uploadImg:function(){
      var allPro = [];
      for(let service of this.data.serviceList){
        var promise = new Promise((resolve) => {
          const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
          if (objExp.test(service.img)) {
            resolve();
          }else{
            app.uploadFile(service.img).then((url) => {
              service.img = url;
              resolve();
            });
          }


         
        });
        allPro.push(promise);
      }
      return Promise.all(allPro);

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var card_id = parseInt(options.card_id);
        this.setData({
            card_id: card_id
        });

        this.getProducts();
      
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
      
      var index = wx.getStorageSync("SERVICE_INDEX");
      if (index === "") {
        return;
      }
      var coverImage = wx.getStorageSync("coverImage");
      if (coverImage) {
        var obj = {};
        obj["serviceList[" + index + "].img"] = coverImage;
        this.setData(obj);
      }


      wx.removeStorageSync('SERVICE_INDEX');
      wx.removeStorageSync('coverImage');
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})