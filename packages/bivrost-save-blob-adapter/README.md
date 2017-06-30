# Bivrost save blob adapter

```
npm i --save bivrost-save-blob-adapter
```

## Usage

With [Bivrost](https://github.com/tuchk4/bivrost):

```js
import DataSource from 'bivrost/data/source';
import bivrostApi from 'bivrost/http/api'
import axiosAdapter from 'bivrost-axios-adapter';
import saveBlobAdapter from 'bivrost-save-blob-adapter';

const api = bivrostApi({
  host: 'localhost',
  adapter: saveBlobAdapter(axiosAdapter())
});

class UsersDataSource extends DataSource {
  steps = ['api'];

  api = {
    loadAll: api('GET /users', {
      filename: 'users.json'
    })    
  }

  saveUsersJSON(filters) {
    return this.invoke('loadAll', filters);
  }
}

const usersDataSource = new UsersDataSource();

// Will save GET /users response as "users.json" file
usersDataSource.saveUsersJSON().then(() => {
  console.log('file saved');
});
```

Direct calls:

```js
import axios from 'axios';
import axiosAdapter from 'bivrost-axios-adapter';
import saveBlobAdapter from 'bivrost-save-blob-adapter';

const axiosAdapter = axiosAdapter(axios);
const saveBlob = saveBlobAdapter(axiosAdapter);

const requestOptions = {
  method: 'GET'
};

saveBlob('/report/exel', requestOptions, {
  filename: 'report-excel.xls'
}).then(() => {
  console.log('saved')
}); // browser will save and download response
```


----

[Bivrost](https://github.com/tuchk4/bivrost) allows to organize a simple interface to asyncronous APIs.

#### Other adapters

  * [Fetch adapter](https://github.com/tuchk4/bivrost-fetch-adapter)
  * [Axios adapter](https://github.com/tuchk4/bivrost-axios-adapter)
  * [Delay adapter](https://github.com/tuchk4/bivrost-delay-adapter)
  * [Local storage adapter](https://github.com/tuchk4/bivrost-local-storage-adapter)
  * [Save blob adapter adapter](https://github.com/tuchk4/bivrost-save-blob-adapter)
