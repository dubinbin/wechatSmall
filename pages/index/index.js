const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()


const options = {
  duration: 60000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}


Page({
  data: {
    RecordStatus:'',
    isModal:'',
    nowSecond:0,
    downloadUrl: '',
    audioArray : [],
    timer:'',
    src:'',
    imgSrc:''
  },
  bindFormSubmit: function (e) {
    console.log(e.detail.value.textarea)
  },
  rercordAudio:function(){
    this.setData({
      RecordStatus:'begin',
      isModal: true,
    })
  },
  uploadImg:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: 'https://www.dubinbin.cn/api/uploadImage',
          filePath: tempFilePaths,
          name: 'file',
          success: function (res) {
            console.log(res)
            that.setData({
              imgSrc: 'https://www.dubinbin.cn' + res.data.substring(1)
            })
          }
        })
      }
    })
  },

  rercordVideo:function(){
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePath;
        wx.uploadFile({
          url: 'https://www.dubinbin.cn/api/uploadVideo',
          filePath: tempFilePaths,
          name: 'file',
          success: function (res) {
            console.log(res)
            that.setData({
              src: 'https://www.dubinbin.cn' + res.data.substring(1)
            })
          }
        })
      }
    })
  },
  beginPlay: function (e) {
    console.log(e)
  },
  playevent: function (e) {
    console.log(e.timeStamp)
  },
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  //开始录音
  beginRecord:function() {
    this.timefall();
    recorderManager.start(options)
     this.setData({
       RecordStatus:'end'
     })
  },
  //结束录音
  endRecord:function() {
    clearInterval(this.data.timer)
    this.setData({
      nowSecond:0
    })
    var getAudioArray = this.data.audioArray
    recorderManager.stop()                                          
    recorderManager.onStop((res) => {
      var tempFilePaths = res.tempFilePath;
      var _self = this;
      wx.uploadFile({
        url: 'https://www.dubinbin.cn/api/uploadAudio',
        filePath: tempFilePaths,
        name: 'file',
        success: function (res) {
          console.log(res)
          var obj =  {
            url: 'https://www.dubinbin.cn' + res.data.substring(1)
          }
          getAudioArray.push(obj)
          _self.setData({
            audioArray: getAudioArray
          })
        }
      })
    })
    this.setData({
      RecordStatus: 'begin',
    })
  },
  playAudio(e) {
    console.log(e)
    var _self = this;
    wx.downloadFile({
      url: e.target.dataset.url,
      success: function (res) {
        _self.setData({
          downloadUrl: res.tempFilePath
        })
        innerAudioContext.autoplay = true
        innerAudioContext.src = _self.data.downloadUrl;
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
          console.log(_self.data.downloadUrl)
          console.log(res.errMsg)
          console.log(res.errCode)
        })
      }
    })
  },
  timefall:function(){
    var _self = this;
    _self.data.timer =  setInterval(function(){
      if (_self.data.nowSecond>=59){
        clearInterval(_self.data.timer)
        _self.endRecord();
        _self.beginRecord();
      }else{
        var time = _self.data.nowSecond+=1
        console.log(time)
        _self.setData({
          nowSecond: time
        })        
      }

      },1000)
  },
  closeModal:function() {
    if (this.data.RecordStatus =='end'){
      return false
    }else{
       this.setData({
        RecordStatus:'',
        isModal: false,
      })     
    }
  }
})