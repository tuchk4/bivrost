# Api function

*Api* is simple HTTP client wrapper that lets us define REST methods in single line of code.

```js
import api from 'bivrost/http/api'
import fetchAdapter from 'bivrost-fetch-adapter';

const githubApi = api({
  protocol: 'https:'
  host: 'api.github.com',
  adapter: fetchAdapter()
});
```

Then define api methods in single line of code:

```js
// Create a new repository for the authenticated user
const createRepository = githubApi('POST /user/repos');
createRepository({
  name: 'My new repo'
}).then(response => {});

// List all public repositories
const getRepositoryList = githubApi('GET /repositories');
getRepositoryList({
  since: 364 // The integer ID of the last Repository that you've seen.
}).then(response => {});

// List of users repositories
const getRepositoryInfo = githubApi('GET /repos/:owner/:repo');
getUserRepositories({
  owner: 'tuchk4',
  repo: 'bivrost'
}).then(response => {});
```

##  <a id='api-definition'></a>[#](#api-definition) Api url definition and placeholders

* `PUT /user/:id` - *id* parameter is required. *id* will be removed from request body. All other parameters will be passed to request body.

```js
const updateUser = api('PUT /user/:id');
updateUser({
  id: 1,
  name: 'Valerii'
});

// Make PUT request to /user/1
// with request body
// name=Valerii
```

* `POST /user?:hash&:version` - *hash* and *version* parameters are required. These parameters will be removed from request body and passed to query. All other parameters will be passed to request body.

```js
const createUser = api('POST /user?:hash&:version&');

createUser({
  name: 'John Doe',
  hash: 'eecab3',
  version: 'v1.2.0'
});

// Make POST request to /user?hash=eecab3&version=v1.2.0
// with request body
// name=tuchk4
```

* `GET /users` - for *GET* requests all parameters are passed to query.

```js
const getUsers = api('GET /users');

getUsers({
  group: 'admin',
  orderBy: 'loginDate'
});

// Make GET request to /users?group=admin&orderBy=loginDate
```

## <a id='adapters'></a>[#](#adapters) Under the hood: adapters

*  [Adapters](/docs/basics/adapter.md)

`POST /user?:hash&:version` does not guarantee that XHR POST method will be called. What will be done depends on used adapter - *api* just calls adapter function with generated config. In case of *localStorage* adapter - it will save or load data to localStorage.
