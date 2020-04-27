// components/no-data/no-data.js
const app = getApp();
Component({
  properties: {
    haveData: {
      type: Boolean,
      value: false
    }
  },
  data: {},
  attached: function () {},

  options: {
    addGlobalClass: true  //使用全局样式
  },

  methods: {}
})