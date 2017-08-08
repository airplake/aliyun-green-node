aliyun-green-node
Aliyun 反黄反暴过滤服务包

## 安装

```console
$ npm install --save aliyun-green-node
```
or
```console
$ yarn add  aliyun-green-node
```

## 使用

### 初始化对象

```javascript
const green = require('aliyun-green-node')

const Scanner = new green({
  AccessKeyId: 'Your Access Key',
  AccessKeySecret: 'Your Secret Key'
})
```

### 检测接口
1. 内容检测

```javascript
// Text Scan DEMO
Scanner.scanText({
  scenes: 'antispam',
  tasks: [
    {
      dataId: uuidV1(),
      content: 'fuc2k'
    },
    {
      dataId: uuidV1(),
      content: 'Hello'
    }
  ]
}).then((respone) => {
  console.log(respone)
}).catch(err => {
  console.log(err)
})
```

2. 图片鉴黄

```javascript
// Img Scan DEMO
Scanner.scanImg({
  scenes: 'porn',
  tasks: [
    {
      dataId: uuidV1(),
      url: 'https://cdn.pixabay.com/photo/2016/01/07/19/49/model-1126417__480.jpg'
    },
    {
      dataId: uuidV1(),
      url: 'http://pic.yesky.com/uploadImages/2014/350/44/NENOJ6U717UU.png'
    }
  ]
}).then((respone) => {
  console.log(respone)
}).catch(err => {
  console.log(err)
})
```

### 返回值说明(img为例)

```
{ 
  body:{ 
    code: 200,
    data: [ [Object], [Object] ],
    msg: 'OK',
    requestId: '0DD1D693-E59A-49D9-852B-9305A497E2BF' 
  },
  result:{
    suggestion: 'review', // [“pass”, “review”, “block”], pass:图片正常，review：需要人工审核，block：图片违规
    url: 'https://cdn.pixabay.com/photo/2016/01/07/19/49/model-1126417__480.jpg'
  } 
}
```

body字段是   阿里云返回的完整数据，如果需要扩展，则可以对这个对象进行处理

result字段是 附加的、分析得出的简单返回结果，提供方便的方式给开发者判断通过与否 


### 贡献者 Contributors
阿文 @kelvv