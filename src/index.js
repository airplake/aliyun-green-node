import crypto from 'crypto'
import uuidV1 from 'uuid/v1'
import request from 'request'

const md5 = crypto.createHash('md5')

class TextScanner {
  constructor ({AccessKeyId = '', AccessKeySecret = ''}) {
    this.AccessKeyId = AccessKeyId
    this.AccessKeySecret = AccessKeySecret
    this.api = 'http://green.cn-hangzhou.aliyuncs.com'
    this.path = '/green/text/scan'
  }

  scan (args) {
    let body = JSON.stringify(args)
    let headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'content-md5': md5.update(body).digest().toString('base64'),
      'Date': (new Date()).toGMTString(),
      'x-acs-signature-method': 'HMAC-SHA1',
      'x-acs-signature-nonce': uuidV1(),
      'x-acs-signature-version': '1.0',
      'x-acs-version': '2017-01-12'
    }

    headers['Authorization'] = this.getSignature(headers)

    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: `${this.api}${this.path}`,
        body: args,
        json: true,
        headers
      }, (error, response, body) => {
        if (error) {
          console.log(error)
        } else if (response.statusCode === 201 || response.statusCode === 200) {
          let resultObj = {
            body,
            result: {}
          }

          for (let testItem of response.body.data) {
            for (let report of testItem.results) {
              if (report.suggestion === 'block') {
                resultObj.result = {
                  suggestion: 'block',
                  content: testItem.content
                }
                resolve(resultObj)
                return
              }
            }
          }

          resultObj.result = {
            suggestion: 'pass'
          }
          resolve(resultObj)
        } else {
          reject(body, error)
        }
      })
    })
  }

  getSignature (headers) {
    let signature = []
    signature.push('POST\n')
    signature.push('application/json\n')
    signature.push(`${headers['content-md5']}\n`)
    signature.push(`application/json\n`)
    signature.push(`${headers['Date']}\n`)
    signature.push(this.parseHeader(headers))
    signature.push(this.parseQuery(headers))

    let authorization = crypto.createHmac('sha1', this.AccessKeySecret)
                   .update(signature.join(''))
                   .digest().toString('base64')

    return `acs ${this.AccessKeyId}:${authorization}`
  }

  parseHeader (headers) {
    return 'x-acs-signature-method:' + headers['x-acs-signature-method'] + '\n' +
      'x-acs-signature-nonce:' + headers['x-acs-signature-nonce'] + '\n' +
      'x-acs-signature-version:' + headers['x-acs-signature-version'] + '\n' +
      'x-acs-version:' + headers['x-acs-version'] + '\n'
  }

  parseQuery (headers) {
    return this.path
  }
}

module.exports = TextScanner
