# Bivrost localStorage adapter

```
npm i --save bivrost-local-storage-adapter
```

## Usage

With [Bivrost](https://github.com/tuchk4/bivrost):

```js
import DataSource from 'bivrost/data/source';
import bivrostApi from 'bivrost/http/api';
import localStorageAdapter from 'bivrost-local-storage-adapter';

const api = bivrostApi({
  adapter: localStorageAdapter({
    namespace: 'my-application',
  }),
});

class UsersDataSource extends DataSource {
  steps = ['api'];

  api = {
    loadAll: api('GET /users'),
    create: api('POST /users'),
  };

  loadUsers() {
    return this.invoke('loadAll');
  }

  createUser(user) {
    return this.invoke('create', user);
  }
}
```

Direct calls:

```js
import localStorageAdapter from 'bivrost-local-storage-adapter';

const localStorageAdapter = localStorageAdapter({
  namespace: 'my-application',
});

localStorageAdapter('/users/1', {
  method: 'POST',
  body: {
    name: 'John Doe',
  },
}).then(() => console.log('saved to localStorage'));

localStorageAdapter('/users/1', {
  method: 'GET',
}).then(user => {
  expect(user).toEqual({
    name: 'John Doe',
  });
});
```

---

[Bivrost](https://github.com/tuchk4/bivrost) allows to organize a simple
interface to asyncronous APIs.

#### Other adapters

* [Fetch Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-fetch-adapter)
* [Axios Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-axios-adapter)
* [Delay Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-delay-adapter)
* [LocalStorage Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-local-storage-adapter)
* [Save Blob Adapter Adapter](https://github.com/tuchk4/bivrost/tree/master/packages/bivrost-save-blob-adapter)
