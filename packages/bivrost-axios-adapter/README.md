# Bivrost axios adapter

[![Build Status](https://api.travis-ci.org/tuchk4/bivrost-axios-adapter.svg?branch=master)](https://travis-ci.org/tuchk4/bivrost-axios-adapter)
[![NPM Version](https://img.shields.io/npm/v/bivrost-axios-adapter.svg)](https://npmjs.org/package/bivrost-axios-adapter)

Bivrost Adapter for [axios](https://github.com/mzabriskie/axios) function.

```
npm i --save axios bivrost-axios-adapter
```

### Usage

With [Bivrost](https://github.com/tuchk4/bivrost):

```js
import DataSource from 'bivrost/data/source';
import bivrostApi from 'bivrost/http/api'
import axiosAdapter from 'bivrost-axios-adapter';

const api = bivrostApi({
  host: 'localhost',
  adapter: axiosAdapter()
});

class UsersDataSource extends DataSource {
  static api = {
    loadAll: api('GET /users')    
  }

  loadUsers(filters) {
    return this.invoke('loadAll', filters);
  }
}
```

Direct calls:

```js
import axiosAdapter from 'bivrost-axios-adapter';

const api = axiosAdapter({});

const options = {
  method: 'GET',
  query: {
    groupId: 10
  },
  headers: {
    'Content-Type': 'application/json'
  }
};

api('/users', options)
  .then(data => {
    // ...
  })
  .catch(response => {
    // ...
  });
```

### Adapter options

```js
import axiosAdapter from 'bivrost-axios-adapter';

const api = axiosAdapter({
  // default options for each request with created adapter
  options: {
    withCredentials: false,
    xsrfCookieName: 'XSRF-TOKEN'
  }
});
```

Available options:

  - transformRequest - allows changes to the request data before it is sent to the server
  - transformResponse - allows changes to the response data to be made before
  - headers - are custom headers to be sent
  - paramsSerializer - is an optional function in charge of serializing `params`
  - timeout - specifies the number of milliseconds before the request times out
  - withCredentials - indicates whether or not cross-site Access-Control requests
  - auth - indicates that HTTP Basic auth should be used, and supplies credentials
  - responseType - indicates the type of data that the server will respond with
  - xsrfCookieName - is the name of the cookie to use as a value for xsrf token
  - xsrfHeaderName - is the name of the http header that carries the xsrf token value

More details - https://www.npmjs.com/package/axios#request-api

### Interceptors

The main difference between axios-adapter interceptors and axios interceptorsis - is that interceptors could be specified for each
adpater separately.

```js
import axiosAdapter from 'bivrost-axios-adapter';

const api = axiosAdapter({
  interceptors: {
    request: request => {
      // ...
    },

    response: response=> {
      // ...
    },

    error: response => {
      // ...
    },    
  }
});
```

Interceptor example:

```js
import axiosAdapter from 'bivrost-axios-adapter';

const api = axiosAdapter({
  interceptors: {
    response: httpResponse => httpResponse.data,
    error: httpErrorResponse => Promise.reject(httpErrorResponse)
  }
});
```

----

[Bivrost](https://github.com/tuchk4/bivrost) allows to organize a simple interface to asyncronous APIs.

#### Other adapters

  * [Fetch adapter](https://github.com/tuchk4/bivrost-fetch-adapter)
  * [Axios adapter](https://github.com/tuchk4/bivrost-axios-adapter)
  * [Delay adapter](https://github.com/tuchk4/bivrost-delay-adapter)
  * [Local storage adapter](https://github.com/tuchk4/bivrost-local-storage-adapter)
  * [Save blob adapter adapter](https://github.com/tuchk4/bivrost-save-blob-adapter)
