export default class BatchLoader {
  constructor({idField = 'id', idFieldPlurals = 'ids', cache, cacheKey, getList}) {
    this._idFieldPlurals = idFieldPlurals;
    this._idField = idField;
    this._cache = cache;
    this._cacheKey = cacheKey;
    this._getList = getList;
  }

  load(ids) {
    let { cachedItems, restIds } = this._getCachedItems(ids);
    return this._load(restIds)
      .then(this._mergeResults.bind(this, cachedItems));
  }

  _load(ids) {
    if (!ids.length) {
      return Promise.resolve([]);
    }
    return this._getList({
      [this._idFieldPlurals]: ids
    })
      .then(this._storeItemsInCache.bind(this));
  }

  _cacheGet(id) {
    return this._cache.get(this._cacheKey('get', {
      [this._idField]: id
    }));
  }

  _cachePut(id, value) {
    this._cache.put(this._cacheKey('get', {
      [this._idField]: id
    }), value);
  }

  _getCachedItems(ids) {
    return ids.reduce((results, id)=> {
      let item = this._cacheGet(id);
      if (item !== null) {
        results.cachedItems.push(item);
      } else {
        results.restIds.push(id);
      }
      return results;
    }, {
      restIds: [],
      cachedItems: [],
    });
  }

  _mergeResults(cachedItems, loadedItems) {
    let idField = this._idField;
    return cachedItems.concat(loadedItems).reduce((hash, item) => {
      hash[item[idField]] = item;
      return hash;
    }, {});
  }

  _storeItemsInCache(items) {
    let idField = this._idField;
    items.forEach((item)=>this._cachePut(item[idField], item));
    return items;
  }
}
