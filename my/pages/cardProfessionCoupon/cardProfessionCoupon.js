// my/pages/cardProfessionCoupon/cardProfessionCoupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    title: '名片专业版管理',
    barBg: '#ffffff',
    color: '#000',

    profressionList: ["无广告", "个性化主题", "可展示五项产品与服务", "可展示BOSS好评", "可嵌入福利"],

    list: 10,
    windowHeight: 0,
    AGAIN_BUY: 0,
    GIVE_TO_FRIEND: 1,
    cardCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    wx.getSystemInfo({
      success: function(res) {
        self.data.windowHeight = res.screenHeight;

      }
    })
  },

  clickRightUse: function(e) {

  },

  //点击转赠给好友，弹出底部弹窗
  clickGiveToFriends: function(e) {
    this.showModal(this.data.GIVE_TO_FRIEND);
  },

  //点击再次购买，弹出底部弹出框
  clickAgainBuyBtn: function() {
    this.showModal(this.data.AGAIN_BUY);
  },

  //显示对话框
  showModal: function(type) {

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    var heigth = this.data.windowHeight;
    console.log("=====heigth===", heigth);
    animation.translateY(heigth).step();

    if (type == this.data.AGAIN_BUY) {
      this.setData({
        animationData: animation.export(),
        showAgainBuyStatus: true
      })
    } else if (type == this.data.GIVE_TO_FRIEND) {
      this.setData({
        animationData: animation.export(),
        showGiveToFriendStatus: true
      })
    }


    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  //隐藏对话框
  hideModal: function(e) {

    var type = e.currentTarget.dataset.id;
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step();

      if (type == this.data.AGAIN_BUY) {
        this.setData({
          animationData: animation.export(),
          showAgainBuyStatus: false,
        })
      } else if (type == this.data.GIVE_TO_FRIEND) {
        this.setData({
          animationData: animation.export(),
          showGiveToFriendStatus: false,
        })
      }

    }.bind(this), 200)
  },

  clickClockGiveToFriendView: function(e) {
    this.hideModal(e);
  },

  clickCloseAgainBuyView: function(e) {
    this.hideModal(e);
  },

  clickBuyRightNow: function(e) {
    wx.navigateTo({
      url: '/my/pages/cardProfessionCoupon/addService/addService',
    })
  },

  addCardBtn: function() {
    var count = this.data.cardCount + 1;
    this.setData({
      cardCount: count,
    })
  },

  lessCardBtn: function() {
    var count = this.data.cardCount - 1;
    this.setData({
      cardCount: count--,
    })
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
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/welfareProfessionCoupon/welfareProfessionCoupon?id=123',
      success: function(res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})