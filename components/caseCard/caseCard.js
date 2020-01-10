// components/caseCard/caseCard.js
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
        card: {

            address: "福建省福州市鼓楼区湖东路288号",
            banner_img: "",
            email: "ddg@ddgad.com",
            full_name: "数字驱动(福州)科技有限责任公司",

            job: "联合创始人",
            logo: "/img/com_image.png",
            name: "阿丽塔",
            phone: "13988888888",
          tpl_list: "https://ddg-applets.oss-cn-hangzhou.aliyuncs.com/3ea6e158-3cba-11e9-99ef-7440bb80e72b.png",
            email: "ddg@ddgad.com"
        },
        isOpen: false,

      
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
        this.loadFont();
    },
    ready() {},

   
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() { 
      
    },
    hide() { },
    resize() { },
  },

    /**
     * 组件的方法列表
     */
    methods: {
        loadFont: function() {
            var arr = this.data.card.name.split("");
            var ss = arr.map((s) => {
                var obj = {};
                obj.str = s;
                obj.code = s.charCodeAt();
                return obj;
            })
            for (var o of ss) {
                wx.loadFontFace({
                    family: 'f' + o.code,
                    source: 'url("https://ddg-font.oss-cn-hangzhou.aliyuncs.com/' + o.code + '.ttf")',
                    success: (res) => {}
                })
            }
            this.setData({
                nameArr: ss
            });
        },
        toggle: function () {
            this.isOpen = !this.isOpen;
            this.setData({
                isOpen: this.isOpen
            })
        },

      toggleStep:function(){
       
        this.triggerEvent('toggleStep', );
      }
    }
})