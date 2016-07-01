# Bivrost axios adapter

[![Build Status](https://api.travis-ci.org/frankland/bivrost-axios-adapter.svg?branch=master)](https://travis-ci.org/frankland/bivrost-axios-adapter)
[![NPM Version](https://img.shields.io/npm/v/bivrost-axios-adapter.svg)](https://npmjs.org/package/bivrost-axios-adapter)

Adapter for browser's native axios function. 

```
npm i --save axios bivrost-axios-adapter
```

### Usage

```js

import axios from 'axios';
import axiosAdapter from 'bivrost-axios-adapter';

const api = axiosAdapter(axios);

const options = {
  verb: 'GET',
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

Very useful with [bivrost data sources](https://github.com/frankland/bivrost);


### Default options

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
