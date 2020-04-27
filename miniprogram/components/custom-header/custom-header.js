// components/custom-header/custom-header.js
const app = getApp();
Component({
  properties: {
    vTitle: {
      type: String,
      value: ""
    }
  },

  options: {
    addGlobalClass: true  //使用全局样式
  },

  data: {
    haveBack: true, // 是否有返回按钮，true 有 false 没有 若从分享页进入则没有返回按钮
    statusBarHeight: 0, // 状态栏高度
    navbarHeight: 0, // 顶部导航栏高度
    btnPosi: { // 左侧胶囊位置信息
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    titPosi: { // 标题位置信息
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  },
  
  // 微信7.0.0支持wx.getMenuButtonBoundingClientRect()获得胶囊按钮高度
  attached: function () {
    // 获取设备系统信息
    if (!app.globalData.systeminfo) {
      app.globalData.systeminfo = wx.getSystemInfoSync();
    }

    // 获取右侧胶囊信息
    if (!app.globalData.headerBtnPosi) {
      app.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect();
    }

    let statusBarHeight = app.globalData.systeminfo.statusBarHeight // 状态栏高度
    let windowWidth = app.globalData.systeminfo.windowWidth //屏幕宽度
    let headerPosi = app.globalData.headerBtnPosi // 右侧胶囊位置信息
    let posiMar = headerPosi.bottom - headerPosi.height - statusBarHeight // 右侧胶囊bottom - height - 状态栏height = 间距

    // 左侧胶囊位置信息，依具左上角原点
    let btnPosi = {
      width: headerPosi.width,
      height: headerPosi.height,
      left: windowWidth - headerPosi.right, //窗口宽度 - 右侧胶囊righ = 左侧胶囊left
      top: headerPosi.top,
      right: windowWidth - headerPosi.right + headerPosi.width, //窗口宽度 - 右侧胶囊righ + 自身宽度 =  左侧胶囊right
      bottom: headerPosi.bottom
    }

    // 中间标题位置信息，依具左上角原点
    let titPosi = {
      width: windowWidth - btnPosi.left * 2 - btnPosi.width * 2,
      height: headerPosi.height,
      left: btnPosi.left + btnPosi.width, //左侧胶囊left + width = 标题left
      top: headerPosi.top,
      right: headerPosi.left, //右侧胶囊left =  标题right
      bottom: headerPosi.bottom
    }

    // 是否存在返回
    let haveBack;
    if (getCurrentPages().length != 1) { // 当只有一个页面时，并且是从分享页进入
      haveBack = false;
    } else {
      haveBack = true;
    }

    this.setData({
      haveBack: haveBack,
      statusBarHeight: statusBarHeight,
      navbarHeight: headerPosi.bottom + posiMar, // 右侧胶囊bottom + 间距
      btnPosi: btnPosi,
      titPosi: titPosi
    })
  },

  methods: {
    _goBack: function () {
      wx.navigateBack({
        delta: 1
      });
    },
    _goHome: function () {
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }
  }
})