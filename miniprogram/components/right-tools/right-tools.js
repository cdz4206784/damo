// components/right-tools/right-tools.js
const app = getApp();
import { isAdmin } from '../../utils/util'
Component({
  properties: {},
  data: {
    adminFlag: false, //是否管理员
  },
  attached: function () {
    // 验证是否为管理员
    let that = this
    if (!app.globalData.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          if (isAdmin() != -1) {
            that.setData({
              adminFlag: true
            })
          }
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    } else {
      if (isAdmin() != -1) {
        that.setData({
          adminFlag: true
        })
      }
    }
  },

  options: {
    addGlobalClass: true  //使用全局样式
  },

  methods: {
    // 置顶
    backTop: function () {
      wx.pageScrollTo({
        scrollTop: 0
      })
    },

    // 发布
    publishFn: function () {
      wx.navigateTo({
        url: '/pages/publish/publish',
      })
    }
  }
})