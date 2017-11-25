'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

exports.default = function() {
  var interceptors = {
    error: new Set(),
    request: new Set(),
    response: new Set(),
  };

  return {
    request: function request(_request) {
      return []
        .concat(_toConsumableArray(interceptors.request))
        .reduce(function(request, cb) {
          return cb(request);
        }, _request);
    },
    error: function error(_error) {
      return []
        .concat(_toConsumableArray(interceptors.error))
        .reduce(function(error, cb) {
          return cb(error);
        }, _error);
    },
    response: function response(_response) {
      return []
        .concat(_toConsumableArray(interceptors.response))
        .reduce(function(response, cb) {
          return cb(response);
        }, _response);
    },
    addErrorInterceptor: function addErrorInterceptor(cb) {
      interceptors.error.add(cb);
      return function() {
        return interceptors.error.delete(cb);
      };
    },
    addRequestInterceptor: function addRequestInterceptor(cb) {
      interceptors.request.add(cb);
      return function() {
        return interceptors.request.delete(cb);
      };
    },
    addResponseInterceptor: function addResponseInterceptor(cb) {
      interceptors.response.add(cb);
      return function() {
        return interceptors.response.delete(cb);
      };
    },
  };
};
