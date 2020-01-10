// component/set-prize/set-prize.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isTeam:{
      type:Boolean,
      observer:function(newVal,oldVal,changedPath){
        if(newVal){
          for (var item of this.data.prizeList) {
            let team_num = !item.prize_num ? 0 : parseInt(item.prize_num);
            item.prize_num = team_num * this.data.teamNum;
            item.team_num = team_num ? team_num : '';
          }
        }else{
          for (var item of this.data.prizeList){
            
            item.prize_num = parseInt(item.team_num) || '';
          }
        }
        
        
        this.setData({
          prizeList: this.data.prizeList
        });

      }
    },
    teamNum:{
      type:Number,
      observer: function (newVal, oldVal, changedPath){
        var isShowToast = false;
        for (var i in this.data.prizeList){
          var prize = this.data.prizeList[i];
          if(prize.team_num){
            prize.prize_num = newVal * prize.team_num;
            prize.numNull = false

            isShowToast= true;
          }
          
        }

        this.setData({
          prizeList: this.data.prizeList
        });
        wx.setStorageSync("prizeList", this.data.prizeList);

        console.log("newVal",newVal);
        if (isShowToast){
          wx.showToast({
            title: '奖品份数已同步',

          })
        }
        
        
      }
    },
    type:{
      type: Number,
      observer: function (newVal, oldVal, changedPath) {
        if (newVal == 2){
          this.setData({
            "prizeList[0].prize_num":1
          });
        }

        if (newVal > 2){
          this.data.maxNum = 1000;
        }else{
          this.data.maxNum = 100;
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    prizeList: [{ 
      prize_name: "", 
      team_num: "", 
      prize_num: "", 
      prize_img:"/img/demo_image.jpg",
      nameNull:false,
      numNull:false,
      numOver:false,
      teamNull:false
    }],

    maxNum:100
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      
      wx.setStorageSync("prizeList", this.data.prizeList);
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      
      var index = wx.getStorageSync("PRIZE_INDEX");
      if(index === ""){
        return;
      }
      var coverImage = wx.getStorageSync("coverImage");
      if (coverImage != "" && coverImage != null){
        var obj = {};
        obj["prizeList[" + index + "].prize_img"] = coverImage;
        this.setData(obj);
      }

      
      wx.removeStorageSync('PRIZE_INDEX');
      wx.removeStorageSync('coverImage');
      
    },
    hide() { },
    resize() { },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    prizeNameInput:function(e){
      var index = e.target.dataset.index;
      var val = e.detail.value;
      console.log(index,val);

      this.data.prizeList[index].prize_name = val;
      if(val == ""){
        this.data.prizeList[index].nameNull = true;
      }else{
        this.data.prizeList[index].nameNull = false;
      }

      var param = {}
      param["prizeList["+index+"].nameNull"] = this.data.prizeList[index].nameNull;
      this.setData(param);

      wx.setStorageSync("prizeList", this.data.prizeList);
     
    },

    teamNumInput:function(e){
      var index = e.target.dataset.index;
      var val = e.detail.value;
      console.log(index,val);
      
      var prize_num = val * this.data.teamNum;
      // if(prize_num == 0){
      //   prize_num = "";
      // }
      this.data.prizeList[index].team_num = val;
      this.data.prizeList[index].prize_num = prize_num;

      if (val === "") {
        this.data.prizeList[index].teamNull = true;
      } else {
        this.data.prizeList[index].teamNull = false;
      }
      

      var param = {}
      param["prizeList[" + index + "]"] = this.data.prizeList[index];
      this.setData(param);

      wx.setStorageSync("prizeList", this.data.prizeList);

      wx.showToast({
        title: '奖品份数已同步',

      })
      
    },

    prizeNumInput:function(e){
      var index = e.target.dataset.index;
      var val = e.detail.value;
      //console.log(index,val);

      this.data.prizeList[index].prize_num = val;
      if(val === ""){
        this.data.prizeList[index].numNull = true;
      }else{
        this.data.prizeList[index].numNull = false;
      }
      if(parseInt(val) > this.data.maxNum){
        this.data.prizeList[index].numOver = true;
      }else{
        this.data.prizeList[index].numOver = false;
      }

      var param = {}
      param["prizeList[" + index + "].numNull"] = this.data.prizeList[index].numNull;
      param["prizeList[" + index + "].numOver"] = this.data.prizeList[index].numOver;
      this.setData(param);

      wx.setStorageSync("prizeList", this.data.prizeList);
     
    },
    

    addPrize:function(){
      this.data.prizeList.push({ prize_name: "", team_num: "", prize_num: "", prize_img: "/img/demo_image.jpg", nameNull: false, numNull: false, numOver: false, teamNull:false});
      this.setData({
        prizeList: this.data.prizeList
      });

      wx.setStorageSync("prizeList", this.data.prizeList);
    },

    delPrize:function(e){
    

      var index = e.currentTarget.dataset.index;
      console.log(index);
      this.data.prizeList.splice(index,1);

     
      this.setData({
        prizeList: this.data.prizeList
      });

      wx.setStorageSync("prizeList", this.data.prizeList);
    },

    
    tipNum:function(){
      if(!this.data.isTeam){
        return;
      }
     

      this.selectComponent("#myModal").open({
        title: '奖品份数',
        content: '开启组队后,奖品份数 = 队数 X 成员数',
      });
    },

    //前往裁剪封面图
    toCrop: function (e) {
      
      var index = e.currentTarget.dataset.index;

      wx.chooseImage({
        count: 1,

        sourceType: ['album', 'camera'],
        success: (res) => {
          var tempFilePaths = res.tempFilePaths[0]
          wx.setStorageSync("PRIZE_INDEX", index);
          wx.navigateTo({
            url: '/pages/cutImg/cutImg?image=' + tempFilePaths,
          })

        },
        fail: function (res) {

        }
      })

     
    },

    check:function(){
      var error = null;

      for (var i = this.data.prizeList.length - 1;i>=0;i--){
        var item = this.data.prizeList[i];
        if(item.prize_name == ""){
          item.nameNull =  true;
          error = i;
        }
        if(item.prize_num == ""){
          item.numNull = true
          error = i;
        }
        if (parseInt(item.prize_num) == 0){
          item.numNull = true
          error = i;
        }
        if (parseInt(item.prize_num) > this.data.maxNum) {
          item.numOver = true;
          error = i;
        }
        if (item.team_num == "") {
          item.teamNull = true;
          error = i;
        }
        if (parseInt(item.team_num) == 0) {
          item.teamNull = true;
          error = i;
        }
      }
      this.setData({
        prizeList: this.data.prizeList
      });

      if (error != null){
        const query = this.createSelectorQuery()
        query.select('#pi' + error).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {

          wx.pageScrollTo({
            scrollTop: res[0].top + res[1].scrollTop,
            duration: 0
          })

        })
      }
      
    }
  }
})
