# Bivrost fetch adapter

Adapter for browser's native fetch function.

```
npm i --save bivrost-fetch-adapter
```

### Usage

With [Bivrost](https://github.com/tuchk4/bivrost):

```js
import DataSource from 'bivrost/data/source';
import bivrostApi from 'bivrost/http/api';
import fetchAdapter from 'bivrost-fetch-adapter';

const api = bivrostApi({
  host: 'localhost',
  adapter: fetchAdapter(),
});

class UsersDataSource extends DataSource {
  static api = {
    loadAll: api('GET /users'),
  };

  loadUsers(filters) {
    return this.invoke('loadAll', filters);
  }
}
```

Direct calls:

```js
import fetchAdapter from 'bivrost-fetch-adapter';

const api = fetchAdapter();

const options = {
  method: 'GET',
  query: {
    groupId: 10,
  },
  headers: {
    'Content-Type': 'application/json',
  },
};

api('/users', options) // /users?groupId=10
  .then(json => {
    // ...
  })
  .catch(response => {
    // ...
  });

const options = {
  method: 'POST',
  body: {
    name: 'kek',
  },
  headers: {
    'Content-Type': 'application/json',
  },
};

api('/user/1', options)
  .then(json => {
    // ...
  })
  .catch(response => {
    // ...
  });
```

### Configuration

```js
import fetchAdapter from 'bivrost-fetch-adapter';

const api = fetchAdapter({
  // default options for each request with created adapter
  options: {
    mode: 'cors',
    redirect: 'follow',
  },
});
```

Available options:

* _headers_ - associated Headers object
* _referrer_ - referrer of the request
* _mode_ - cors, no-cors, same-origin
* _credentials_ - should cookies go with the request? omit, same-origin
* _redirect_ - follow, error, manual
* _integrity_ - subresource integrity value
* _cache_ - cache mode (default, reload, no-cache)

### Interceptors

```js
import fetchAdapter from 'bivrost-fetch-adapter';

const api = fetchAdapter({
  interceptors: {
    // takes Request instance as argument
    request: request => {
      // ...
    },

    error: error => {
      // ...
    },

    // takes Response instance as argument
    response: response => {
      // ...
    },
  },
});
```

* Request object documentation -
  https://developer.mozilla.org/en-US/docs/Web/API/Request
* Response object documentation -
  https://developer.mozilla.org/en-US/docs/Web/API/Response

  NOTE: If there is a network error or another reason why the HTTP request
  couldn't be fulfilled, the fetch() promise will be rejected with a reference
  to that error.

Interceptor example:

```js
import fetchAdapter from 'bivrost-fetch-adapter';

const api = fetchAdapter({
  interceptors: {
    request: request => {
      request.headers.set('Content-Type', 'application/json');
      request.headers.set('access_token', Auth.accessToken);

      return request;
    },

    error: error => Promise.reject(error);
    response: response => Promise.resolve(response)
  }
});
```

### Fetch polyfill

Github whatwg-fetch - https://github.com/github/fetch

---

[Bivrost](https://github.com/tuchk4/bivrost) allows to organize a simple
interface to asyncronous APIs.

#### Other adapters

* [Fetch Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-fetch-adapter)
* [Axios Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-axios-adapter)
* [Delay Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-delay-adapter)
* [LocalStorage Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-local-storage-adapter)
* [Save Blob Adapter Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-save-blob-adapter)
