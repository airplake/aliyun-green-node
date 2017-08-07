const TextScanner = require('../lib')
const uuidV1 = require('uuid/v1')

const Scanner = new TextScanner({
  AccessKeyId: 'u6vDG44BBCG4sc45',
  AccessKeySecret: 'sS4e47EZoq5Io1ZGPRVAF5cwEijKZr'
})

let ContentList = [
  {
    dataId: uuidV1(),
    content: 'fuck'
  },
  {
    dataId: uuidV1(),
    content: 'Hello'
  }
]

Scanner.scan({
  scenes: 'antispam',
  tasks: ContentList
}).then((respone) => {
  console.log(respone.result)
}).catch(err => {
  console.log(err)
})
