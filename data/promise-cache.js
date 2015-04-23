import t from 'tcomb';

export default function PromiseCache(cache, key, ttl, fn) {
  if (!t.Str.is(key)) {
    throw new TypeError('key');
  }
  if (!t.Num.is(ttl)) {
    throw new TypeError('ttl');
  }

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
