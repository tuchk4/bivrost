export default function PromiseCache(cache, key, fn, ttl) {
  var promise = new Promise(
    function(resolve, reject) {
      var previouslyCached = cache.get(key);

      if (null !== previouslyCached) {
        resolve(previouslyCached);
        return;
      }

      fn().then(
        (res) => {
          cache.put(key, res, ttl);
          resolve(res);
        },

        (err) => {
          reject(err);
        }
      );
    });

  return promise;
}
