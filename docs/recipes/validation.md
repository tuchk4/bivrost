# Validation

Throw error or return rejected promise at any step.
There are some useful libraries for data validation:

* [tcomb](https://github.com/gcanti/tcomb) - Type checking and DDD. There is additional example with tcomb - [Data source type checking with tcomb](/docs/recipes/data-source-type-checking.md)
* [Joi](https://www.npmjs.com/package/joi) - Obejct schema validation
* [Validator](https://github.com/chriso/validator.js) - String validation and sanitization

```js
import ALL_USERS_FIXTURE form 'fixtures/all-users';

class UserDataSource extends DataSource {

  static steps =  ['validation', 'api'];

  static validation = {
    create: user => {
      if (!user.id) {
        // throw new Error('"id" is required');
        return Promise.reject('"id" is required');
      }

      return user;  
    }
  }

  static api = {
    loadAll: api('GET /users'),
    create: api('POST /users')
  };

  loadAll(params) {
    return this.invoke('loadAll', params);
  }

  create(user) {
    return this.invoke('create', user);
  }
}
```
