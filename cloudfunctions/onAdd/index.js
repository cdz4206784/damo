// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let tableName = `DM_${event.name}`

    let adminOpenID = ['o9wmM5RdNzx0sjA4YEHOIgYpDSYI', 'o9wmM5RJjqb5Th1oKoz_rcxYOnI4']
    let isAdmin = adminOpenID.findIndex((item, index)=>{
      return item == event.openid
    })

    if (isAdmin != -1){
      return await db.collection(tableName).add({
        data: {
          p_title: event.obj.p_title,
          p_desc: event.obj.p_desc,
          p_imgs: event.obj.p_imgs,
          p_time: new Date().getTime().toString(),
          p_year: new Date().getFullYear()
        },
        success: res => res,
        fail: err => err
      })
    }else{
      return {
        data: false,
        code: 400,
        msg: '无权操作'
      }
    }
  } catch (e) {
    console.error(e)
  }
}