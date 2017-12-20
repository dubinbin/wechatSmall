//index.js
//获取应用实例
const app = getApp()
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
  onReady: function (e) {
  },
  data: {
    recordUrl: '',
    downloadUrl: ''
  },
  goToNewPage: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  beginRecord: function () {
    recorderManager.start(options)
  },
  stopRecord: function () {
    recorderManager.stop()
    recorderManager.onStop((res) => {
      console.log(res)
      var tempFilePaths = res.tempFilePath;
      var _self = this;
      wx.uploadFile({
        url: 'https://www.dubinbin.cn/api/uploadAudio',
        filePath: tempFilePaths,
        name: 'file',
        success: function (res) {
          _self.setData({
            recordUrl: 'https://www.dubinbin.cn' + res.data.substring(1)
          })
        }
      })
    })
  },
  playRecord() {
    var _self = this;
    wx.downloadFile({
      url: _self.data.recordUrl,
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
})
