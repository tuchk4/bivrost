# Bivrost delay adapter

```
npm i --save bivrost-delay-adapter
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

----

[Bivrost](https://github.com/tuchk4/bivrost) allows to organize a simple interface to asyncronous APIs.

#### Other adapters

  * [Fetch adapter](https://github.com/tuchk4/bivrost-fetch-adapter)
  * [Axios adapter](https://github.com/tuchk4/bivrost-axios-adapter)
  * [Delay adapter](https://github.com/tuchk4/bivrost-delay-adapter)
  * [Local storage adapter](https://github.com/tuchk4/bivrost-local-storage-adapter)
  * [Save blob adapter adapter](https://github.com/tuchk4/bivrost-save-blob-adapter)
