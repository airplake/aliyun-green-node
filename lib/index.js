'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var md5 = _crypto2.default.createHash('md5');

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
    this.path = '/green/text/scan';
  }

  _createClass(TextScanner, [{
    key: 'scan',
    value: function scan(args) {
      var _this = this;

      var body = JSON.stringify(args);
      var headers = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'content-md5': md5.update(body).digest().toString('base64'),
        'Date': new Date().toGMTString(),
        'x-acs-signature-method': 'HMAC-SHA1',
        'x-acs-signature-nonce': (0, _v2.default)(),
        'x-acs-signature-version': '1.0',
        'x-acs-version': '2017-01-12'
      };

      headers['Authorization'] = this.getSignature(headers);

      return new Promise(function (resolve, reject) {
        (0, _request2.default)({
          method: 'POST',
          url: '' + _this.api + _this.path,
          body: args,
          json: true,
          headers: headers
        }, function (error, response, body) {
          if (error) {
            console.log(error);
          } else if (response.statusCode === 201 || response.statusCode === 200) {
            var resultObj = {
              body: body,
              result: {}
            };

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = response.body.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var testItem = _step.value;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = testItem.results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var report = _step2.value;

                    if (report.suggestion === 'block') {
                      resultObj.result = {
                        suggestion: 'block',
                        content: testItem.content
                      };
                      resolve(resultObj);
                      return;
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

            resultObj.result = {
              suggestion: 'pass'
            };
            resolve(resultObj);
          } else {
            reject(body, error);
          }
        });
      });
    }
  }, {
    key: 'getSignature',
    value: function getSignature(headers) {
      var signature = [];
      signature.push('POST\n');
      signature.push('application/json\n');
      signature.push(headers['content-md5'] + '\n');
      signature.push('application/json\n');
      signature.push(headers['Date'] + '\n');
      signature.push(this.parseHeader(headers));
      signature.push(this.parseQuery(headers));

      var authorization = _crypto2.default.createHmac('sha1', this.AccessKeySecret).update(signature.join('')).digest().toString('base64');

      return 'acs ' + this.AccessKeyId + ':' + authorization;
    }
  }, {
    key: 'parseHeader',
    value: function parseHeader(headers) {
      return 'x-acs-signature-method:' + headers['x-acs-signature-method'] + '\n' + 'x-acs-signature-nonce:' + headers['x-acs-signature-nonce'] + '\n' + 'x-acs-signature-version:' + headers['x-acs-signature-version'] + '\n' + 'x-acs-version:' + headers['x-acs-version'] + '\n';
    }
  }, {
    key: 'parseQuery',
    value: function parseQuery(headers) {
      return this.path;
    }
  }]);

  return TextScanner;
}();

module.exports = TextScanner;