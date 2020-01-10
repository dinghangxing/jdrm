// card/welfare/welfare.js
const app = getApp();
const date = require("../../util/date.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我的福利',
    barBg: '#ffffff',
    color: '#000',
    card:null,
    list:[],
    active_id:0,
    noWelTop:0,
    selectObj:{},
    actionHidden:true,
    isShowAct:false
  },

  getMyActive:function(){
    app.post(
      "Card/getMyActive",
      {},
      (res) => {
       
        if (res.data.error_code == 0){
          
          var active = res.data.data.active;
          for(var a of active){
            a.type = 2; 
            if (this.data.joinList){
              if (a.active_id == this.data.joinList.active_id) {
                a.active = true;
              } else {
                a.active = false;
              }
            }
            
            
          }
          var lucky = res.data.data.lucky;
          for(var l of lucky){
            l.type = 1;
            if (this.data.joinList){
              if (l.id == this.data.joinList.active_id) {
                l.active = true;
              } else {
                l.active = false;
              }
            }
            
            
            var expires = new Date(l.create_time.replace(/-/g, '/')).getTime() + 1000 * 3600 * 24 * 7;
            l.expires = date.formatTime(expires,"Y-M-D h:m");

          }
          var list = active.concat(lucky);
         
          
          list.sort(function (a, b) {
            var aTime = new Date(a.create_time.replace(/-/g, '/')).getTime();
            var bTime = new Date(b.create_time.replace(/-/g, '/')).getTime();
            return bTime - aTime;
          })

          
          var topList = [];
          var redList = [];
          var proList = [];
          var freeList = [];
          var funList = [];
          for(var item of list){
            if(!item.active_type){
              redList.push(item);
            }
            if(item.active_type == 4){
              topList.push(item);
            }
            if (item.active_type == 3) {
              proList.push(item);
            }
            if (item.active_type == 2) {
              funList.push(item);
            }
            if (item.active_type == 1) {
              freeList.push(item);
            }
          }
          this.setData({
            list: topList.concat(redList, proList, freeList, funList)
          });

         
        }
      }
    );
  },

  select:function(e){
    
    var index = e.currentTarget.dataset.index;
  
    var selectObj = this.data.list[index];
    this.setData({
      selectObj: selectObj,
      index:index
    });
    this.switchAction();
    this.setTempActive();
    
    
  },
  //展示在名片上
  showToCard:function(){
    this.switchAction();
    this.clearTempActive();
    if (this.data.selectObj.active_type == 1){
      wx.showToast({
        title: '免费版福利不支持展示',
        icon:"none"
      })
      return;
    }
    if (this.data.selectObj.active_type == 2) {
      wx.showToast({
        title: '趣味版福利不支持展示',
        icon: "none"
      })
      return;
    }
    for (var i in this.data.list) {
      if (i == this.data.index) {
        this.data.list[i].active = !this.data.list[i].active;
      } else {
        this.data.list[i].active = false;
      }
    }
    this.setData({
      list: this.data.list
    });

    this.updateActive();
  

    
  },
  //查看详情
  toDetail: function (){
    this.switchAction();
    this.clearTempActive();
    var selectObj = this.data.selectObj;
    if (selectObj.type == 1) {

      selectObj.active_id = selectObj.id;
      selectObj.nickname = app.globalData.userInfo.nickName;
      selectObj.icon = app.globalData.userInfo.avatarUrl;
      wx.setStorageSync("JOIN_LIST", selectObj);
      wx.setStorageSync("CHECK_FL_DETAIL_FROM_MY_FL", "check_fl_detail");
      wx.navigateTo({
        url: '/card/redPackage/openRP/rpDetail',
      })
    } else if (selectObj.type == 2) {


      wx.navigateTo({
        url: '/welfare/pages/detail/detail?active_id=' + selectObj.active_id,
      })
    }
  },
  //取消展示
  cancel:function(){
    this.switchAction();
    this.clearTempActive();
    for (var obj of this.data.list) {
      obj.active =false;
    }
    this.setData({
      list:this.data.list
    });
    var param = {};
    param.card_id = this.data.card.id;
    param.type = 0;
    param.active_id = 0;
    app.post(
      "Card/updateActive",
      param,
      (res) => {
        if (res.data.error_code == 0) {
         
          wx.showToast({
            title: '设置成功'
          })
        } else {

        }

      },
      false
    );
  },

  closeAction:function(){
    this.switchAction();
    this.clearTempActive();
  },

  updateActive:function(){
    var item = null;
    for(var obj of this.data.list){
      if(obj.active){
        item = obj;
      }
    }

    var param = {};
    param.card_id = this.data.card.id;
    if(item == null){
      param.type = 0;
      param.active_id = 0;
    }else{
      param.type = item.type;
     
      if (item.type == 1) {
        param.active_id = item.id;
      } else {
        param.active_id = item.active_id;
      }
    }
    
    app.post(
      "Card/updateActive",
      param,
      (res) => {
        if (res.data.error_code == 0){
        //  wx.navigateBack({
        //    delta:1
        //  })
        wx.showToast({
          title: '设置成功'
        })
        }else{
          
        }
       
      },
      false
    );
  },

  setTempActive:function(){
    var index = this.data.index;
    var param = {};
    param["list["+index+"].tempActive"] = true;
    this.setData(param);
  },

  clearTempActive:function(){
    for(var item of this.data.list){
      item.tempActive = false;
    }

    this.setData({
      list:this.data.list
    });
  },

  switchAction:function(){
    this.setData({

      actionHidden: !this.data.actionHidden
    });
    setTimeout(() => {
      this.setData({
        isShowAct: !this.data.isShowAct,

      });
    }, 50);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var joinList =  wx.getStorageSync("JOIN_LIST");
    var card = wx.getStorageSync("card");
    this.setData({
      card:card,
      joinList: joinList
    });

    wx.getSystemInfo({
      success:(res) => {
        
        
        this.setData({
          noWelTop: (res.windowHeight - 64 - 65 - 108) / 2 
        });
      }
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
    this.getMyActive();
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