const _idFieldPlurals = Symbol('idFieldPlurals');
const _idField = Symbol('idField');
const _cache = Symbol('cache');
const _cacheKey = Symbol('cacheKey');

const _loader = Symbol('loader');

export default class BatchLoader {
  constructor({idField = 'id', idFieldPlurals = 'ids', cache, cacheKey, loader}) {
    this[_idFieldPlurals] = idFieldPlurals;
    this[_idField] = idField;
    this[_cache] = cache;
    this[_cacheKey] = cacheKey;
    this[_loader] = loader;
  }

  load(ids) {
    if (!ids.length) {
      throw new Error('ids should be defined');
    }

    return this[_loader]({
      [this[_idFieldPlurals]]: ids
    }).then(items => {

      const { cachedItems, restIds } = this.getCachedItems(ids);

      this.storeItemsInCache(items);
      this.mergeResults(cachedItems, items);

      return this.load(restIds);
    });
  }

  cacheGet(id) {
    const key = this[_cacheKey]('get', {
      [this[_idField]]: id
    });

    return this[_cache].get(key);
  }

  cachePut(id, value) {
    const key = this[_cacheKey]('get', {
      [this[_idField]]: id
    });

    this[_cache].put(key, value);
  }

  getCachedItems(ids) {
    return ids.reduce((results, id) => {
      let item = this[_cache].get(id);

      if (item !== null) {
        results.cachedItems.push(item);
      } else {
        results.restIds.push(id);
      }

      return results;
    }, {
      restIds: [],
      cachedItems: []
    });
  }

  mergeResults(cachedItems, loadedItems) {
    let idField = this[_idField];

    return [...cachedItems, ...loadedItems].reduce((hash, item) => {
      hash[item[idField]] = item;
      return hash;
    }, {});
  }

  storeItemsInCache(items) {
    let idField = this[_idField];

    for (let item of items) {
      this[_cache].put(item[idField], item);
    }

    return items;
  }
}
