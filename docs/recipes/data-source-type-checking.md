# Data source with type checking

[tcomb](https://github.com/gcanti/tcomb) - is a library for Node.js and the
browser which allows you to check the types of JavaScript values at runtime with
a simple and concise syntax. It's great for Domain Driven Design and for adding
safety to your internal code.

Using _tcomb_ we could check _api_ input and output data in realtime and disable
it for production env.

```js
import DataSource from 'bivrost/data/source';
import tcomb from 'tcomb';

class UserDataSource extends DataSource {
  static steps = ['input', 'api', 'output'];

  static input = {
    user: tcomb.struct({
      id: tcomb.Number,
    }),
  };

  static output = {
    user: tcomb.struct({
      id: tcomb.Number,
      name: tcomb.String,
      lastname: tcomb.maybe(tcomb.String),
    }),
  };

  static api = {
    user: api('GET /user/:id'),
  };

  loadUser({ id }) {
    return this.invoke('user', {
      id,
    });
  }
}

const usersDataSource = new UserDataSource();

// OK
usersDataSource.loadUser({
  id: 1,
});

// Throw exception that ID attribute must be a Number.
usersDataSource.loadUser({
  id: '1',
});
```
