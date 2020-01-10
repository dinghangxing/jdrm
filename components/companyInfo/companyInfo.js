// components/companyInfo/companyInfo.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        card: Object,
        card_id: Number,
        isMy: Boolean,
    },

    /**
     * 组件的初始数据
     */
    data: {
        isOpen: false
    },

    show() {

    },

    attached() {
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toggle() {
            this.isOpen = !this.isOpen;
            this.setData({
                isOpen: this.isOpen
            })
        },
    }
})