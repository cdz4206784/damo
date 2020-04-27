//index.js
const app = getApp()
import { showLoading, hideLoading } from '../../utils/util'

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,

    pageNum: 1,
    showNum: 10,
    photoDatas: [],
    noData: false,
    loadTxt: ''
  },

  jumpVideo: function(){
    wx.navigateTo({
      url: '../video/video',
    })
  },

  // 查看图片懒加载
  // outputSrc(e) {
  //   // 只需查看本事件触发即可知道image 的加载情况
  //   console.log(e.currentTarget.dataset.src, "outputSrc")
  // },

  // 用户授权 => 获取用户信息
  onGetUserInfo: function (e) {
    console.log(e, "授权信息")
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  // 已经授权 => 获取用户信息
  onGetSetting: function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res, "获取用户信息")
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    let that = this
    let { pageNum, showNum } = that.data

    showLoading('加载中...')
    // 调用云函数 查
    wx.cloud.callFunction({
      name: 'onQuery',
      data: {
        name: 'Photos',
        pageNum: pageNum,
        showNum: showNum,
        // where: { p_year: 2020 },
        orderField: 'p_time',
        orderValue: 'desc'
      }
    }).then(res => {
      console.log(res.result, "onQuery")
      if (typeof res.result == 'object' && res.result.data.length > 0){
        that.setData({
          photoDatas: res.result.data,
          loadTxt: '加载更多'
        }, () => {
          hideLoading()
        })
      }else{
        that.setData({
          noData: true
        }, () => {
          hideLoading()
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.onLoad()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let { photoDatas, pageNum, showNum } = that.data;
    let listArr = [] //定义一个空数组
    let curPage = pageNum + 1 //页码加1
 
    showLoading('加载中...')
    wx.cloud.callFunction({
      name: 'onQuery',
      data: {
        name: 'Photos',
        pageNum: curPage,
        showNum: showNum,
        // where: { p_year: 2020 },
        orderField: 'p_time',
        orderValue: 'desc'
      }
    }).then(res => {
      console.log(res.result, "onQuery====curPage")
      if (typeof res.result == 'object' && res.result.data.length > 0) {
        let newData = photoDatas.concat(res.result.data)
        that.setData({
          pageNum: curPage,
          photoDatas: newData
        }, () => {
          hideLoading()
        })
      } else {
        that.setData({
          loadTxt: '加载完毕'
        }, () => {
          hideLoading()
        })
      }
    }).catch(err => {
      console.error(err)
    })

  }
})
