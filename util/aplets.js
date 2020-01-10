module.exports = {
  jump: function(cardId) {
    
    if (cardId != 0) {
      //无卡片时return
      if (cardId == -1) {
        wx.showToast({
          title: 'TA还未创建名片',
          icon: "none",
        })
        return;
      }

      wx.navigateTo({
        url: '../../../card/detail/detail?card_id=' + cardId,
      })
    } else {
      wx.navigateTo({
        url: '/card/edit/edit?type=1',
      })

    }
  },
}