# Data source

A DataSource - is a group of several API methods and its configuration. Every method call passes with the configured steps. Result of each step will be passed as arguments to the next step and whole steps chain will be cached if cache is enabled.

A DataSource provide methods for:

* steps configuration
* steps executing
* cache manipulations
* request deduplication

### <a id='this-gist'>

### [#](#this-gist) The gist

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

### <a id='invoke'>

### [#](#invoke) invoke(method: string, params: object, context: object)

```js
DataSource.invoke((method: string), (params: object), (context: object));
```

Now Bivrost generates [Auto Invoke Methods](/docs/recipes/auto-invoke-methods.md)

Invoke is a data source's function that execute _method_ chain and pass _params_ as initial arguments and _context_ as second.

Method's chain - sequence of steps where each step is a _function_ and its result is an argument for the next step (like lodash's flow).

_context_ - is useful when you need to pass the same object to all steps. For example - dynamic _params_ validation or step's configuration.

Steps sequence could configured as second argument to data source constructor or as property _steps_. If there is no method configuration at step - it will be skipped.

Default steps sequence:

* _prepare_ - used for request data transformation and serialization
* _api_ - api call
* _process_ - process the response

## <a id='invoke-steps'>

### [#](#invoke-steps) Invoke steps

As property:

```js
import DataSource from 'bivrost/data/source';

class AppDataSource extends DataSource {
  static steps = ['validate', 'serialize', 'api'];
}
```

As constructor arguments (All arguments are optional):

* _headers_ - additional headers
* _steps_ - step sequence
* _context_ - context object. Final context is calculated with:
  * DataSource context (passed as argument to DataSource constructor)
  * [invoke()](#invoke) context (passed as third param to invoke function)
* _options_ - any data will be saved in data source instance

```js
import DataSource from 'bivrost/data/source';

class AppDataSource extends DataSource {
  constructor() {
    super({
      options: {},
      steps: ['validate', 'serialize', 'api'],
      context: {},
      headers: {},
    });
  }
}
```

In this example - there are three steps for _invoke_ function - _validate_, _serialize_ and _api_. Steps sequence and naming - just a developer fantasy and depends on application architecture and requirements.

## <a id='step-configuration'>

### [#](#step-configuration) Step configuration

Step could be configured as _object_ or as _function_.

* If step is configured as object:

```js
class UserDataSource extends DataSource {
  static steps = ['api'];

  static api = {
    loadAll: api('GET /users'),
  };

  loadAll() {
    return invoke('loadAll');
  }
}
```

* If step is configured as function - it will be executed for all methods:

```js
class UserDataSource extends DataSource {
  static steps = ['api', 'immutable'];

  static immutable = response => Immutable.fromJSON(response);

  static api = {
    loadAll: api('GET /users'),
  };

  loadAll(params) {
    return this.invoke('loadAll', params);
  }
}
```

## <a id='cache'>

### [#](#cache) Cache

Define default cache config for all data source methods:

```js
class UserDataSource extends DataSource {
  static defaultCache = {
    enabled: true,
    isGlobal: true,
    ttl: 60000,
  };
}
```

Define cache config for specific data source method:

```js
class UserDataSource extends DataSource {
  static cache = {
    loadAll: {
      enabled: true,
      isGlobal: true,
      ttl: 60000,
    },
  };
}
```

Configuration is almost same as invoke steps. Cache options:

* _enabled: boolean_ - enable / disable cache for method
* _isGlobal: boolean_ - enable / disable global method cache. If _true_ - cache will be shared between all data source instances.
* _ttl: integer_ - cache lifetime in miliseconds

Cache methods:

* _getCacheKey(method: string, params: object)_ - Hook for cache key generating. By default cache key is `JSON.stringify(params)``

* _clearCache(method: string)_ - Clear method caches. If _method_ argument is not specified - clear all data source caches.

## <a id='debug-logs'>

### [#](#debug-logs) Debug logs

```js
const appDataSource = new AppDataSource();
appDataSource.enableDebugLogs();
appDataSource.disableDebugLogs();
```

If logs are enabled - data source will post messages to console for each step with its parameters. [bows](https://www.npmjs.com/package/bows) is used for logging and thats why `localStorage.debug = true` should be set in your console to see messages.

![Bivrost logs](http://i.imgur.com/FOC5z5e.png)
