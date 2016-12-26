# Data source immutable output

[Immutable](https://facebook.github.io/immutable-js/) - Immutable.js provides many Persistent Immutable data structures including: List, Stack, Map, OrderedMap, Set, OrderedSet and Record.

Make each methods response immutable:

```js
class UserDataSource extends DataSource {
  static steps = ['api', 'immutable'];

  static immutable = response => Immutable.fromJSON(response);

  static api = {
    list: api ('GET /users')
  };

  loadAll(params) {
    return this.invoke('list', params);
  }
}
```

Use Immutable [Records](https://facebook.github.io/immutable-js/docs/#/Record) and [Maps](https://facebook.github.io/immutable-js/docs/#/Map):

```js
import { Record, Map } from 'immutable';

const User = Record({
  id: null,
  name: ''
});

class UserDataSource extends DataSource {
  static steps = ['validate', 'api', 'model'];

  static api = {
    update: api('PUT /users/:id'),
    loadAll: api('GET /users')
  }

  static model = {
    update: response => new User(response),

    loadAll: response => {
      return response.reduce((map, user) => {
        map.set({
          [user.id]: user
        });

        return map;
      }, Map());
    }
  }

  update(user) {
    return this.invoke('update', user);
  }
}
```
