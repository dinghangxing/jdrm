// components/prodBus/prodBus.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isMy: {
            type: Boolean,
            value: false,
            observer(newVal, oldVal, changedPath) {

            }
        },
        card_id: {
            type: Number,
            value: 0,
            observer(newVal, oldVal, changedPath) {
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        products: [],
      current:0
    },

    attached() {
        this.getProducts();
    },

    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show() { 
            this.getProducts();
        },
        hide() { },
        resize() { },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getProducts: function () {
            return new Promise((resolve) => {
                app.post(
                    "Card/getProducts", {
                        card_id: this.data.card_id
                    },
                    (res) => {
                       
                        this.setData({
                            products: []
                        });

                        if (!res.data.data) {
                            return;
                        }
                        var products = res.data.data.products;

                      
                        products = JSON.parse(products);

                      if (!(products instanceof Array)) {
                        return;
                      }
                       
                        this.setData({
                          products: products
                        });
                        
                        resolve();
                    }, false
                );
            });
        },

      imgChange:function(e){
        var current = e.detail.current
        this.setData({
          current: current
        }); 
      }
    }
})
