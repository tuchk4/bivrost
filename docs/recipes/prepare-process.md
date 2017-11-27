# Prepare request and process response

Response processing in some cases are important to get more usable format
according to current application.

For example - auto add users avatars using http://placehold.it service.

```js
class UsersDataSource extends DataSource {
  static steps = ['api', 'process'];

  static api = {
    list: api ('GET /users')
  };

  static process = {
    list: users => users.map(user => {
      return {
        ...user,
        avatar: user.avatar ? user.avatar : 'http://placehold.it/30x30'
      }
    });
  };

  loadAll(params) {
    return this.invoke('list', params);
  }
}
```

Prepare requests is very useful for requests params transformation
(serialization): covert form camelCase to snake_case, rename some props, auto
adding props etc.

```js
class UsersDataSource extends DataSource {
  static steps = ['prepare', 'api', 'process'];

  static prepare = {
    list: params => ({
      l: [params.limit, params.offset],
      o: params.order,
    }),
  };

  static api = {
    list: api('GET /users'),
  };

  loadAll(params) {
    return this.invoke('list', params);
  }
}
const usersDataSource = new UsersDataSource();
usersDataSource.loadAll({
  limit: 100,
  offset: 2,
  order: 'id',
}); // GET /users?l=100,2&o=id
```
