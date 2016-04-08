import promiseCache from './promise-cache';
import Cache from './cache';

const DEFAULT_STEPS = ['prepare', 'input', 'api', 'output', 'process'];
const DEFAULT_METHOD_CACHE_CONFIG = {
  isGlobal: false,
  enabled: false,
  ttl: 60000
};

const isFunction = func => func && ({}).toString.call(func) === '[object Function]';

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

    this[_steps] = this.constructor.steps || steps;
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
        console.groupCollapsed(`Bivrost invoke "${method}" at "${this.constructor.name}"`);
        console.log(`input arguments:`, params);
      }

      for (let stepId of this[_steps]) {
        let step = null;

        if (isFunction(stepId)) {
          step = stepId;
        } else {
          const stepConfig = this.constructor[stepId] || {};
          const isStepExists = stepConfig.hasOwnProperty(method);

          if (isStepExists) {
            step = stepConfig[method];
          } else {
            step = proxy;
          }
        }

        if (step) {
          if (this.debug) {
            console.log(`- ${stepId}`);
          }

          stepsPromise = stepsPromise.then(input => {
            return step(input, params);
          });
        }
      }

      if (this.debug) {
        console.groupEnd();
      }

      return stepsPromise;
    };

    let cache = this.getCache(method);

    if (!cache) {
      return fn(params);
    } else {
      let key = this.getCacheKey(method, params);
      return promiseCache(cache, key, () => fn(params));
    }
  }

  getCacheKey(method, params) {
    return JSON.stringify(params);
  }
}
