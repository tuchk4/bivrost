# Bivrost localStorage adapter

```
npm i --save bivrost-local-storage-adapter
```

## Usage

With [Bivrost](https://github.com/tuchk4/bivrost):

```js
import DataSource from 'bivrost/data/source';
import bivrostApi from 'bivrost/http/api'
import localStorageAdapter from 'bivrost-local-storage-adapter';

const api = bivrostApi({
  adapter: localStorageAdapter({
    namespace: 'my-application'
  })
})

class UsersDataSource extends DataSource {
  steps = ['api'];

  api = {
    loadAll: api('GET /users'),
    create: api('POST /users')
  }

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
  namespace: 'my-application'
});

localStorageAdapter('/users/1', {
  method: 'POST',
  body: {
    name: 'John Doe'
  }
}).then(() => console.log('saved to localStorage'));


localStorageAdapter('/users/1', {
  method: 'GET'
}).then(user => {

  expect(user).toEqual({
    name: 'John Doe'
  });
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
