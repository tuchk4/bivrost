# Data source

A DataSource - is a group of several API methods and its configuration. Every method call passes with the configured steps. Result of each step will be passed as arguments to the next step and whole steps chain will be cached if cache is enabled.

A DataSource provide methods for:

* steps configuration
* steps executing
* cache manipulations
* request deduplication


### <a id='this-gist'></a>[#](#this-gist) The gist

```js
import DataSource from 'bivrost/data/source';
import bivrostApi from 'bivrost/http/api'
import fetchAdapter from 'bivrost-fetch-adapter';

import { Record } from 'immutable';

const api = bivrostApi({
  host: 'localhost',
  adapter: fetchAdapter()
});

const User = Record({
  id: null,
  name: ''
});

class UsersDataSource extends DataSource {
  static steps = ['validate', 'api', 'model'];

  static cache = {
    loadAll: {
      enabled: true,
      isGlobal: true,
      ttl: 60000
    }
  };

  static validate = {
    update: ({ id }) => {
        if (!id) {
          throw new Error('"ID" field is required for user update');
        }
    }
  }

  static api = {
    loadAll: api('GET /users')
    update: api('PUT /user/:id')
  }

  static model = {
    update: User
  }

  update(user) {
    return this.invoke('update', user);
  }

  loadAll(filters) {
    return this.invoke('loadAll', filters);
  }
}

usersDataSource.loadAll({});

// if previous loadAll call IS NOT finished:
//  - will not trigger step chain because of deduplication
usersDataSource.loadAll({});

// if previous loadAll call IS finished - will not trigger step chain.
//  - will not trigger step chain because of enabled cache
usersDataSource.loadAll({});
```



### <a id='invoke'></a>[#](#invoke) invoke(method: string, params: object)

```js
DataSource.invoke(method: string, params: object)
```

Invoke is a data source's function that execute *method* chain and pass *params* as initial arguments.
Method's chain - sequence of steps where each step is a *function* and its result is an argument for the next step.
Steps sequence could configured as second argument to data source constructor or as property *steps*.
If there is no method configuration at step - it will be skipped.

Default steps sequence:

- *prepare* - used for request data transformation and serialization
- *api* - api call
- *process* - process the response

## <a id='invoke-steps'></a>[#](#invoke-steps) Invoke steps

As property:

```js
import DataSource from 'bivrost/data/source';

class AppDataSource extends DataSource {
  steps = ['validate', 'serialize', 'api'];
}
```

As constructor argument:

```js
import DataSource from 'bivrost/data/source';

const STEPS = ['validate', 'serialize', 'api'];

class AppDataSource extends DataSource {
  constructor(options) {
    super(options, STEPS);
  }
}
```

In this example - there are three steps for *invoke* function - *validate*, *serialize* and *api*. Steps sequence and naming - just a developer fantasy and depends on application architecture and requirements.

## <a id='step-configuration'></a>[#](#step-configuration) Step configuration

Step could be configured as *object* or as *function*.

* If step is configured as object:

```js
class UserDataSource extends DataSource {
  static steps = ['api'];

  static api = {
    loadAll: api('GET /users')
  }

  loadAll() {
    return invoke('loadAll')
  }
}
```

* If step is configured as function - it will be executed for all methods:

```js
class UserDataSource extends DataSource {
  static steps = ['api', 'immutable'];

  static immutable = response => Immutable.fromJSON(response);

  static api = {
    loadAll: api ('GET /users')
  };

  loadAll(params) {
    return this.invoke('loadAll', params);
  }
}
```

## <a id='cache'></a>[#](#cache) Cache

```js
class UserDataSource extends DataSource {
  static cache = {
    loadAll: {
      enabled: true,
      isGlobal: true,
      ttl: 60000
    }
  };
}
```

Configuration is almost same as invoke steps. Cache options:

* *enabled: boolean* - enable / disable cache for method
* *isGlobal: boolean* - enable / disable global method cache. If *true* - cache will be shared between all data source instances.
* *ttl: integer* - cache lifetime in miliseconds

Cache methods:

* *getCacheKey(method: string, params: object)* - Hook for cache key generating. By default cache key is `JSON.stringify(params)``

* *clearCache(method: string)* - Clear method caches. If *method* argument is not specified - clear all data source caches.

## <a id='debug-logs'></a>[#](#debug-logs) Debug logs

```js
const appDataSource = new AppDataSource();
appDataSource.enableDebugLogs();
appDataSource.disableDebugLogs();
```

If logs are enabled - data source will post messages to console for each step with its parameters.
[bows](https://www.npmjs.com/package/bows) is used for logging and thats why `localStorage.debug = true` should be set in your console to see messages.

![Bivrost logs](http://i.imgur.com/FOC5z5e.png)
