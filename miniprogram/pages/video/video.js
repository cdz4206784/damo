// pages/video/video.js
const app = getApp()
import { backRefresh, showTip, showLoading, hideLoading } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    vertical: true,
    previousMargin: 0,
    nextMargin: 0,  //默认单位px
    swiperCurrent: 0,

    swiperData: [
      { 
        v_title: '七彩曜变星云钵-黄美金', 
        v_source: 'https://outin-c4f26355f39b11e8854100163e1c60dc.oss-cn-shanghai.aliyuncs.com/sv/5c830644-17172cbd723/5c830644-17172cbd723.mp4',
        v_poster: 'https://static.zisha.com/zisha_app/live/list/202004/a196e22c05359d0d0dd33745bf8c8cf0.jpg'
      },
      { 
        v_title: '谈跃伟-棱花线圆', 
        v_source: 'https://outin-c4f26355f39b11e8854100163e1c60dc.oss-cn-shanghai.aliyuncs.com/sv/2ab2e46d-17172b3aca6/2ab2e46d-17172b3aca6.mp4',
        v_poster: 'https://static.zisha.com/zisha_app/live/list/202004/0c9c77676eeeb62de9ac12acecd38377.jpg'
      },
      { 
        v_title: '香雾青霏，祥云红绕', 
        v_source: 'https://outin-c4f26355f39b11e8854100163e1c60dc.oss-cn-shanghai.aliyuncs.com/sv/5773632f-16dd26db213/5773632f-16dd26db213.mp4',
        v_poster: 'https://static.zisha.com/zisha_app/live/list/201910/ac483d5c5e9db58faa232f979d6f6857.png'
      }
    ]
  },

  // current改变时触发
  swiperChange: function (e) {
    let swiperCurrent = this.data.swiperCurrent
    let current = e.detail.current

    this.setData({ swiperCurrent: current }, ()=>{
      this.videoPause(swiperCurrent)
      this.videoPlay(current)
    })
  },

  // 播放视频
  videoPlay: function (current) {
    wx.createVideoContext('myVideo' + current).play()
  },

  // 暂停视频
  videoPause: function (current) {
    wx.createVideoContext('myVideo' + current).pause()
  },

  // 播放出错
  errorFn: function(e){
    showTip('视频播放出错')
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
    this.videoPlay(this.data.swiperCurrent)
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