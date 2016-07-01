
# Data sources

>##### A Note for Flux Users

>If you’re coming from Flux, there is a single important difference you need to understand. Redux doesn’t have a Dispatcher or support many stores. **Instead, there is just a single store with a single root [reducing function](../Glossary.md#reducer).** As your app grows, instead of adding stores, you split the root reducer into smaller reducers independently operating on the different parts of the state tree. You can use a helper like [`combineReducers`](combineReducers.md) to combine them. This is similar to how there is just one root component in a React app, but it is composed out of many small components.

### Data Source concepts

- method chain and invoke
- static prop configuration

### <a id='invoke'></a>[`invoke(method: string, params: object)`](#invoke) 
### <a id='invoke'></a>[`invoke(method: string, params: object)`](#invoke) 


```js
import DataSource from 'bivrost/data/source';

class AnyDataSource extends DataSource {

}
```

# Invoke

```js
DataSource.invoke(method: string, params: object) 
```

Invoke is a data source's function that execute `method`'s chain and pass `params` as initial arguments.
Method's chain - sequence of steps where each step is a `function` and its result is an argument for the next step.
Steps sequence could configured as second argument to data source constructor or as static property `steps`.

Default steps sequence:

- `prepare` - used for request data transformation and serialization
- `api` - xhr api call
- `process` - process the response

# Steps sequence configuration

As static property
```js
import DataSource from 'bivrost/data/source';

class AnyDataSource extends DataSource {
  static steps = ['validate', 'serialize', 'api'];
}
```

As constructor argument
```js
import DataSource from 'bivrost/data/source';

const STEPS = ['validate', 'serialize', 'api'];

class UserDataSource extends DataSource {
  constructor(options) {
    super(options, STEPS);
  }
}
```

There are three steps in invoke sequence in this example: *validate*, *serialize* and *api*. Steps sequence and naming - just
a developer fantasy and depends on application architecture and requirements.

# Step configuration

Method's step function is configuring as static property with same name as step. 

```js
import DataSource from 'bivrost/data/source';
import api from './api';

class UserDataSource extends DataSource {
  static steps = ['validate', 'serialize', 'api'];
  
  static validate = {
    list: params => {
      if (!params.groupId) {
        throw new Error('groupId should be specified');
      }
      
      return params;
    }
  }
  
  static serialize = {
    list: params => {
      return dropEmptyValue(params);
    }
  }
  
  static api = {
    list: api ('GET /users')
  };
  
  loadUsersList(params) {
    return this.invoke('list', params);
  }
}
```

Add another methods:

```js
import DataSource from 'bivrost/data/source';
import api from './api';

class UserDataSource extends DataSource {
  static steps = ['validate', 'serialize', 'api'];
  
  static validate = {
    list: params => {
      if (!params.group) {
        throw new Error('groupId should be specified');
      }
      
      return params;
    }
  }
  
  static serialize = {
    list: params => {
      return dropEmptyValue(params);
    }
  }
  
  static api = {
    list: api ('GET /users'),
    user: api('GET /users/:id')
  };
  
  loadUsersList(params) {
    return this.invoke('list', params);
  }
  
  loadUserById(id) {
    return this.invoke('user', {
      id
    });
  }
}
```

If there is not configuration for step - it will be skipped. At this example there are no configuration for *validate*
and *serialize* steps for **user** method.

# Step configuration as function

```js
import DataSource from 'bivrost/data/source';

class AnyDataSource extends DataSource {
  static steps = ['validate', 'serialize', 'api', 'immutable'];
  
  static immutable = response => Immutable.fromJSON(response);
  
  static api = {
    list: api ('GET /users')
  };
    
  loadUsersList(params) {
    return this.invoke('list', params);
  }
}
```

There is the additional last step configure as function. That means that this steps will be executed for each invoked 
method. In this example - *api* step result always will be immutable.


# Cache

```js
import DataSource from 'bivrost/data/source';

class AnyDataSource extends DataSource {
  static cache = {
    list: {
      enabled: true,
      isGlobal: true,
      ttl: 60000
    }
  }
}
```

Configuration is almost same as invoke steps. Cache options:
 
 - `enabled: boolean` - enable / disable cache for method
 - `isGlobal: boolean` - enable / disabled global method cache. If *true* - method's cache storage will be same for each
  data source instance.
 - `ttl: integer` - cache lifetime in miliseconds
 
 Cache methods:
 
 ### getCacheKey
 ```js
 getCacheKey(method: string, params: object)
 ```
 
 Hook for cache key generating. By default this function looks like:
 
 ```js
 getCacheKey(method, params) {
   return JSON.stringify(params);
 }
 ```
 
 ### clearCache
 
 ```js
 clearCache(method: string)
 ```
 
 Clear method caches. If `method` argument is not specified - clear all data source caches.
 
 NOTE: if there is any global caches - they also will be cleared.


# Extending

```js
import DataSource from 'bivrost/data/source';

class AppDataSource extends DataSource { 
  static steps = ['validation', 'api', 'process']; 
}

class UsersDataSources extends AppDataSource {
   static api = {
     user: api('GET /user/:id')
     list: api('GET /users/')
   }
  
   getUser(id) {
     return this.invoke('user', { 
       id
     });
   } 
  
   getList() {
     return this.invoke('list');
   }
}

class UsersDataSource extends UsersDataSource {
  static api = {
    ...super.api,
    list: api('GET /vip/users')  
  }
}


# Debug

### Debug logs
```js
const userDataSource = new AppDataSource();
userDataSource.enableDebugLogs();
```
