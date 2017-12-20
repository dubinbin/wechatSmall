// pages/login/login.js
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}



Page({

  /**
   * 页面的初始数据
   */
  // 
  data: {
    src: '',
    imgSrc:'',
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }]
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  uploadImg() {
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
  rercordVideo: function () {
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
  beginPlay:function(e){
    console.log(e)
    // this.setData({
    //   beginTime:e.timeStamp
    // })
  },
  playevent:function(e) {
    console.log(e.timeStamp)
    // if (e.timeStamp > this.data.beginTime==5000){
    //    console.log('性感荷官发牌  5s')
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})