import promiseCache from '../utils/promise-cache';
import Cache from './cache';

const DEFAULT_STEPS = ['prepare', 'api', 'process'];
const DEFAULT_METHOD_CACHE_CONFIG = {
  isGlobal: false,
  enabled: false,
  ttl: 60000,
};

const isFunction = func =>
  func && {}.toString.call(func) === '[object Function]';

const getMethodCacheName = (instance, method) =>
  `${instance.constructor.uid}@${method}`;

const buildCaches = instance => {
  const caches = new Map();
  const cacheConfig = instance.constructor.cache || {};
  const defaultCacheConfig = {
    ...DEFAULT_METHOD_CACHE_CONFIG,
    ...instance.constructor.defaultCache,
  };

  for (let method of Object.keys(cacheConfig)) {
    const config = {
      ...defaultCacheConfig,
      ...cacheConfig[method],
    };

    let cache = null;
    const cacheMehtodName = getMethodCacheName(instance, method);

    if (config.enabled) {
      if (config.isGlobal) {
        if (!instance.constructor.caches.hasOwnProperty(cacheMehtodName)) {
          instance.constructor.caches[cacheMehtodName] = new Cache(config);
        }
        cache = instance.constructor.caches[cacheMehtodName];
      } else {
        cache = new Cache(config);
      }

      caches.set(cacheMehtodName, cache);
    }
  }

  return caches;
};

const _steps = Symbol('steps');
const _caches = Symbol('caches');
const _debugLogs = Symbol('debug logs');

let uid = 1;

export default class Source {
  static caches = [];

  constructor(options, steps = DEFAULT_STEPS) {
    if (!this.constructor.uid) {
      this.constructor.uid = uid++;
    }

    this.options = options;

    this[_steps] = this.constructor.steps || steps;
    this[_caches] = buildCaches(this);
  }

  getSteps() {
    return this[_steps];
  }

  enableDebugLogs() {
    this[_debugLogs] = true;
  }

  disableDebugLogs() {
    this[_debugLogs] = false;
  }

  getCache(method) {
    const cacheMehtodName = getMethodCacheName(this, method);
    return this[_caches].get(cacheMehtodName);
  }

  invoke(method, params) {
    const proxy = input => Promise.resolve(input);
    let log = null;

    if (this[_debugLogs]) {
      log = (...args) => {
        console.log('Bivrost --> ', ...args);
      };

      log('call argumengts', params);
    }

    const fn = params => {
      let stepsPromise = Promise.resolve(params);

      for (let stepId of this[_steps]) {
        let step = null;

        if (isFunction(stepId)) {
          step = stepId;
        } else {
          const stepConfig = this.constructor[stepId] || {};
          step = isFunction(stepConfig) ? stepConfig : stepConfig[method];

          if (!step) {
            continue;
          }
        }

        stepsPromise = stepsPromise.then(input => {
          if (log && step != proxy) {
            log(`"${stepId}" call`, input);
          }

          return Promise.resolve(null)
            .then(() => step(input, params))
            .then(output => {
              if (log && step != proxy) {
                log(`"${stepId}" response`, output);
              }

              return output;
            })
            .catch(error => {
              if (log && step != proxy) {
                log(`"${stepId}" error`, error);
              }

              return Promise.reject(error);
            });
        });
      }

      return stepsPromise;
    };

    let cache = this.getCache(method);
    if (!cache) {
      return fn(params);
    } else {
      const key = this.getCacheKey(method, params);

      if (log) {
        if (cache.has(key)) {
          log(`get from cache by key "${key}"`);
        } else {
          log('cache miss');
        }
      }

      return promiseCache(cache, key, () => fn(params));
    }
  }

  getCacheKey(method, params = {}) {
    return JSON.stringify(params);
  }

  clearCache(method, params) {
    let cacheKey = null;
    if (params) {
      cacheKey = this.getCacheKey(method, params);
    }

    let caches = method ? [this.getCache(method)] : this[_caches].values();

    if (this[_debugLogs]) {
      if (cacheKey) {
        console.log(`Bivrost ---> clear cache for "${method}@${cacheKey}"`);
      } else {
        console.log(`Bivrost ---> clear all "${method}" caches`);
      }
    }

    for (let cache of caches) {
      if (cache) {
        cache.clear(cacheKey);
      }
    }
  }
}
