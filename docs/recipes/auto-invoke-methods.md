# Auto Invoke Methods

```js
import DataSource from 'bivrost/data/source';

class UsersDataSource extends DataSource {
  static api = {
    loadAll: api('GET /users'),
    load: api('GET /users/:id'),
    create: api('POST /users'),
  };
}

const usersDataSource = new UsersDataSource();

// Generated methods:
usersDataSource.invokeLoad();
usersDataSource.invokeLoadAll();
usersDataSource.invokeCreate();
```
