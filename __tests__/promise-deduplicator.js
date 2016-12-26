import promiseDedup from '../src/utils/promise-deduplicator';

describe('Promise deduplicator', () => {
  const key1 = 123;
  const key2 = 456;

  const promiseCreator = () => {
    return Promise.resolve();
  };

  it('dedup promises with same kay should be cached', () => {
    const dedupPromise1 = promiseDedup(key1, promiseCreator);
    const dedupPromise2 = promiseDedup(key1, promiseCreator);

    expect(dedupPromise1).toBe(dedupPromise2);
  });

  it('dedup promises wiht different keys should de different', () => {
    const dedupPromise1 = promiseDedup(key1, promiseCreator);
    const dedupPromise2 = promiseDedup(key2, promiseCreator);

    expect(dedupPromise1).not.toBe(dedupPromise2);
  });
});
