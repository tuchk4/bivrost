import Cache from './cache';
var cache = new Cache();

/**
 * If the promise with given `key` is still running, it is returned instead of creating new one.
 * Useful for HTTP request deduplication.
 *
 * var promise1 = PromiseDeduplicator('http://example.com/', http.get.bind(http, 'http://example.com/'))
 * var promise2 = PromiseDeduplicator('http://example.com/', http.get.bind(http, 'http://example.com/'))
 * promise1 === promise2;
 */


export default function PromiseDeduplicator(key, fnCreatePromise, ttl=0) {
  var cached = cache.get(key);
  if (!cached) {
    var promise = fnCreatePromise().then(
      (result) => {
        return result;
      }, (error) => {
        return Promise.reject(error);
      }
    );
    cache.put(key, promise, ttl);
    return promise;
  } else {
    return cached;
  }
}
