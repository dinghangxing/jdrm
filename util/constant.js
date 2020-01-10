module.exports = {
  //线上发布时启用
  BASE_URL: "https://wx.ddgad.com/jiandanrenmai/api",
  APPKEY: "5B634B742568BE5",
  SECRET: "17c10c42e05027f50585731623abdd50",

  //线下开发版
  // BASE_URL: "http://192.168.10.46:9001/api/applets",
  // APPKEY : "5B634B742568BE4",
  // SECRET : "17c10c42e05027f50585731623abdd40",

  DEFAULTKEY: "ddgadþúï", //"\\xfe\\xfa\\xef";
  JSON_RPC: "2.0",

  //============== 接口函数=======================//
  //登录
  AUTH_LOGIN: "Auth/login",
  //获取我的页面信息
  GET_MY_INFO: "User/getUserInfo",
  //签到
  CHECK_IN: "User/checkIn",
  //积分列表
  POINT_LIST: "User/sendPointList",
  //UPLOAD_FILE: "https://wx.ddgad.com/applets/api/file",
  UPLOAD_FILE: "https://ddg-applets.oss-cn-hangzhou.aliyuncs.com",
  // UPLOAD_FILE: "http://editor.ddgad.com/api/file",
  //  UPLOAD_FILE: "http://192.168.10.99:8000/api/file",

  //用户参与的抽奖活动
  MY_JOIN_ACTIVE: "User/myJoinActive",
  //用户发起的抽奖活动
  MY_ACTIVE: "User/myActive",
  //用户中奖纪录
  MY_WIN_ACTIVE: "User/myWonActive",
  //删除发起的抽奖项
  DELETE_LOTTERY_ACTIVE: "User/deleteActive",
  //联系客服
  GET_CUSTOMER: "Info/getCustomer",

  //=======人脉相关====begin
  //人脉通知
  PEOPLE_GET_LAST_NOTIFY: "People/getLastNotify",
  //我的人脉
  PEOPLE_GET_MY_CONTACTS: "People/getMyContacts",
  //人脉搜索
  PEOPLE_SEARCH: "People/search",
  //新的人脉
  PEOPLE_GET_NEW_CONTACTS: "People/getNewContacts",
  //删除人脉
  PEOPLE_DELCONTACT: "People/delContact",
  //保存请求
  PEOPLE_SAVE_CONTACT: "People/saveContact",
  //回递请求
  PEOPLE_SEND_BACK: "People/sendBack",
  //交换请求
  PEOPLE_SEND_EXCHANGE: "People/sendExchange",
  //同意交换
  PEOPLE_AGREE_EXCHANGE: "People/agreeExchange",
  //访客列表
  PEOPLE_GET_VISITORS: "People/getVisitors",
  //人脉福利
  PEOPLE_GET_AWARDS: "People/getAwards",
  //领取
  PEOPLE_CHECK_AWARDS: "People/checkAwardsStatus",
  //人脈福利更新
  PEOPLE_GET_LAST_FULI: "People/getLastFuli",

  //====红包=====begin
  USER_GET_LUCKY_HIS: "User/getLuckyHistory",
  //积分
  POINT_GET_PRODUCTS: "Point/getProducts",
  //积分兑换
  POINT_CONVERT_PRODUCTS: "Point/convertProducts",
  //获取专业版券  1张 10， 100张
  TICKET_GET_PRODUCTS: "Shop/getProductsTicketList",
  //立即购买
  TICKET_RIGHT_BUY: "ProTicketPay/buyProTicket",
  //充值
  RECHARGE: "Pay/deposit",
  //查询金额
  //PAY_CHECK: "Pay/checkPayStatus",
  //确认充值成功
  SURE_RECHARGE_SUCCESS: "",
  //隐私设置
  USER_PRIVACY: "User/setPrivacy",
  //充值记录
  USER_PAY_HISTORY: "User/getPayHistory",
  //发红包
  LUCKY_CREATE: "Lucky/createLucky",
  //查看抢到的红包记录
  GRAB_RED_PACKAGE: "Lucky/getLuckUserList",
  //查询余额
  CHECK_BALANCE: "User/getMyMoney",
  //充值，支付回调接口
  PAY_CALL_BACK: "Pay/callBack",
  //名片页面展示是否有发起过福利和发起过红包的请求
  CARD_GET_JOIN_STATUS: "Card/getJoinStatus",
  //检查是否可以点红包
  CHECK_IS_ALLOW: "Lucky/checkIsAllow",
  //点击抢红包按钮
  GET_LUCKY: "Lucky/getLucky",
  //创建转赠
  CREATE_TRANSFER: "Ticket/createTransfer",
  //检查券是否可领取或过期
  CHECK_TICKET_STATUS: "Ticket/checkTicketStatus",
  //增值服务立即领取
  GET_TICKET: "Ticket/getTicket",

  //提现：
  WITH_DRAW: "Weixin/withdraw",
}