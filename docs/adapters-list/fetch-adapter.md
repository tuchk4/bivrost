# Fetch adapter

Adapter for browser's native fetch function. 

```
npm i --save bivrost-fetch-adapter
```

### Usage

```js

import fetchAdapter from 'bivrost-fetch-adapter';

const api = fetchAdapter();

const options = {
  verb: 'GET',
  query: {
    groupId: 10
  },
  headers: {
    'Content-Type': 'application/json'
  }
};

api('/users', options) // /users?groupId=10
  .then(json => {
    // ...
  })
  .catch(response => {
    // ...
  });
  
  
  
const options = {
  verb: 'POST',
  body: {
    name: 'kek'
  },
  headers: {
    'Content-Type': 'application/json'
  }
};

api('/user/1', options)
  .then(json => {
    // ...
  })
  .catch(response => {
    // ...
  });
```

Very useful with [bivrost data sources](https://github.com/frankland/bivrost);


### Setup default options


```js
import fetchAdapter from 'bivrost-fetch-adapter';

const api = fetchAdapter({
  // default options for each request with created adapter
  options: {
    mode: 'cors',
    redirect: 'follow'
  }
});
```

Available options:

  - headers - associated Headers object
  - referrer - referrer of the request
  - mode - cors, no-cors, same-origin
  - credentials - should cookies go with the request? omit, same-origin
  - redirect - follow, error, manual
  - integrity - subresource integrity value
  - cache - cache mode (default, reload, no-cache)

### Interceptors

```js
import fetchAdapter from 'bivrost-fetch-adapter';

const api = fetchAdapter({
  interceptors: {
    // takes Request instance as argument
    request: request => {
      // ...
    },
    
    // takes Response instance as argument
    response: response=> {
      // ...
    }
  }
});
```

  - Request instance docs - https://developer.mozilla.org/en-US/docs/Web/API/Request
  - Response instance docs - https://developer.mozilla.org/en-US/docs/Web/API/Response


    NOTE: If there is a network error or another reason why the HTTP request couldn't be fulfilled, the fetch() promise 
    will be rejected with a reference to that error.
    
    Note that the promise won't be rejected in case of HTTP 4xx or 5xx server responses. 
    The promise will be resolved just as it would be for HTTP 2xx. Inspect the response.status number within 
    the resolved callback to add conditional handling of server errors to your code.
    
Interceptor example:

```js
import fetchAdapter from 'bivrost-fetch-adapter';

const api = fetchAdapter({
  interceptors: {
    request: request => {
      request.headers.set('Content-Type', 'application/json');
    },
    
    response: response=> {
      if (response.ok) { 
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }
  }
});
```

### Fetch polyfill

Github whatwg-fetch https://github.com/github/fetch
