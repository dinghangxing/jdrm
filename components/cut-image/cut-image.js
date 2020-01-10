// component/cut-image/cut-image.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    image:{
      type: String, 
      value: '', 
      observer(newVal, oldVal, changedPath) {
        this.initImage();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageNotChoosed: true,
    offsetTop:-75
  },

  attached:function(){
    var self = this
    // self.device = wx.getSystemInfoSync()
    self.device = app.globalData.myDevice
    self.deviceRatio = self.device.windowWidth / 750
    self.imgViewHeight = self.device.windowHeight
    self.setData({
      imgViewHeight: self.imgViewHeight
    })
    //this.chooseImage();
   
   
  },

  show:function(){
    
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initImage:function(){
      
      this.setData({
        imageNotChoosed: false,
        tempImageSrc: this.data.image,
        originImageSrc: this.data.image,
      })
      this.loadImgOnImage()
    },
    chooseImage:function(){



      var self = this;
      wx.chooseImage({
        count: 1,
        // sizeType: ['original '], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          self.setData({
            imageNotChoosed: false,
            tempImageSrc: tempFilePaths[0],
            originImageSrc: tempFilePaths[0],
          })
          self.loadImgOnImage()
        },
        fail: function (res) {
          self.setData({
            imageNotChoosed: true
          })
        }
      })
    },
    loadImgOnImage:function(){
      var self = this;
      wx.getImageInfo({
        src: self.data.tempImageSrc,
        success: function (res) {
        
          self.oldScale = 1
          /*
          self.initRatio = res.height / self.imgViewHeight  //转换为了px 图片原始大小/显示大小
          var a = res.width / (750 * self.deviceRatio);
          if (self.initRatio > res.width / (750 * self.deviceRatio)) {
            self.initRatio = res.width / (750 * self.deviceRatio)
          }
          */
          self.initRatio = res.height / 187.5;
          var a = res.width / (750 * self.deviceRatio);
          if (self.initRatio > res.width / (750 * self.deviceRatio)) {
            self.initRatio = res.width / (750 * self.deviceRatio)
          }

          //图片显示大小
          self.scaleWidth = (res.width / self.initRatio)
          self.scaleHeight = (res.height / self.initRatio)
          
          
          self.initScaleWidth = self.scaleWidth
          self.initScaleHeight = self.scaleHeight
          self.startX = 750 * self.deviceRatio / 2 - self.scaleWidth / 2 ;
          
          self.startY = (self.imgViewHeight) / 2 - self.scaleHeight / 2 + self.data.offsetTop / (750 / self.device.windowWidth)
          self.setData({
            imgWidth: self.scaleWidth,
            imgHeight: self.scaleHeight,
            imgTop: self.startY,
            imgLeft: self.startX
          })
          wx.hideLoading();

          self.openCroper()
        }
      })
    },
    //保存照片
    saveImgToPhone() {
      wx.previewImage({
        urls: [this.data.tempImageSrc], // 需要预览的图片http链接列表        
      })
    },

    uploadScaleStart(e) { //缩放图片
      
      let self = this
      let xDistance, yDistance
      let [touch0, touch1] = e.touches
      //self.touchNum = 0 //初始化，用于控制旋转结束时，旋转动作只执行一次

      //计算第一个触摸点的位置，并参照该点进行缩放
      self.touchX = touch0.clientX
      self.touchY = touch0.clientY
      //每次触摸开始时图片左上角坐标
      self.imgLeft = self.startX
      self.imgTop = self.startY

      // 两指手势触发
      if (e.touches.length >= 2) {
        self.initLeft = (self.deviceRatio * 750 / 2 - self.imgLeft) / self.oldScale
        self.initTop = (self.imgViewHeight / 2 - self.imgTop) / self.oldScale
        //计算两指距离
        xDistance = touch1.clientX - touch0.clientX
        yDistance = touch1.clientY - touch0.clientY
        self.oldDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)
      }
    },

    uploadScaleMove(e) {
    //  console.log("uploadScaleMove");
      fn(this, e)
    },

    uploadScaleEnd(e) {
      console.log("uploadScaleEnd");
      let self = this

      self.oldScale = self.newScale || self.oldScale
      self.startX = self.imgLeft;
      self.startY = self.imgTop;

     

     
    },
    openCroper() {
      
     // self.deviceRatio = self.device.windowWidth;
     // self.imgViewHeight = self.device.windowHeight ;
     // var minCutL = Math.max(0, this.data.imgLeft)
     // var minCutT = Math.max(0, this.data.imgTop)

      var cutW = this.device.windowWidth;
      var cutH = this.device.windowWidth * (9 / 16);
      
      this.setData({
        isCroper: true,
        cutW: cutW,
        cutH: cutH,
        cutL: 0,
        cutT: this.device.windowHeight / 2 - cutH / 2 + this.data.offsetTop / (750 / this.device.windowWidth)
      })
    },
    cancelCrop() {
      this.triggerEvent("cancelCrop");
    },

    competeCrop() {
      var self = this
      wx.showLoading({
        title: '截取中',
        mask: true,
      })
      //图片截取大小
      var sX = (self.data.cutL - self.data.imgLeft) * self.initRatio / self.oldScale
      var sY = (self.data.cutT - self.data.imgTop) * self.initRatio / self.oldScale
      var sW = self.data.cutW * self.initRatio / self.oldScale
      var sH = self.data.cutH * self.initRatio / self.oldScale
      self.setData({
        isCroper: false,
        tempCanvasWidth: sW,
        tempCanvasHeight: sH
      })

      //真机疑似bug解决方法
      // if (sW < self.scaleWidth * self.initRatio / self.oldScale / 2) {
      //   sW *= 2
      //   sH *= 2
      // }
    
      var ctx = wx.createCanvasContext('tempCanvas',self)

      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, sW, sH);
      ctx.draw(true,function(){
       
        ctx.drawImage(self.data.tempImageSrc, sX, sY, sW, sH, 0, 0, sW, sH);
        
      
        ctx.draw(true);

        setTimeout(function(){
        
          //保存图片到临时路径
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: self.data.tempCanvasWidth,
            height: self.data.tempCanvasHeight,
            destWidth: self.data.tempCanvasWidth,
            destHeight: self.data.tempCanvasHeight,
            fileType: 'jpg',
            quality: 1,
            canvasId: 'tempCanvas',
            success: function (res) {

              wx.hideLoading();

              self.setData({
                tempImageSrc: res.tempFilePath
              })

              //self.loadImgOnImage();

              self.triggerEvent("competeCrop", { tempImageSrc: res.tempFilePath});
            }
          }, self)
         
        },500);
        
      });

      
     
     
    },

  }
})

