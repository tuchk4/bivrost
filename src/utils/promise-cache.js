export default function promiseCache(cache, key, fn, ttl) {
  return new Promise((resolve, reject) => {
    const previouslyCached = cache.get(key);

    if (null !== previouslyCached) {
      resolve(previouslyCached);
      return;
    }

    fn().then((result) => {
      cache.put(key, result, ttl);
      resolve(result);
    }, (err) => {
      reject(err);
    });
  });
}
