// card/components/partCom/partCom.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        card_id: Number,
        isMy: Boolean,
        iHave: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
        //伙伴评价选项
        partComData: [],

        //伙伴评价列表
        partComList: [],
        //选中的伙伴评价
        selectedPartCom: {},
        //是否显示伙伴评价弹框
        isShowPartCom: false,
        //最近评价
        user_list: [],
        //评价总数
        total_count: 0,
        countList: [],
        isShowCount: false,
        //最大的统计对象
        maxCount: null
    },

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached() {},
        ready() {

            //获取伙伴评价选项
            this.getPartComData().then(() => {
                //查询伙伴评价
                this.getPartComList();
            });



            this.getRecentPartCom();
        }
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show() {
            this.getRecentPartCom();
        }

    },

    /**
     * 组件的方法列表
     */
    methods: {
        //获取伙伴评价选项
        getPartComData: function() {
            return new Promise(resolve => {
                app.post(
                    "Impress/getPartCommentList", {},
                    (res) => {

                        this.setData({
                            partComData: res.data.data
                        });
                        resolve();
                    },
                    false
                );
            });
        },

        //查询伙伴评价
        getPartComList: function() {
            app.post(
                "Impress/getPartComment", {
                    card_id: this.data.card_id
                },
                (res) => {



                    var list = res.data.data;

                    var arr = [].concat(this.data.partComData);
                    var total_count = 0;
                    var maxCount = {
                        total_count: 0
                    }
                    for (var a of arr) {

                        a.total_count = 0;
                        for (var l of list) {
                            if (a.content == l.content) {
                                a.total_count = l.total_count;
                                total_count += a.total_count;

                                if (a.total_count > maxCount.total_count) {
                                    maxCount = a;
                                }
                            }
                        }
                    }

                    this.setData({
                        total_count: total_count,
                        countList: arr,
                        maxCount: maxCount
                    });



                },
                false
            );
        },

        //打开伙伴评价弹框
        showPartCom: function() {
            if (this.data.isMy) {
                this.setData({
                    isShowCount: true
                });
            } else {
                this.setData({
                    isShowPartCom: true
                });
            }

        },
        //关闭伙伴评价弹框
        closePartCom: function() {
            if (this.data.isMy) {
                this.setData({
                    isShowCount: false
                });
            } else {
                this.setData({
                    isShowPartCom: false
                });
            }
        },
        //选择伙伴评价
        selectPartCom: function(e) {
            if (!this.data.iHave) {
                this.openNoCard();
                return;
            }

            var id = e.currentTarget.dataset.id;
            for (var o of this.data.partComData) {
                if (o.id == id) {
                    this.setData({
                        selectedPartCom: o
                    });
                    break;
                }
            }
        },
        //提交伙伴评价
        submitPartCom: function() {
            if (this.data.selectedPartCom.id == null) {
                wx.showToast({
                    title: '请选择一个评价',
                    icon: "none",
                    mask: true
                })
                return;
            }
            app.post(
                "Impress/partComment", {
                    card_id: this.data.card_id,
                    content: this.data.selectedPartCom.content,
                    impress_id: this.data.selectedPartCom.id
                },
                (res) => {

                    if (res.data.error_code == 0) {
                        wx.showToast({
                            title: '评价成功',
                        
                            mask: true
                        })

                    } else {
                        wx.showToast({
                            title: '已经评价过了',
                            icon: "none",
                            mask: true
                        })
                    }
                    this.closePartCom();



                    this.getPartComList();
                    this.getRecentPartCom();
                },
                false
            );
        },

        //获得最近伙伴评价
        getRecentPartCom: function() {

            app.post(
                "Impress/partRecentComment", {
                    card_id: this.data.card_id
                },
                (res) => {

                    this.setData({
                        user_list: res.data.data.user_list
                    });
                },
                false
            );
        },
        createCard: function() {
            // this.closeNoCard();
            wx.navigateTo({
                url: '/card/edit/edit?type=1',
            })
        },

        openNoCard: function() {
            var self = this;
            wx.showModal({
                content: '您还未创建名片，无法评价',
                cancelText: "取消",
                confirmText: "立即创建",
                confirmColor: "#3ca1e1",
                success(res) {
                    if (res.confirm) {
                        self.createCard();
                    } else if (res.cancel) {

                    }
                }
            })
            // this.setData({
            //   isOpenNoCard: true
            // });
        },

        // closeNoCard: function () {
        //   this.setData({
        //     isOpenNoCard: false
        //   });
        // }

    }
})