function throttle(fn, miniTimeCell) {
  var timer = null,
    previous = null;

  return function () {
    var now = +new Date(),
      context = this,
      args = arguments;
    if (!previous) previous = now;
    var remaining = now - previous;
    if (miniTimeCell && remaining >= miniTimeCell) {
      fn.apply(context, args);
      previous = now;
    }
  }
}
const fn = throttle(drawOnTouchMove, 100);

function drawOnTouchMove(self, e) {
  let { minScale, maxScale } = self.data
  let [touch0, touch1] = e.touches
  let xMove, yMove, newDistance, xDistance, yDistance

  if (e.timeStamp - self.timeOneFinger < 100) {//touch时长过短，忽略
    return
  }

  // 单指手势时触发
  if (e.touches.length === 1) {
    //计算单指移动的距离
    xMove = touch0.clientX - self.touchX
    yMove = touch0.clientY - self.touchY
    //转换移动距离到正确的坐标系下
    self.imgLeft = self.startX + xMove
    self.imgTop = self.startY + yMove
   
   

    if (self.imgLeft > 0){
     
      self.imgLeft = 0;
    }
    if (self.imgLeft < 750 * self.deviceRatio - self.data.imgWidth){
     
      self.imgLeft = 750 * self.deviceRatio - self.data.imgWidth;
    }

   


   
    if (self.imgTop > self.data.cutT){
      self.imgTop = self.data.cutT;
    }
    if (self.imgTop < self.data.cutH - self.data.imgHeight + self.data.cutT){
      self.imgTop = self.data.cutH - self.data.imgHeight + self.data.cutT;
    }
   
    self.setData({
      imgTop: self.imgTop,
      imgLeft: self.imgLeft
    })
  }
  // 两指手势触发
  if (e.touches.length >= 2) {
    // self.timeMoveTwo = e.timeStamp
    // 计算二指最新距离
    xDistance = touch1.clientX - touch0.clientX
    yDistance = touch1.clientY - touch0.clientY
    newDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)

    //  使用0.005的缩放倍数具有良好的缩放体验
    self.newScale = self.oldScale + 0.005 * (newDistance - self.oldDistance)
    if(self.newScale < 1){
      self.newScale = 1;
    }
    


    //  设定缩放范围
    self.newScale <= minScale && (self.newScale = minScale)
    self.newScale >= maxScale && (self.newScale = maxScale)

    self.scaleWidth = self.newScale * self.initScaleWidth
    self.scaleHeight = self.newScale * self.initScaleHeight

    self.imgLeft = self.deviceRatio * 750 / 2 - self.newScale * self.initLeft
    self.imgTop = self.imgViewHeight / 2 - self.newScale * self.initTop

    if (self.imgLeft > 0) {
      self.imgLeft = 0;
    }
    if (self.imgLeft < 750 * self.deviceRatio - self.scaleWidth) {
      self.imgLeft = 750 * self.deviceRatio - self.scaleWidth;
    }

   

    if (self.imgTop > self.data.cutT) {
      self.imgTop = self.data.cutT;
    }
    if (self.imgTop < self.data.cutH - self.scaleHeight + self.data.cutT) {
      self.imgTop = self.data.cutH - self.scaleHeight + self.data.cutT;
    }


    self.setData({
      imgTop: self.imgTop,
      imgLeft: self.imgLeft,
      imgWidth: self.scaleWidth,
      imgHeight: self.scaleHeight
    })

  }
}

