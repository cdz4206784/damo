# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

- 前端util.js公开方法调用说明:

```
import { db, onAdd, onRemove, onQuery, onUpload } from '../../utils/util'
const _ = db.command
```

- 新增
```
onAdd({
  loadStart: true,
  name: 'counters',
  data: {
   count: 100
  }
}).then(res=>{
  console.log(res,"addaddddddddd")
})
```

- 修改
```
onAdd({
  loadStart: true,
   name: 'counters',
   where: '6aebd2215e7c54a8000e828b32638ff0',
   data: {
    count: 99
   }
}).then(res=>{
 console.log(res,"addaddddddddd")
})
```

- 删除
```
onRemove({
  name: 'counters',
  where: '42c9a7b15e7c0f78000c03ab4da52dca',
  fileId: 'cloud://prod-caev4.7072-prod-caev4-1301650577/my-image.jpeg'
}).then(res=>{
  console.log(res,"ddddddd")
})
```

- 查询所有
```
onQuery({
  loadStart: true,
  loadEnd: true,
  name: 'counters',
  pageNum: 1,
  showNum: 5,
  where: {
   count: _.gt(1)
  },
  orderField: 'count',
  orderValue: 'asc'
}).then(res=>{
  console.log(res, "qqqqq")
})
```

- 查询单个
```
onQuery({
  loadStart: true,
  loadEnd: true,
  name: 'counters',
  where: 'dc65fe3e5e7c0f2b0009a58a75b577ea'
}).then(res=>{
  console.log(res, "qqqqq")
})
```

- 上传图片
```
onUpload({
  loadStart: true,
  loadEnd: true,
}).then(res=>{
  console.log(res,"rerererererere")
})
```

##其他内容完善中...
