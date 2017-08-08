import uuidV1 from 'uuid/v1'
import request from 'request'

var crypto = require('crypto')
function md5 (text) {
  return crypto.createHash('md5').update(text).digest('base64')
};

class TextScanner {
  constructor ({AccessKeyId = '', AccessKeySecret = ''}) {
    this.AccessKeyId = AccessKeyId
    this.AccessKeySecret = AccessKeySecret
    this.api = 'http://green.cn-hangzhou.aliyuncs.com'
  }

  async scanText (args) {
    let path = '/green/text/scan'
    let body = await this.core(args, path)
    if (body.code !== 200) {
      throw Error(body.msg)
    }
    let resultObj = {
      body,
      result: {
        suggestion: 'pass'
      }
    }

    for (let testItem of body.data) {
      for (let report of testItem.results) {
        if (report.suggestion !== 'pass') {
          resultObj.result = {
            suggestion: report.suggestion,
            content: testItem.content
          }
          return resultObj
        }
      }
    }
    return resultObj
  }

  async scanImg (args) {
    let path = '/green/image/scan'
    let body = await this.core(args, path)
    if (body.code !== 200) {
      throw Error(body.msg)
    }
    let resultObj = {
      body,
      result: {
        suggestion: 'pass'
      }
    }

    for (let testItem of body.data) {
      for (let report of testItem.results) {
        if (report.suggestion !== 'pass') {
          resultObj.result = {
            suggestion: report.suggestion,
            url: testItem.url
          }
          return resultObj
        }
      }
    }
    return resultObj
  }

  core (args, path) {
    let body = JSON.stringify(args)
    let headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'content-md5': md5(body),
      'Date': (new Date()).toGMTString(),
      'x-acs-signature-method': 'HMAC-SHA1',
      'x-acs-signature-nonce': uuidV1(),
      'x-acs-signature-version': '1.0',
      'x-acs-version': '2017-01-12'
    }

    headers['Authorization'] = this.getSignature(headers, path)

    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: `${this.api}${path}`,
        body: args,
        json: true,
        headers
      }, (error, response, body) => {
        if (error) {
          console.log(error)
        } else if (response.statusCode === 201 || response.statusCode === 200) {
          resolve(response.body)
        } else {
          reject(body, error)
        }
      })
    })
  }

  getSignature (headers, path) {
    let signature = []
    signature.push('POST\n')
    signature.push('application/json\n')
    signature.push(`${headers['content-md5']}\n`)
    signature.push(`application/json\n`)
    signature.push(`${headers['Date']}\n`)
    signature.push(this.parseHeader(headers))
    signature.push(this.parseQuery(headers, path))

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

  parseQuery (headers, path) {
    return path
  }
}

module.exports = TextScanner
