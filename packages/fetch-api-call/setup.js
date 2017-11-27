'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _api = require('bivrost/http/api');

var _api2 = _interopRequireDefault(_api);

var _createInterceptors = require('./createInterceptors');

var _createInterceptors2 = _interopRequireDefault(_createInterceptors);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            }
          );
        }
      }
      return step('next');
    });
  };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

var DEFAULT_MODE = 'cors';
var DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

exports.default = function(_ref) {
  var adapter = _ref.adapter,
    defaults = _objectWithoutProperties(_ref, ['adapter']);

  return function(_ref2) {
    var headers = _ref2.headers,
      mode = _ref2.mode,
      options = _objectWithoutProperties(_ref2, ['headers', 'mode']);

    var interceptors = (0, _createInterceptors2.default)(defaults.interceptors);

    return {
      interceptors: interceptors,
      api: (0, _api2.default)(
        _extends(
          {
            adapter: adapter({
              mode: mode ? mode : defaults.mode,
              headers: headers ? headers : defaults.headers,
              interceptors: {
                request: function request(_request) {
                  return interceptors.request(_request);
                },
                error: (function() {
                  var _ref3 = _asyncToGenerator(
                    _regeneratorRuntime2.default.mark(function _callee(_error) {
                      return _regeneratorRuntime2.default.wrap(
                        function _callee$(_context) {
                          while (1) {
                            switch ((_context.prev = _context.next)) {
                              case 0:
                                _context.next = 2;
                                return interceptors.error(_error);

                              case 2:
                                throw _context.sent;

                              case 3:
                              case 'end':
                                return _context.stop();
                            }
                          }
                        },
                        _callee,
                        undefined
                      );
                    })
                  );

                  return function error(_x) {
                    return _ref3.apply(this, arguments);
                  };
                })(),
                response: (function() {
                  var _ref4 = _asyncToGenerator(
                    _regeneratorRuntime2.default.mark(function _callee2(
                      _response
                    ) {
                      return _regeneratorRuntime2.default.wrap(
                        function _callee2$(_context2) {
                          while (1) {
                            switch ((_context2.prev = _context2.next)) {
                              case 0:
                                _context2.next = 2;
                                return interceptors.response(_response);

                              case 2:
                                return _context2.abrupt(
                                  'return',
                                  _context2.sent
                                );

                              case 3:
                              case 'end':
                                return _context2.stop();
                            }
                          }
                        },
                        _callee2,
                        undefined
                      );
                    })
                  );

                  return function response(_x2) {
                    return _ref4.apply(this, arguments);
                  };
                })(),
              },
            }),
          },
          options
        )
      ),
    };
  };
};
