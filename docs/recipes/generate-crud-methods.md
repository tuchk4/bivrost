# Generate CRUD methods

* [Create data source with CRUD method](#create-crud-ds)
* [Extends CRUD data source](#extends-crud-ds)

Crud data source factory:

```js
import DataSource from 'bivrost/data/source';

export default (entity, api) => {
  const normalized = `${entity.toLowerCase()}s`;

  return class CrudDataSource extends DataSource {
    static api = {
      loadAll: api(`GET /${normalized}`),
      load: api(`GET /${normalized}/:id`),
      create: api(`POST /${normalized}`),
      update: api(`PUT /${normalized}/:id`),
      delete: api(`DELETE /${normalized}/:id`)
    };

    load({ id }) {
      return this.invoke('load');
    }

    loadAll({ filters }) {
      return this.invoke('loadAll', { filters });
    }

    create({ user }) {
      return this.invoke('create', { user });
    }

    update({ user }) {
      return this.invoke('update', { user });
    }

    delete({ id }) {
      return this.invoke('delete', { id });
    }
  }
};
```

## <a id='create-crud-ds'></a>[#](#create-crud-ds) Create data source with CRUD methods

```js
import bivrostApi from 'bivrost/http/api'
import fetchAdapter from 'bivrost-fetch-adapter';
import createCrudDataSource from './create-crud-datasource.js';

const api = bivrostApi({
  host: 'localhost',
  adapter: fetchAdapter()
});

const UsersDataSource = createCrudDataSource('user', api)
const users = new UsersDataSource();

users.loadAll(); // GET /users

users.load({
  id: 1
}); // GET /users/1

users.create({
  name: 'John Doe'
}); // POST /users


users.update({
  id: 1
  name: 'John Doe'
}); // PUT /users/1

users.delete({
  id: 1
}); // DELETE /users/1
```

## <a id='extends-crud-ds'></a>[#](#extends-crud-ds) Extends CRUD data source

```js
import tcomb from 'tcomb';

import bivrostApi from 'bivrost/http/api'
import fetchAdapter from 'bivrost-fetch-adapter';
import createCrudDataSource from './create-crud-datasource.js';

const api = bivrostApi({
  host: 'localhost',
  adapter: fetchAdapter()
});

const UsersDataSource = createCrudDataSource('user', api)

class EnchantedUsers extends UsersDataSource {
  static api = {
    ...UsersDataSource.api,
    ping: api('GET /users/:id/ping')
  }

  ping({ id }) {
    return this.invoke('ping', { id });
  }

  create({ user }) {
    return super.create({ user }).then(user => {

      console.log('user was create');

      return user;
    });
  }
}
```
