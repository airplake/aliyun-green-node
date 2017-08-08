const TextScanner = require('../lib')
const uuidV1 = require('uuid/v1')

const Scanner = new TextScanner({
  AccessKeyId: 'u6vDG44BBCG4sc45',
  AccessKeySecret: 'sS4e47EZoq5Io1ZGPRVAF5cwEijKZr'
})

let ContentList = [
  {
    dataId: uuidV1(),
    content: 'fuc2k'
  },
  {
    dataId: uuidV1(),
    content: 'Hello'
  }
]

Scanner.scanText({
  scenes: 'antispam',
  tasks: ContentList
}).then((respone) => {
  console.log(respone)
}).catch(err => {
  console.log(err)
})

let ImgList = [
  {
    dataId: uuidV1(),
    url: 'https://cdn.pixabay.com/photo/2016/01/07/19/49/model-1126417__480.jpg'
  },
  {
    dataId: uuidV1(),
    url: 'http://pic.yesky.com/uploadImages/2014/350/44/NENOJ6U717UU.png'
  }
]

Scanner.scanImg({
  scenes: 'porn',
  tasks: ImgList
}).then((respone) => {
  console.log(respone)
}).catch(err => {
  console.log(err)
})
