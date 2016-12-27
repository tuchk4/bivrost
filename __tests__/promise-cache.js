import promiseCache from '../src/utils/promise-cache';
import promiseDedup from '../src/utils/promise-deduplicator';

import Cache from '../src/data/cache';

describe('Promise cache', () => {
  const promiseCreator = jest.fn(() => {
    return Promise.resolve('Odin');
  });

  it('should cached result as Promise', done => {
    const cache = new Cache();
    const key = 123;

    const firstPromise = promiseCache(cache, key, promiseCreator);

    setImmediate(() => {
      const secondPromise = promiseCache(cache, key, promiseCreator);

      Promise.all([firstPromise, secondPromise])
        .then(([firstResult, secondResult]) => {

          expect(firstResult).toEqual(secondResult);
          expect(promiseCreator.mock.calls.length).toBe(1);

        }).then(done, done);
    });
  });

  it('should work with promise deduplicator', () => {
    const cache = new Cache();
    const key = 123;

    const promiseCreator = jest.fn(() => {
      return Promise.resolve('Odin');
    });

    const dedupPromise = promiseDedup(key, promiseCreator);

    const firstPromise = promiseCache(cache, key, () => dedupPromise);
    const secondPromise = promiseCache(cache, key, () => dedupPromise);

    return Promise.all([firstPromise, secondPromise])
      .then(([firstResult, secondResult]) => {

        expect(firstResult).toEqual(secondResult);
        expect(promiseCreator.mock.calls.length).toBe(1);

      });
  });
});
