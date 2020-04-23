// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
/**
 * 查询 (limit云端最大1000条/次)
 * @param String name 集合名(防止暴露，再拼接DM_)
 * @param Object where 条件
 * @param Number pageNum 页码
 * @param Number showNum 每页显示数量
 * @param String orderField 排序字段
 * @param String orderValue 排序 desc, asc
 */
exports.main = async (event, context) => {
  try {
    // 处理分页
    let pageNum = event.pageNum > 1 ? event.pageNum : 1
    let showNum = event.showNum > 0 && event.showNum < 21 ? event.showNum : 20
    let skip = (pageNum - 1) * showNum
    let tableName = `DM_${event.name}`

    // 设置语句
    let control = {}
    control = db.collection(tableName).skip(skip).limit(showNum)

    if (!isEmptyObject(event.where)) {
      control = control.where(event.where)
    }
    if (event.orderField && event.orderValue) {
      control = control.orderBy(event.orderField, event.orderValue)
    }

    return await control.get({
      success: res => res,
      fail: err => err
    })
  } catch(e) {
    console.error(e)
  }
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