// components/xing-editor.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //图片上传相关属性，参考wx.uploadFile
    imageUploadUrl: String,
    imageUploadName: String,
    imageUploadHeader: Object,
    imageUploadFormData: Object,
    imageUploadKeyChain: String, //例：'image.url'

    //是否在选择图片后立即上传
    // uploadImageWhenChoose: {
    //   type: Boolean,
    //   value: false,
    // },

    //输入内容
    nodes: Array,
    html: String,

    //内容输出格式，参考rich-text组件，默认为节点列表
    outputType: {
      type: String,
      value: 'array',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowHeight: 0,
    nodeList: [],
    textBufferPool: [],
    addIndex:-2,
    //是否开启小程序推广
    isSpread:false,
    isChange:false,

    index: 0,
    value: "",
    cursor: 0,

    isOpen:false,
    isFocus:false
   
  },

  ready: function () {
    
    this.setData({
      isSpread: wx.getStorageSync("isSpread")
    });
   
    const { windowHeight } = wx.getSystemInfoSync();
    this.setData({
      windowHeight,
    })
    if (this.properties.nodes && this.properties.nodes.length > 0) {
      const textBufferPool = [];
      this.properties.nodes.forEach((node, index) => {
        if (node.name === 'p') {
          textBufferPool[index] = node.children[0].text;
        }else if(node.name === "copy"){
          textBufferPool[index] = node;
        }
      })
      this.setData({
        textBufferPool,
        nodeList: this.properties.nodes,
      })
    } else if (this.properties.html) {
      const nodeList = this.HTMLtoNodeList();
      const textBufferPool = [];
      nodeList.forEach((node, index) => {
        if (node.name === 'p') {
          textBufferPool[index] = node.children[0].text;
        }
      })
     
      this.setData({
        textBufferPool,
        nodeList
        
      })
    }

    if (this.properties.nodes && this.properties.nodes.length == 0){
      this.addText();
    } 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openJia:function(){
    
      this.setData({
        isOpen:!this.data.isOpen
      });
     
    },

   
    /**
     * 事件：添加一键复制
     */
    addCopy:function(e){
    
      this.writeTextToNode();
     
      var node = {
        name:"copy",
        desc:"",
        content:""
      }

      var index = this.data.index;
      let nodeList = this.data.nodeList;
      let textBufferPool = this.data.textBufferPool;

      var value = textBufferPool[index];

      var str1 = value.substring(0, this.data.cursor);
      var str2 = value.substring(this.data.cursor);
      this.setData({
        str1: str1,
        str2: str2
      });

      var node1 = {
        name: 'p',
        attrs: {
          class: 'xing-p',
          style: 'text-align:left;margin:10rpx 0;'
        },
        children: [{
          type: 'text',
          text: str1
        }]
      }

      var node2 = {
        name: 'p',
        attrs: {
          class: 'xing-p',
          style: 'text-align:left;margin:10rpx 0;'
        },
        children: [{
          type: 'text',
          text: str2
        }]
      }

      var centerArr = [node1, node, node2];
      if (!str1) {
        centerArr.splice(0, 1);
      }
      if (!str2 && index < nodeList.length - 1) {
        centerArr.splice(nodeList.length - 1, 1);
      }
      nodeList = nodeList.slice(0, index).concat(centerArr).concat(nodeList.slice(index + 1))

      centerArr = [str1, node, str2];
      if (!str1) {
        centerArr.splice(0, 1);
      }
      if (!str2 && index < textBufferPool.length - 1) {
        centerArr.splice(textBufferPool.length - 1, 1);
      }
      textBufferPool = textBufferPool.slice(0, index).concat(centerArr).concat(textBufferPool.slice(index + 1))
     

      this.setData({
        nodeList,
        textBufferPool,
        index:nodeList.length -1,
        cursor:0
      })
    },
   
    /**
     * 事件：添加文本
     */
    addText: function (e) {
      this.writeTextToNode();
      if(e){
        var index = e.currentTarget.dataset.index;
      }else{
        var index = -1;
      }
     
      const node = {
        name: 'p',
        attrs: {
          class: 'xing-p',
          style:'text-align:left;margin:10rpx 0;'
        },
        children: [{
          type: 'text',
          text: ''
        }]
      }

      
      const nodeList = this.data.nodeList;
      const textBufferPool = this.data.textBufferPool;
      nodeList.splice(index + 1, 0, node);
      textBufferPool.splice(index + 1, 0, '');
      this.setData({
        nodeList,
        textBufferPool,
        addIndex: -2,
      
      })
    },
    //失去焦点
    onTextareaBlur:function(e){
      var index = e.currentTarget.dataset.index;
      var value = e.detail.value;
      var cursor = e.detail.cursor;
      console.log(index,value,cursor);

      this.setData({
        index: index,
        value:value,
        cursor: cursor ? cursor : 0
      });


    },
    //获得焦点
    onTextareaFocus:function(e){
      
    },

    /**
     * 事件：添加图片
     */
    addImage: function () {
      this.writeTextToNode();
      var index = this.data.index;
      wx.chooseImage({
        success: res => {
          var centerArr = [];
        
          for (var obj of res.tempFilePaths){
            const tempFilePath = obj;

          
            const node = {
              name: 'img',
              attrs: {
                class: 'xing-img',
                style: 'width: 100%',
                src: tempFilePath,
                // _height: res.height / res.width,
              },
            }

            centerArr.push(node);

          }

          var index = this.data.index;
          let nodeList = this.data.nodeList;
          let textBufferPool = this.data.textBufferPool;

          var value = textBufferPool[index];

          var str1 = value.substring(0, this.data.cursor);
          var str2 = value.substring(this.data.cursor);
          this.setData({
            str1: str1,
            str2: str2
          });

          var node1 = {
            name: 'p',
            attrs: {
              class: 'xing-p',
              style: 'text-align:left;margin:10rpx 0;'
            },
            children: [{
              type: 'text',
              text: str1
            }]
          }

          var node2 = {
            name: 'p',
            attrs: {
              class: 'xing-p',
              style: 'text-align:left;margin:10rpx 0;'
            },
            children: [{
              type: 'text',
              text: str2
            }]
          }
          
          centerArr = [node1].concat(centerArr).concat([node2]);
          if(!str1){
            centerArr.splice(0,1);
          }
          if(!str2 && index < nodeList.length - 1){
            centerArr.splice(nodeList.length - 1,1);
          }
          nodeList = nodeList.slice(0, index).concat(centerArr).concat(nodeList.slice(index + 1))

          centerArr = [str1].concat(res.tempFilePaths).concat(str2);
          if (!str1) {
            centerArr.splice(0, 1);
          }
          if (!str2 && index < textBufferPool.length - 1) {
            centerArr.splice(textBufferPool.length - 1, 1);
          }
          textBufferPool = textBufferPool.slice(0, index).concat(centerArr).concat(textBufferPool.slice(index + 1));
        

          this.setData({
            nodeList,
            textBufferPool,
            index:nodeList.length - 1,
            cursor:0
          })
          
        },
      })
    },

   
    /**
     * 事件：删除节点
     */
    deleteNode: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      let textBufferPool = this.data.textBufferPool;
      nodeList.splice(index, 1);
      textBufferPool.splice(index, 1);
      this.setData({
        nodeList,
        textBufferPool,
        index: nodeList.length - 1,
        cursor: 0
      })
    },

    /**
     * 事件：文本输入
     */
    onTextareaInput: function (e) {
      const index = e.currentTarget.dataset.index;
      let textBufferPool = this.data.textBufferPool;
      textBufferPool[index] = e.detail.value;
      this.setData({
        textBufferPool,
      })
    },

    onContentInput:function(e){
      const index = e.currentTarget.dataset.index;
      let textBufferPool = this.data.textBufferPool;
      textBufferPool[index]['content'] = e.detail.value;
      this.setData({
        textBufferPool,
      })
    },
    onDescInput:function(e){
      const index = e.currentTarget.dataset.index;
      let textBufferPool = this.data.textBufferPool;
      textBufferPool[index]['desc'] = e.detail.value;
      this.setData({
        textBufferPool,
      })
    },

    /**
     * 事件：提交内容
     */
    onFinish: function (e) {
      wx.showLoading({
        title: '正在保存',
      })
      
      this.writeTextToNode();
      this.handleOutput();
    },

    /**
     * 方法：HTML转义
     */
    htmlEncode: function (str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&/g, "&gt;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
      s = s.replace(/ /g, "&nbsp;");
      s = s.replace(/\'/g, "&#39;");
      s = s.replace(/\"/g, "&quot;");
      s = s.replace(/\n/g, "<br>");
      return s;
    },

    /**
     * 方法：HTML转义
     */
    htmlDecode: function (str) {
      var s = "";
      if(str.length == 0) return "";
      s = str.replace(/&gt;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "\'");
      s = s.replace(/&quot;/g, "\"");
      s = s.replace(/<br>/g, "\n");
      return s;
    },

    /**
     * 方法：将缓冲池的文本写入节点
     */
    writeTextToNode: function (e) {
      const textBufferPool = this.data.textBufferPool;
      const nodeList = this.data.nodeList;
      nodeList.forEach((node, index) => {
        if (node.name === 'p') {
          node.children[0].text = textBufferPool[index];
        }
        if(node.name === "copy"){
          node.desc = textBufferPool[index]["desc"];
          node.content = textBufferPool[index]["content"];
        }
      })
      this.setData({
        nodeList,
      })
    },

    /**
     * 方法：将HTML转为节点
     */
    HTMLtoNodeList: function () {
      let html = this.properties.html;
      let htmlNodeList = [];
      while (html.length > 0) {
        const endTag = html.match(/<\/[a-z0-9]+>/);
        if (!endTag) break;
        const htmlNode = html.substring(0, endTag.index + endTag[0].length);
        htmlNodeList.push(htmlNode);
        html = html.substring(endTag.index + endTag[0].length);
      }
      return htmlNodeList.map(htmlNode => {
        let node = {attrs: {}};
        const startTag = htmlNode.match(/<[^<>]+>/);
        const startTagStr = startTag[0].substring(1, startTag[0].length - 1).trim();
        node.name = startTagStr.split(/\s+/)[0];
        startTagStr.match(/[^\s]+="[^"]+"/g).forEach(attr => {
          const [name, value] = attr.split('=');
          node.attrs[name] = value.replace(/"/g, '');
        })
        if (node.name === 'p') {
          const endTag = htmlNode.match(/<\/[a-z0-9]+>/);
          const text = this.htmlDecode(htmlNode.substring(startTag.index + startTag[0].length, endTag.index).trim());
          node.children = [{
            text,
            type: 'text',
          }]
        }
        return node;
      })
    },

    /**
     * 方法：将节点转为HTML
     */
    nodeListToHTML: function () {
      /** 
      return this.data.nodeList.map(node => `<${node.name} ${Object.keys(node.attrs).map(key => `${key}="${node.attrs[key]}"`).join(' ')}>${node.children ? this.htmlEncode(node.children[0].text) : ''}</${node.name}>`).join('');
    */
    var self = this;
      return this.data.nodeList.map(function(node){
        var str = "";
        if(node.name == "copy"){
          str = `<p class='copy-v'>
          <p class='copy-desc'>${node.desc}</p>
          <p class='copy-content'>${node.content}</p>
            <p class='copy-btn'>
             <img src='/img/hand_1.png' mode='widthFix' class='copy-hand'></img>
              一键复制
            </p>
        </p>`;
        }else{
          str = `<${node.name} ${Object.keys(node.attrs).map(key => `${key}="${node.attrs[key]}"`).join(' ')}>${node.children ? self.htmlEncode(node.children[0].text) : ''}</${node.name}>`;

        }

        return str;
       
      }).join("");
    },

    /**
     * 方法：上传图片
     */
    uploadImage: function (node) {
      return new Promise(resolve => {
        let options = {
          filePath: node.attrs.src,
          url: this.properties.imageUploadUrl,
          name: this.properties.imageUploadName,
        }
        if (this.properties.imageUploadHeader) {
          options.header = this.properties.imageUploadHeader;
        }
        if (this.properties.imageUploadFormData) {
          options.formData = this.properties.imageUploadFormData;
        }
        options.success = res => {
          const keyChain = this.properties.imageUploadKeyChain.split('.');
          let url = JSON.parse(res.data);
          keyChain.forEach(key => {
            url = url[key];
          })
          node.attrs.src = url;
          node.attrs._uploaded = true;
          
          resolve();
        }
        wx.uploadFile(options);
      })
    },

    /**
     * 方法：处理节点，递归
     */
    handleOutput: function (index = 0) {
     
      let nodeList = this.data.nodeList;
      if (index >= nodeList.length) {
       
        wx.hideLoading();
        if (this.properties.outputType.toLowerCase() === 'array') {
          
          this.triggerEvent('finishEditor', { content: this.data.nodeList });
        }
        if (this.properties.outputType.toLowerCase() === 'html') {
          this.triggerEvent('finishEditor', { content: this.nodeListToHTML() });
          
        }
        return;
      }
      const node = nodeList[index];
      if (node.name === 'img' && !node.attrs._uploaded) {
        // this.uploadImage(node).then(() => {
        //   this.handleOutput(index + 1)
        // });
        this.handleOutput(index + 1)
      } else {
        this.handleOutput(index + 1);
      }
    },
  }
})
