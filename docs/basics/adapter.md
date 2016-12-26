# Adapter

The main goal of Adapter is make some magic and return function that execute query according to passed url and Request object or enchant another Adapter.

In most cases - adapter is using to adapt api function for used approaches or libraries (fetch, axios, rxjs, local storage) and execute query.

Also adapter is using for enchanting other adapters - add additional delays for testing, log api calls, save request response as blob, filter params etc. For example there are [delayAdapter](https://github.com/tuchk4/bivrost-delay-adapter), [saveBlobAdater](https://github.com/tuchk4/bivrost-save-blob-adapter), [localStorage](https://github.com/tuchk4/bivrost-local-storage-adapter) adapter are enchanters.

## <a id='adapter-list'></a>[#](#adapter-list) Adapter list

* [Fetch adapter](https://github.com/tuchk4/bivrost-fetch-adapter)
* [Axios adapter](https://github.com/tuchk4/bivrost-axios-adapter)
* [Delay adapter](https://github.com/tuchk4/bivrost-delay-adapter)
* [Local storage adapter](https://github.com/tuchk4/bivrost-local-storage-adapter)
* [Save blob adapter adapter](https://github.com/tuchk4/bivrost-save-blob-adapter)

## <a id='under-the-hood'></a>[#](#under-the-hood) Under the hood

*api* function does not guarantee that XHR method will be called. It just call adapter with generated config. What magic will be done depends on used adapter. In case of *localStorageAdapter* - it will save and get data from [localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage).


```js
import bivrostApi from 'bivrost/http/api'
import fetchAdapter from 'bivrost-fetch-adapter';

const api = bivrostApi({
  protocol: 'http:'
  host: 'localhost:3001',
  adapter: fetchAdapter()
});

const createUser = api('POST /user?:hash&:version');

createUser({
  name: 'john_doe',
  hash: 'eecab3',
  version: 'v1.2.0'
});
```

As the result *api* function will call adapter with generated config and returns its response.

```json
{
  "method": "POST",
  "path": "/user?hash=eecab3&version=v1.2.0",
  "body": {
    "name": "John Doe"
  }
}
```

From javascript side next two example will produce same result:

* Using api function:

```js
import bivrostApi from 'bivrost/http/api'
import fetchAdapter from 'bivrost-fetch-adapter';

const api = bivrostApi({
  protocol: 'http:'
  host: 'localhost:3001',
  adapter: fetchAdapter()
});

const createUser = api('POST /user?:hash&:version');

return createUser({
  name: 'john_doe',
  hash: 'eecab3',
  version: 'v1.2.0'
});
```

* Using adapter directly:

```js
import fetchAdapter from 'bivrost-fetch-adapter';

const fetch =  fetchAdapter();

return fetch({
  method: "POST",
  path: "http://localhost:3001/user?hash=eecab3&version=v1.2.0",
  body: {
    name: "John Doe"
  }
});
```
