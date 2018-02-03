//index.js
//获取应用实例
const app = getApp();


Page({
  data :{
    canvasWidth:400,
    isDraw:false,
    lastLoc:{
      x: 0, y: 0, timeStamp: 2000
    },
    lastLineWidth: -1,
    maxLineWidth: 10,
    minLineWidth: 1,
    maxV:4,
    minV:1,
    num:-1,
    colorList:{
      1:"#FF9966",
      2:"#FF6666",
      3:"#FFCCCC",
      4:"#CC9966",
      5: "#CCCC66",
      6:"#669999"
    }
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onLoad: function () {

    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          canvasWidth: res.windowWidth / 750 * 700
        })
      }
    })
  },
  onReady: function (e) {
    this.gird();
    
  },
  // 布局
  gird(){
    var width = this.data.canvasWidth;
    var ctx = wx.createCanvasContext('firstCanvas')
    ctx.beginPath()
    ctx.setLineWidth(5)
    ctx.setStrokeStyle('red')
    ctx.moveTo(0, 0)
    ctx.lineTo(0, width)
    ctx.lineTo(width, width)
    ctx.lineTo(width, 0)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.setLineDash([8, 5], 0);
    ctx.setLineWidth(2)
    ctx.moveTo(0, 0)

    ctx.lineTo(width, width)
    ctx.moveTo(width, 0)
    ctx.lineTo(0, width)

    ctx.moveTo((width + 0) / 2, 0)
    ctx.lineTo((width + 0) / 2, width)

    ctx.moveTo(0, (width +0) / 2)
    ctx.lineTo(width, (width + 0) / 2)

    ctx.stroke()


    ctx.draw()
  },
  // 获取坐标
  getloc(e){
    var offsetLeft = e.target.offsetLeft
    var offsetTop = e.target.offsetTop
    var pageX = e.touches[0].pageX
    var pageY = e.touches[0].pageY
    var x = pageX - offsetLeft
    var y = pageY - offsetTop
    var timeStamp = e.timeStamp;
    this.setData({
      lastLoc: {
        x: x, y: y, timeStamp: timeStamp
      }
    })

  },
  // 获取运笔的速度
  getV(x1, y1,timeStamp1,x2,y2,timeStamp2 ){
    var s = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) );
    var t = timeStamp2-timeStamp1
    return s/t;

  },
  // 获取线宽
  getLineWidth(v){
    var lineWidth;
    var maxLineWidth = this.data.maxLineWidth
    var minLineWidth = this.data.minLineWidth
    var maxV= this.data.maxV
    var minV = this.data.minV
    if(v<minV){
      lineWidth = maxLineWidth;
    }else if(v>maxV){
      lineWidth=minLineWidth;
    }else {
      lineWidth = maxLineWidth -(v-minV)/(maxV-minV)*(maxLineWidth-minLineWidth)
    }
    if(this.data.lastLineWidth==-1){
      return lineWidth
    }
    var lastLineWidth = this.data.lastLineWidth;

    return lastLineWidth/3*2+lineWidth/2;
  },
  startDraw(e){
    this.getloc(e);
    this.setData({ isDraw: true})
  },

  draw(e){
    if(this.data.isDraw){
      var ctx = wx.createCanvasContext('firstCanvas')
      var x = this.data.lastLoc.x
      var y = this.data.lastLoc.y
      var timeStamp = this.data.lastLoc.timeStamp
      ctx.beginPath()
      ctx.moveTo(x,y)
      ctx.setLineDash([0, 0], 0);
      ctx.setLineCap('round')
      ctx.setLineJoin('round')
      if(this.data.num==-1){
        var strokeColor="black";
      }else{
        var num = this.data.num
        var strokeColor = this.data.colorList[num]
      }
      ctx.setStrokeStyle(strokeColor)
      this.getloc(e);
      var x1 = this.data.lastLoc.x
      var y1 = this.data.lastLoc.y
      var timeStamp2 = this.data.lastLoc.timeStamp
      var v = this.getV(x,y,timeStamp,x1,y1,timeStamp2)
      var lineWidth = this.getLineWidth(v);
      this.setData({
        lastLineWidth: lineWidth
      })
      ctx.setLineWidth(lineWidth)
      ctx.lineTo(x1,y1)
      ctx.stroke()


      ctx.draw(true)
      
    }

  },
  endDraw(e){
    this.setData({ isDraw: false })
  },
  rebuild(){
    var ctx = wx.createCanvasContext('firstCanvas')
    var width = this.data.canvasWidth;
    ctx.clearRect(0,0,width,width)
    this.gird()
  },
  changeColor(e){
    this.setData({
      num: e.target.dataset.num
    })
  }

})