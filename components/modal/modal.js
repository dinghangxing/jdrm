// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    title: "",
    content:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open(obj){
      this.setData({
        show:true,
        title:obj.title,
        content:obj.content,
        confirm: obj.confirm ? obj.confirm : 0,
        cancel: obj.cancel ? obj.cancel : 0
      });

      if (obj.confirm){
        this.data.confirm = obj.confirm;
      }
      if (obj.cancel){
        this.data.cancel = obj.cancel;
        this.setData({
          isCancel:true
        });
      }else{
        this.setData({
          isCancel: false
        });
      }
    
    },

    confirm(){
      this.setData({
        show:false
      });
      if (this.data.confirm){
        this.data.confirm();
      }
     
    },

    cancel(){
      this.setData({
        show: false
      });
      if(this.data.cancel){
        this.data.cancel();
      }
      
    }
  }
})
