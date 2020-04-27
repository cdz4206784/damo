/**
 * 小程序云api封装 2020-03-26
 */

const app = getApp()
export const db = wx.cloud.database()
// const _ = db.command  //此行需要写在对应js页面


// 显示loading
export const showLoading = message => {
  if (wx.showLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.showLoading({
      title: message,
      mask: true
    });
  } else {
    // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
    wx.showToast({
      title: message,
      icon: 'loading',
      mask: true,
      duration: 20000
    });
  }
}

// 隐藏loading
export const hideLoading = () => {
  if (wx.hideLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.hideLoading();
  } else {
    wx.hideToast();
  }
}

// 返回刷新更新上一页数据
export const backRefresh = () => {
  let pages = getCurrentPages();
  if (pages.length > 1) {
    let prePage = pages[pages.length - 2];  //上一个页面实例对象
    prePage.onLoad(prePage.options);  //关键在这里
  }
  wx.navigateBack({
    delta: 2
  })
}

// 判断是否为管理员
export const isAdmin = () =>{
  let has = app.globalData.adminOpenID.findIndex((item, index) => {
    return item == app.globalData.openid
  })
  return has
}

/**
 * 弱提示
 * @param String text 提示文字
 */
export const showTip = (text, fn) => {
  wx.showToast({
    title: text,
    icon: 'none',
    duration: 2000,
    success: res => {
      fn
    }
  })
}

/**
 * 新增或者更新 (多条记录，使用云函数)
 * @param Boolean loadStart 开始处理
 * @param Boolean loadEnd 结束处理(暂用不到)
 * @param String name 集合名
 * @param String where 条件 _id(有-更新 无-新增)
 * @param Object data 数据
 */
export const onAdd = param => {
  if (param.loadStart) {
    wx.showLoading({
      title: '正在处理...'
    })
  }
  const promise = new Promise((resolve, reject)=>{
    let control = {}
    if (param.where) {
      control = db.collection(param.name).doc(param.where).update({ data: param.data })
    } else {
      control = db.collection(param.name).add({ data: param.data })
    }
    control.then(res => {
      resolve(res)
      showTip('操作成功！')
      console.log('[数据库] [新增/更新记录] 成功，记录 _id: ', res._id)
    })
    .catch(err => {
      showTip('操作失败，请重试！')
      console.error('[数据库] [新增/更新记录] 失败：', err)
    })
  })
  return promise
}

/**
 * 查询 (limit前端最大20条，云端1000条)
 * @param Boolean loadStart 开始处理
 * @param Boolean loadEnd 结束处理
 * @param String name 集合名
 * @param Object where 条件
 * @param Number pageNum 页码
 * @param Number showNum 每页显示数量
 * @param String orderField 排序字段
 * @param String orderValue 排序 desc, asc
 */ 
export const onQuery = param => {
  if (param.loadStart) {
    wx.showLoading({
      title: '加载中...'
    })
  }
  const promise = new Promise((resolve, reject)=>{
    // 处理分页
    let pageNum = param.pageNum > 1 ? param.pageNum : 1
    let showNum = param.showNum > 0 ? param.showNum : 20
    let skip = (pageNum - 1) * showNum

    let control = {}
    control = db.collection(param.name).skip(skip).limit(showNum)
    if (!isEmptyObject(param.where)) {
      control = control.where(param.where)
    }
    if (param.orderField && param.orderValue) {
      control = control.orderBy(param.orderField, param.orderValue)
    }
    
    control.get().then(res => {
      resolve(res.data)
      if (param.loadEnd) {
        wx.hideLoading()
      }
      console.log('[数据库] [查询记录] 成功，记录 data: ', res.data)
    }).catch(err => {
      showTip('请联系开发者，连接错误！')
      console.error('[数据库] [查询记录] 失败：', err)
    })
  })
  return promise
}

/**
 * 删除数据及文件 (多条记录，使用云函数)
 * @param String name 集合名
 * @param String where 条件_id
 * @param String fileId 删除源文件Id
 */
export const onRemove = param => {
  const promise = new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: '删除后不可恢复，确认删除吗？',
      success(res) {
        if (res.confirm) {
          db.collection(param.name).doc(param.where).remove().then(res => {
            resolve(res)
          })
         
          if (param.fileId) {
            wx.cloud.deleteFile({
              fileList: [param.fileId]
            })
          }
        }
      }
    })
  })
  return promise
}

/**
 * 上传单图片
 * @param Boolean loadStart 开始处理
 * @param Boolean loadEnd 结束处理
 * @param Number count 图片数 (最大9，支持1)
 */
export const onUpload = (param) => {
  const promise = new Promise((resolve, reject) => {
    let count = param.count ? param.count : 1
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) { 
        if (param.loadStart) {
          wx.showLoading({
            title: '正在上传...'
          })
        }
        // 本地临时文件路径
        const filePath = res.tempFilePaths[0]
        // 随机数
        const timerandom = new Date().getTime() + '_' + parseInt(Math.random() * 1000)
        // 云文件名称（待上传）
        const cloudPath = folderFn() + '/DM_' + timerandom + filePath.match(/\.[^.]+?$/)[0]
    
        //上传文件到服务器
        wx.cloud.uploadFile({
          cloudPath,
          filePath
        }).then(res => {
          resolve(res)
          if (param.loadEnd) {
            wx.hideLoading()
          }
          console.log('[上传文件] 成功：', res)
        }).catch(err => {
          showTip('上传失败！')
          console.error('[上传文件] 失败：', err)
        });
      }
    })
  })
  return promise
}

/**
 * 删除图片
 * fileList 文件[]
 */
export const onDelete = (fileList) => {
  const promise = new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: '删除后不可恢复，确认删除吗？',
      success(res) {
        if (res.confirm) {
          wx.cloud.deleteFile({
            fileList: fileList
          }).then(res => {
            resolve(res)
          })
        }
      }
    })
  })
  return promise
}

// 获取系统当前时间
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//合并两个数组，去重
export const concat_ = function (arr1, arr2) {
  //不要直接使用var arr = arr1，这样arr只是arr1的一个引用，两者的修改会互相影响  
  var arr = arr1.concat();
  //或者使用slice()复制，var arr = arr1.slice(0)  
  for (var i = 0; i < arr2.length; i++) {
    arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
  }
  return arr;
}  

// 判断是否是空对象
const isEmptyObject = e => {
  if (
    null === e ||
    "" === e ||
    [] === e ||
    {} === e ||
    typeof e == "undefined"
  ) {
    return true;
  }
  try {
    if (Object.keys(e).length < 1) {
      return true;
    }
  } catch (error) { }
  let t;
  for (t in e) return !1;
  return !0;
}

// 以年月生成文件夹名称
const folderFn = () =>{
  let year = new Date().getFullYear()
  let month = new Date().getMonth()
  if (month < 10) month = `0${month}`
  let folderName = year + month
  return folderName
}