# Data source methods

### <a id='constructor'></a>[`constructor(options: object, steps: array | null)`](#constructor)

#### Arguments

1. `options` (*Object*): A plain object that could be used for some configurations. At created instance will be at `options` attribute.
2. `steps` (*Array*) <small>not required</small>: invoke steps configuration. Default steps are [*preapre*, *api*, *process*]. Also could be configured with data source's static property `steps`.

## Data Source static properties

- [`cache: object`](#static-cache)
- [`steps: array`](#static-steps)

### <a id='static-cache'></a>[`static cache: object`](#static-cache)
 
Cache invoke function result. By default cache is disabled. Cache should be configured for each invoke method according the following structure:

1. `enabled: boolean` - enable / disable cache for method
2. `isGlobal: boolean` - enable / disabled global method cache. If *true* - method's cache storage will be same for each data source instance.
3. `ttl: number` - cache lifetime in miliseconds. Default `ttl` value is 60 min.

#### Example
```js
static cache = {
  repositories: {
    enable: true,
    isGlobal: true,
    ttl: 60 * 60 * 1000
  }
}
```

Available cache methods [`getCacheKey()`](#getCacheKey) and [`clearCache()`](#clearCache).

### <a id='static-steps'></a>[`static steps: array`](#static-steps)

Invoke steps sequence configuration. Default steps are:

- `prepare` - used for request data transformation and serialization
- `api` - xhr api call
- `process` - process the response

#### Example 
```js
static steps = ['prepare', 'api', 'immutable'];
```

### Data Source Methods

- [`invoke(method: string, params: object)`](#invoke)
- [`clearCache(method: string | null)`](#clearCache)
- [`getCacheKey(method: string, params: object)`](#getCacheKey)
- [`enableDebugLogs()`](#enableDebugLogs)
- [`disableDebugLogs()`](#disableDebugLogs)
 
### <a id='invoke'></a>[`invoke(method: string, params: object)`](#invoke)

Invoke steps sequence.

#### Arguments
1. `method` (*String*): method that should be invoked.
1. `params` (*Object*): arguments for first steps. 

### <a id='clearCache'></a>[`clearCache(method: string | null)`](#clearCache)

Clear method or data source cache.
 
#### Arguments
1. `method` (*String*) <small>not required</small>:  If `method` argument is not specified - clear all data source cache otherwise - clear only `method` cache.  NOTE: if there is any global caches - they also will be cleared.

### <a id='getCacheKey'></a>[`getCacheKey(method: string, params: object)`](#getCacheKey)

This method will be called automatically before invoke chain execution.

#### Arguments
1. `method` (*String*): executed method with [`invoke`](#invoke) function.
2. `params` (*Object*): [`invoke`](#invoke) params.
 
#### Returns
(*String*): cache key for current invoke.

#### Default implementation
```js
getCacheKey(method, params) {
  return JSON.stringify(params);
}
```

### <a id='enableDebugLogs'></a>[`enableDebugLogs()`](#enableDebugLogs)

Enable data source logs. Will log steps that will be called for invoked method and input params. 

#### Log example
```js
invoke "repoistories" at "GithubDataSource"

input arguments: {
  user: tuchk4
}

defined steps:
- api
- immutable
```

>##### Note

>Maybe will be useful to log input arguments and result of each invoke step? And maybe timing? If you have some ideas - join to already created issue.


### <a id='disableDebugLogs'></a>[`disableDebugLogs()`](#disableDebugLogs)
Disable data source logs.
