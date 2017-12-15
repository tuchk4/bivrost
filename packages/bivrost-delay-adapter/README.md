# Bivrost delay adapter

Bivrost adapter enchantment to add request/respone delays for UI tests

```
yarn add bivrost-delay-adapter
```

### Usage

```js
import DataSource from 'bivrost/data/source';
import axiosAdapter from 'bivrost-axios-adapter';
import delayAdapter from 'bivrost-delay-adapter';

const delayedAxios = delayAdapter(axiosAdapter(), {
  request: 1000, // add 1sec delay before request
  response: 1000 // add 1sec delay after response
  error: 1000 // add 1sec delay after response with error
});

const api = bivrostApi({
  host: 'localhost',
  adapter: delayedAxios()
});

class UsersDataSource extends DataSource {
  static api = {
    loadAll: api('GET /users')
  }

  loadUsers(filters) {
    return this.invoke('loadAll', filters);
  }
}

const usersDataSource = new UsersDataSource();

// Will load users with 1sec delay before request and 1sec delay after response
usersDataSource.loadUsers().then(() => {
  console.log('done');
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
