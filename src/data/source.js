import deepExtend from '../util/deep-extend';
import transpose from '../util/transpose';
import Cache from './cache';
import PromiseCache from './promise-cache';


function protoReduce(obj, callback, state) {
  let cur = obj;
  let lifo = [];

  do {
    lifo.push([callback, cur]);
    cur = cur.__proto__;
  } while (cur);

  for (var i = lifo.length - 1; i >= 0; i--) {
    let [callback, cur] = lifo[i];
    state = callback.call(obj, state, cur);
  }

  return state;
}

function mergeConfigs(methodName, obj, deep) {
  function add(state, obj) {
    if(obj.hasOwnProperty(methodName)) {
      let currentConf = obj[methodName].call(this);
      if(deep) {
        return deepExtend(state, currentConf);
      } else {
        return Object.assign({}, state, currentConf);
      }
    }
    return state;
  }
  return protoReduce(obj, add, {});
}

function makeCache(commonOptions, methodOptions) {
  let options = Object.assign({}, commonOptions || {}, methodOptions || {});
  let enabled = !!options.enabled;
  let isGlobal = !!options.isGlobal;
  delete options.enabled;
  delete options.isGlobal;
  return {options, enabled, isGlobal};
}

function buildCaches(constructor, properties, methodProperties) {
  let caches = {};
  let commonOptions = properties.cache;
  Object.keys(methodProperties).forEach(key => {
    let methodOptions = methodProperties[key].cache;
    let cacheConf = makeCache(commonOptions, methodOptions);
    if(cacheConf.enabled) {
      if(cacheConf.isGlobal) {
        if(!constructor.caches[key]) {
          constructor.caches[key] = new Cache(cacheConf.options);
        }
        caches[key] = constructor.caches[key];
      } else {
        caches[key] = new Cache(cacheConf.options);
      }
    }
  });

  return caches;
}


export default class DataSource {
  constructor(options={}) {
    this.options = options;

    this.properties = mergeConfigs('properties', this, false);
    this.methodProperties = transpose(mergeConfigs('methodProperties', this, true));

    var constructor = this.constructor;
    if(!constructor.caches) {
      constructor.caches = {};
    }
    this.caches = buildCaches(this.constructor, this.properties, this.methodProperties);
  }

  properties() {
    return {
      cache: {
        enabled: false,
      },
    };
  }

  invokeMethod(methodName, params) {
    params = this.runStep(methodName, 'inputType', params);

    let func = (params) => {
      return Promise.resolve(this.runStep(methodName, 'prepare', params))
        .then(this.runStep.bind(this, methodName, 'serialize'))
        .then(this.runStep.bind(this, methodName, 'api'))
        .then(this.runStep.bind(this, methodName, 'unserialize', params))
        .then(this.runStep.bind(this, methodName, 'process', params))
        .then(this.runStep.bind(this, methodName, 'outputType'));
    };

    var prepared = this.runStep(methodName, 'prepare', params);
    return this.invokeCached(methodName, func, prepared);
  }

  runStep(methodName, stepName, ...args) {
    let inout = args.slice();
    inout.reverse();
    var f = this.getMethodProperty(methodName, stepName);
    return f ? f.apply(this, inout) : inout[0];
  }

  invokeCached(methodName, fn, params) {
    var cache = this.caches[methodName];
    if(!cache) {
      return fn(params);
    }
    var key = this.getCacheKey(methodName, params);
    return PromiseCache(cache, key, ()=>fn(params));
  }

  getCacheKey(method, params) {
    let methodGetCacheKey = this.getMethodProperty(method, 'getCacheKey');
    if(methodGetCacheKey) {
      return methodGetCacheKey.call(this, method, params);
    }
    return JSON.stringify(params);
  }

  getProperty(key) {
    return this.properties[key];
  }

  getMethodProperty(method, key) {
    let methodProperties = this.methodProperties[method];
    if(!methodProperties) {
      return undefined;
    }
    return methodProperties[key];
  }

  clearCache(methodName) {
    let cache = this.caches(methodName);
    if(cache) {
      cache.clear();
    }
  }

  clearAllCaches() {
    Object.keys(this.caches).forEach((methodName) => {
      this.caches[methodName].clear();
    });
  }
}
