'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var crypto = require('crypto');
function md5(text) {
  return crypto.createHash('md5').update(text).digest('base64');
};

var TextScanner = function () {
  function TextScanner(_ref) {
    var _ref$AccessKeyId = _ref.AccessKeyId,
        AccessKeyId = _ref$AccessKeyId === undefined ? '' : _ref$AccessKeyId,
        _ref$AccessKeySecret = _ref.AccessKeySecret,
        AccessKeySecret = _ref$AccessKeySecret === undefined ? '' : _ref$AccessKeySecret;

    _classCallCheck(this, TextScanner);

    this.AccessKeyId = AccessKeyId;
    this.AccessKeySecret = AccessKeySecret;
    this.api = 'http://green.cn-hangzhou.aliyuncs.com';
  }

  _createClass(TextScanner, [{
    key: 'scanText',
    value: async function scanText(args) {
      var path = '/green/text/scan';
      var body = await this.core(args, path);
      if (body.code !== 200) {
        throw Error(body.msg);
      }
      var resultObj = {
        body: body,
        result: {
          suggestion: 'pass'
        }
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = body.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var testItem = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = testItem.results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var report = _step2.value;

              if (report.suggestion !== 'pass') {
                resultObj.result = {
                  suggestion: report.suggestion,
                  content: testItem.content
                };
                return resultObj;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return resultObj;
    }
  }, {
    key: 'scanImg',
    value: async function scanImg(args) {
      var path = '/green/image/scan';
      var body = await this.core(args, path);
      if (body.code !== 200) {
        throw Error(body.msg);
      }
      var resultObj = {
        body: body,
        result: {
          suggestion: 'pass'
        }
      };

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = body.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var testItem = _step3.value;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = testItem.results[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var report = _step4.value;

              if (report.suggestion !== 'pass') {
                resultObj.result = {
                  suggestion: report.suggestion,
                  url: testItem.url
                };
                return resultObj;
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return resultObj;
    }
  }, {
    key: 'core',
    value: function core(args, path) {
      var _this = this;

      var body = JSON.stringify(args);
      var headers = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'content-md5': md5(body),
        'Date': new Date().toGMTString(),
        'x-acs-signature-method': 'HMAC-SHA1',
        'x-acs-signature-nonce': (0, _v2.default)(),
        'x-acs-signature-version': '1.0',
        'x-acs-version': '2017-01-12'
      };

      headers['Authorization'] = this.getSignature(headers, path);

      return new Promise(function (resolve, reject) {
        (0, _request2.default)({
          method: 'POST',
          url: '' + _this.api + path,
          body: args,
          json: true,
          headers: headers
        }, function (error, response, body) {
          if (error) {
            console.log(error);
          } else if (response.statusCode === 201 || response.statusCode === 200) {
            resolve(response.body);
          } else {
            reject(body, error);
          }
        });
      });
    }
  }, {
    key: 'getSignature',
    value: function getSignature(headers, path) {
      var signature = [];
      signature.push('POST\n');
      signature.push('application/json\n');
      signature.push(headers['content-md5'] + '\n');
      signature.push('application/json\n');
      signature.push(headers['Date'] + '\n');
      signature.push(this.parseHeader(headers));
      signature.push(this.parseQuery(headers, path));

      var authorization = crypto.createHmac('sha1', this.AccessKeySecret).update(signature.join('')).digest().toString('base64');

      return 'acs ' + this.AccessKeyId + ':' + authorization;
    }
  }, {
    key: 'parseHeader',
    value: function parseHeader(headers) {
      return 'x-acs-signature-method:' + headers['x-acs-signature-method'] + '\n' + 'x-acs-signature-nonce:' + headers['x-acs-signature-nonce'] + '\n' + 'x-acs-signature-version:' + headers['x-acs-signature-version'] + '\n' + 'x-acs-version:' + headers['x-acs-version'] + '\n';
    }
  }, {
    key: 'parseQuery',
    value: function parseQuery(headers, path) {
      return path;
    }
  }]);

  return TextScanner;
}();

module.exports = TextScanner;