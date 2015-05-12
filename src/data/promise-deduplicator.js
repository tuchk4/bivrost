import Cache from './cache';
// var cache = new Cache();
var map = new Map();

/**
 * If the promise with given `key` is still running, it is returned instead of creating new one.
 * Useful for HTTP request deduplication.
 *
 * var promise1 = PromiseDeduplicator('http://example.com/', http.get.bind(http, 'http://example.com/'))
 * var promise2 = PromiseDeduplicator('http://example.com/', http.get.bind(http, 'http://example.com/'))
 * promise1 === promise2;
 */


export default function PromiseDeduplicator(key, fnCreatePromise) {
  var cached = map.get(key);
  if (!cached) {
    var promise = fnCreatePromise().then(
      (result) => {
        map.delete(key);
        return result;
      }, (error) => {
        map.delete(key);
        return Promise.reject(error);
      }
    );
    map.set(key, promise);
    return promise;
  } else {
    return cached;
  }
}
