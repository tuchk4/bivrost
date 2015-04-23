import t from 'tcomb';
import PromiseCache from './promise-cache';
import BatchLoader from './batch-loader';

var DefaultParamsModel = t.Any;

export default class DataSource {
  constructor({api}={}) {
    this.api = this.createApiResource(api);
  }

  get idField() {
    return 'id';
  }

  get idFieldPlurals() {
    return 'ids';
  }

  get cacheTtl() {
    return 60000;
  }

  get createApiResource() {
    abstract();
  }

  get model() {
    abstract();
  }

  get paramsModelGet() {
    return DefaultParamsModel;
  }

  get paramsModelGetList() {
    return DefaultParamsModel;
  }

  get getListEncode() {
    return pass;
  }

  get getListDecode() {
    return pass;
  }

  get getItemEncode() {
    return pass;
  }

  get getItemDecode() {
    return pass;
  }

  get batchLoader() {
    return this._batchLoader || (this._batchLoader = this.createBatchLoader());
  }

  createBatchLoader() {
    return new BatchLoader({
      idField: this.idField,
      idFieldPlurals: this.idFieldPlurals,
      getList: this.getList.bind(this),
      cacheKey: this.cacheKey.bind(this),
      cache: this.constructor.cache,
    });
  }

  /**
   * Get a list of items
   * Uses `list()` API method
   */
  getList(params = {}) {
    var ParamsModel = this.paramsModelGetList;
    var typedParams = ParamsModel(params);
    var request = this.getListEncode(typedParams);
    return this.cached(
      'getList',
      typedParams,

      () => this.callApi('list', request)
        .then((raw)=>this.getListDecode(raw, typedParams))
        .then(this.assertArray.bind(this))
        .then(this.toModelList.bind(this))
    )
  }

  /**
   * Get a single item.
   * Uses `item()` API method
   */
  get(params = {}) {
    var ParamsModel = this.paramsModelGet;
    var typedParams = ParamsModel(params);
    var request = this.getItemEncode(typedParams);
    return this.cached(
      'get',
      typedParams,

      () => this.callApi('item', request)
        .then((raw)=>this.getItemDecode(raw, typedParams))
        .then(this.toModel.bind(this))
    )
  }

  /**
   * Shortcut method for getting single item using `get()` by its ID
   */
  getById(id) {
    return this.get({
      [this.idField]: id
    });
  }

  resolveLinkedItems(items) {
    //TODO
  }

  assertArray(data) {
    if (!t.Arr.is(data)) {
      throw new TypeError('Array expected');
    }
    return data;
  }

  toModelList(rawList) {
    return rawList.map((rawItem) => this.toModel(rawItem));
  }

  toModel(rawItem) {
    return this.model(rawItem);
  }

  cached(staticKey, dynamicKey, fn) {
    var key = this.cacheKey(staticKey, dynamicKey);
    return PromiseCache(this.constructor.cache, key, this.cacheTtl, fn);
  }

  cacheKey(staticKey, dynamicKey) {
    return `${ staticKey }.${ JSON.stringify(dynamicKey) }`;
  }

  getSerializer(method) {
    return null;
  }

  callApi(method, params) {
    var serializedParams;
    var serializer = this.getSerializer(method);
    if(serializer) {
      serializedParams = serializer.serialize(params);
    } else {
      serializedParams = params;
    }
    return this.api[method](serializedParams);
  }

  get cache() {
    return this.constructor.cache;
  }

  static get cache() {
    abstract();
  }
}


function pass(data) {
  return data;
}

function abstract(data) {
  throw new Error('abstract method');
}
