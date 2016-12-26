# Default api response

NOTE: This is wrong to define default output because this is the server liability

```js
class UsersDataSource extends DataSource {
  static steps = ['api', 'defaultResponse'];

  static api = {
    list: api ('GET /users')
  };

  static defaultResponse = {
    list: users => users ? users : []
  };

  loadAll(params) {
    return this.invoke('list', params);
  }
}
```
