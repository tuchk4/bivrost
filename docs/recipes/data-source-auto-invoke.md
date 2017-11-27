# Generate DataSource invoke functions

Generate invoke functions according to dataSource _api_ step configuration.

```js
import DataSource from 'bivrost/data/source';

class AutoInvokeDataSource extends DataSource {
  constructor(...props) {
    super(...props);

    for (const id of Object.keys(this.constructor.api)) {
      this[id] = props => this.invoke(id, props);
    }
  }
}

class UsersDataSource extends AutoInvokeDataSource {
  static api = {
    loadAll: api('GET /users'),
    load: api('GET /users/:id'),
    create: api('POST /users'),
  };

  create(props) {
    return super.create(props).them(user => {
      console.log('user was created');
      return user;
    });
  }
}

const usersDataSource = new UsersDataSource();

// Generated methods:
usersDataSource.load();
usersDataSource.loadAll();
```
