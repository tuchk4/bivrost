# Fixtures

Change invoke steps according to current env

```js
import ALL_USERS_FIXTURE form 'fixtures/all-users';

class UserDataSource extends DataSource {

  static steps = process.env.NODE_ENV === 'development'
    ? ['fixture', 'immutable']
    : ['api', 'immutable'];

  immutable = response => Immutable.fromJSON(response);

  static fixture = {
    loadAll: ALL_USERS_FIXTURE
  };

  static api = {
    loadAll: api('GET /users')
  };

  loadAll(params) {
    return this.invoke('loadAll', params);
  }
}
```
