import Cache from '../data/cache';

/**
 * If the promise with given `key` is still running, it is returned instead of creating new one.
 * Useful for HTTP request deduplication.
 *
 * let promise1 = PromiseDeduplicator('http://example.com/', http.get.bind(http, 'http://example.com/'))
 * let promise2 = PromiseDeduplicator('http://example.com/', http.get.bind(http, 'http://example.com/'))
 * promise1 === promise2;
 */
const cacheMap = new Map();

export default function promiseDeduplicator(key, fnCreatePromise) {
  const cached = cacheMap.get(key);

  if (!cached) {
    const promise = fnCreatePromise().then(result => {
      cacheMap.delete(key);

      return result;
    }, error => {
      cacheMap.delete(key);

      return Promise.reject(error);
    });

    cacheMap.set(key, promise);
    return promise;
  } else {
    return cached;
  }
}
