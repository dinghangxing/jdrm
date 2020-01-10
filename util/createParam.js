const md5 = require("./md5.js");
const base64 = require("./base64.js");
const constant = require("./constant.js");
const Crypto = require("./cryptojs/cryptojs.js");

module.exports = {
  create: function (param, method){

    var version = "1.0";
    var time = Math.ceil(new Date().getTime() / 1000);
    var token = wx.getStorageSync("token");
    if(token == null){
      token = "";
    }

    var APPKEY = constant.APPKEY;
    var SECRET = constant.SECRET;

    var DEFAULTKEY = constant.DEFAULTKEY; 
    var JSON_RPC = constant.JSON_RPC;
  

    var requestParam = { id: time, method: method };


    /* param 参数部分 */
   
    requestParam.param = param;


    /* md5加密 参数部分 */
    var format = this.orderFormat(param);
    var rwaStr = token + APPKEY + time + format + SECRET + DEFAULTKEY;
    var signMd5 = md5.md5(rwaStr).toLowerCase();

    /* system 参数部分 */
    requestParam.system = { version: version, jsonrpc: JSON_RPC, key: APPKEY, time: time, token: token, sign: signMd5 };

    console.warn("requestParam: ", requestParam)
  
    return requestParam;
  },

  orderFormat:function (param){
    let newkey = Object.keys(param).sort();
    let paramstr = "";
    for (let i = 0; i < newkey.length; i++) {
      let value = param[newkey[i]]
      if (typeof (value) == "number" || typeof (value) == "string") {
        paramstr += value
      }
    }
    return paramstr;
  },
  //OSS上传文件的参数
  getUploadParam: function (filename){
    var accessid = 'LTAIofD6SB93kjd1';
    var accesskey = '4suXiLQ8rTxbAZ3YGlbC6cCaDhOuzI';
    var suffix = this.get_suffix(filename);
    var key = this.random_string() + suffix;
    var policyText = {
      "expiration": "2050-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
      "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
      ]
    };
    var policyBase64 = base64.encode(JSON.stringify(policyText))
    var message = policyBase64
   
    var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true });
    var signature = Crypto.util.bytesToBase64(bytes);

    return {
      'key': key,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'success_action_status': '200', //让服务端返回200,不然，默认会返回204
      'signature': signature
    };
  },

  random_string:function(len) {
  　　len = len || 32;
  　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  　　var maxPos = chars.length;
  　　var pwd = '';
  　　for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
  },

  get_suffix:function(filename) {
    var pos = filename.lastIndexOf('.')
    var suffix = ''
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
    return suffix;
  }
  
} 