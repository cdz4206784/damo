// pages/publish/publish.js
const app = getApp()
import { onUpload, onDelete, backRefresh, showTip, showLoading, hideLoading, isAdmin } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    p_title: '',  //标题
    p_desc: '',  //内容
    p_imgs: [], //图片
  },

  // 标题
  bindTitleChange: function (e) {
    this.setData({
      p_title: e.detail.value
    });
  },

  // 内容
  bindContentChange: function (e) {
    this.setData({
      p_desc: e.detail.value
    });
  },

  // 删除图片
  delImg: function ({ currentTarget: { dataset: { current } } }) {
    let { p_imgs } = this.data
    let fileList = [p_imgs[current]]
    onDelete(fileList).then(res => {
      p_imgs.splice(current, 1)
      this.setData({ p_imgs },()=>{
        showTip('删除成功')
      })
    })
  },
 
  // 上传图片 允许上传3张
  uploadImg: function () {
    if (isAdmin() != -1){
      let that = this
      let { p_imgs } = that.data

      if (p_imgs.length < 3) {
        onUpload({
          loadStart: true,
          loadEnd: true
        }).then(res => {
          // console.log(res, "上传图片")
          if (res.statusCode == 200) {
            p_imgs.push(res.fileID)
            that.setData({ p_imgs })
          } else {
            showTip('上传失败')
          }
        })
      } else {
        showTip('最多上传3张图片')
      }
    }else{
      showTip('无权操作')
    }
  },

  // 查看大图
  prevImg: function ({ currentTarget: { dataset: { current } } }) {
    let p_imgs = this.data;
    wx.previewImage({
      current: p_imgs[current], // 当前显示图片的http链接
      urls: p_imgs // 需要预览的图片http链接列表
    })
  },

  // 提交 调用云函数 增
  bindSubmit: function (e) {
    if (isAdmin() != -1) {
      let that = this;
      let { p_title, p_desc, p_imgs } = that.data;

      if (p_title == '' || p_title == null) {
        showTip('标题不能为空')
        return;
      }

      showLoading('发布中...')
      wx.cloud.callFunction({
        name: 'onAdd',
        data: {
          name: 'Photos',
          obj: { p_title, p_desc, p_imgs },
          openid: app.globalData.openid
        }
      }).then(res => {
        console.log(res, "onAdd")
        if (typeof res.result == 'object' && res.result._id) {
          hideLoading()
          showTip('发布成功', backRefresh())
        } else {
          showTip('无权操作')
        }
      }).catch(err => {
        console.error(err)
      })
    } else {
      showTip('无权操作')
    }
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