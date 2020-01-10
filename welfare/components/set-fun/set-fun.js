// welfare/components/set-fun/set-fun.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    prize_img:"",
    prize_name:"",
    prize_num:1,
    current:0,
    numNull:false,
    numOver:false
  },

  ready() { 
    setTimeout(() => {
      this.getFun();
    },100);
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
  

    prizeNumInput: function (e) {
      
      var index = e.target.dataset.index;
      var val = e.detail.value;
      if(val == ""){
        this.setData({
          numNull:true
        });
        
      }else{
        this.setData({
          numNull: false
        });
      }
      if(parseInt(val) > 100){
        this.setData({
          numOver: true
        });
      }else{
        this.setData({
          numOver: false
        });
      }

      this.data.prize_num = val;

      var prizeList = [{ 
        prize_name: this.data.prize_name, 
        team_num: "1", 
        prize_num: this.data.prize_num,
        prize_img:this.data.prize_img
      }];
      wx.setStorageSync("prizeList", prizeList);

    },

    getFun: function () {
      var self = this;
      app.post(
        "Active/getPrizeFun",
        {},
        (res) => {
          
          this.setData({
            list:res.data.data
          });
          this.change();
        }
      );
    },

    change:function(){
     
      var random = Math.random();
      var current = Math.ceil(random * this.data.list.length - 1);

    
      this.setData({
        current: current
      });


      var prizeList = [{ 
        prize_name: this.data.list[current].prize_name, 
        team_num: "1", 
        prize_num: this.data.prize_num,
        prize_img: this.data.list[current].banner_img
        }];
      wx.setStorageSync("prizeList", prizeList);

     
    },
    check:function(){

    }

  }
})
