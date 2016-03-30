import promiseCache from './promise-cache';
import Cache from './cache';

const DEFAULT_STEPS = ['prepare', 'input', 'api', 'output', 'process'];
const DEFAULT_METHOD_CACHE_CONFIG = {
  isGlobal: false,
  enabled: false,
  ttl: 60000
};

const buildCaches = constructor => {
  const caches = new Map();
  const cacheConfig = constructor.cache || {};

  for (let method of Object.keys(cacheConfig)) {
    const config = {
      ...DEFAULT_METHOD_CACHE_CONFIG,
      ...cacheConfig[method]
    };

    let cache = null;

    if (config.enabled) {
      if (config.isGlobal) {
        if (!constructor.caches.hasOwnProperty(method)) {
          constructor.caches[method] = new Cache(config);
        }
        cache = constructor.caches[method];
      } else {
        cache = new Cache(config);
      }

      caches.set(method, cache);
    }
  }

  return caches;
};

const _steps = Symbol('steps');
const _caches = Symbol('caches');

export default class Source {
  static caches = [];

  debug = false;

  constructor(options, steps = DEFAULT_STEPS) {
    this.options = options;

    this[_steps] = steps;
    this[_caches] = buildCaches(this.constructor);
  }

  enableDebug() {
    this.debug = true;
  }

  disableDebug() {
    this.debug = false;
  }

  getCache(method) {
    return this[_caches].get(method);
  }

  invoke(method, params) {
    const proxy = input => input;

    const fn = params => {
      let stepsPromise = Promise.resolve(params);

      if (this.debug) {
        console.log(`invoke method "${method}"`, params);
      }

      for (let stepId of this[_steps]) {
        const stepConfig = this.constructor[stepId] || {};
        const isStepExists = stepConfig.hasOwnProperty(method);

        let step = proxy;

        if (isStepExists) {
          if (this.debug) {
            console.log(`- ${stepId}`);
          }

          step = stepConfig[method];

          stepsPromise = stepsPromise.then(input => {
            if (this.debug) {
              console.log(`invoke step "${stepId}"`, input);
            }

            return step(input, params)
          });
        }
      }

      return stepsPromise;
    };


    var cache = this.getCache(method);

    if (!cache) {
      return fn(params);
    } else {
      var key = this.getCacheKey(method, params);
      return promiseCache(cache, key, () => fn(params));
    }
  }

  getCacheKey(method, params) {
    return JSON.stringify(params);
  }
}
