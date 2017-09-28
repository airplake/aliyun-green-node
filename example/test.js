const TextScanner = require('../lib')
const uuidV1 = require('uuid/v1')

const Scanner = new TextScanner({
  AccessKeyId: 'u6vDG44BBCG4sc45',
  AccessKeySecret: 'sS4e47EZoq5Io1ZGPRVAF5cwEijKZr'
})

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

// Img Scan DEMO
Scanner.scanImg({
  scenes: 'porn',
  tasks: [
    {
      dataId: uuidV1(),
      url: 'http://ooa2erl8d.bkt.clouddn.com/002eaf9f0709471bbab9619aca6a94e8.jpg'
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
