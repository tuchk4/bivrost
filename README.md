# [Bivrost](http://tuchk4.github.io/bivrost/)

Bivrost allows to organize a simple interface to asynchronous APIs.

[![build status](https://img.shields.io/travis/tuchk4/bivrost/master.svg?style=flat-square)](https://travis-ci.org/tuchk4/bivrost)
[![npm version](https://img.shields.io/npm/v/bivrost.svg?style=flat-square)](https://www.npmjs.com/package/bivrost)

## Bivrost

The main idea of Bivrost is grouping several API methods into data-sources.

[Bivrost full documentation and recipes](https://tuchk4.github.io/bivrost/)

## Installation

```
npm install --save bivrost
```

## The gist

That’s it! Create api function for github api.

```js
import api from 'bivrost/http/api'
import fetchAdapter from 'bivrost-fetch-adapter';

const githubApi = api({
  protocol: 'https:'
  host: 'api.github.com',
  adapter: fetchAdapter()
});

//define API method
const repositoryList = githubApi('GET /users/:user/repos'),

//call API method
repositoryList({ user: 'tuchk4' })
  .then(repositories => console.log(repositories));
```

Create data source that contain few github api methods (get repositories list and get repository info) and its invoke chain.   

```js
import DataSource from 'bivrost/data/source';
import githubApi from './github-api';
import tcomb from 'tcomb';

class GihtubRepositories extends DataSource {
  // define invoke method chain. Default chain is - ['api', 'process']
  static steps = ['api', 'immutable'];

  // "define "api" step
  static api = {
    repos: githubApi('GET /users/:user/repos'),
    repoInfo: githubApi('GET /repos/:user/:repository')
  };

  // step function will be executed for each method
  static immutable = response => Immutable.fromJSON(response);

  // define data source public methods that invokes steps methods
  getRepositories(user) {
    return this.invoke('repos', {
      user
    });
  };

  getRepositoryInfo(user, repository) {
    return this.invoke('repoInfo', {
      user,
      repository
    });
  }
}
```

Extends GihtubRepositories and define username. Now all requests will be done for facebook's github group.

```js
import GihtubRepositories from './github-repositories';

const FACEBOOK_GITHUB_ACCOUNT = 'facebook';

class FacebookRepositories extends GihtubRepositories {
  getRepositories() {
    return super.getRepositories(FACEBOOK_GITHUB_ACCOUNT);
  }

  getRepositoryInfo(repository) {
    return super.getRepositoryInfo(FACEBOOK_GITHUB_ACCOUNT, repository);
  }
}
```

### [Contributing](docs/contributing.md)

Project is open for new ideas and features:

- new adapters
- new api functions
- data source features
- feedback is very matter

---

## Docs

* [Basics](/docs/basics/README.md)
  * [Api function](/docs/basics/api-function.md)
  * [Adapter](/docs/basics/adapter.md)
  * [Data source](/docs/basics/data-source.md)
* [Recipes](/docs/recipes/README.md)
  * [Api enchantment](/docs/recipes/api-enchantment.md)
  * [Generate DataSource invoke functions](/docs/recipes/data-source-auto-invoke.md)
  * [Data source immutable output](/docs/recipes/data-source-immutable.md)
  * [Data source type checking (tcomb)](/docs/recipes/data-source-type-checking.md)
  * [CRUD Data source](/docs/recipes/generate-crud-methods.md)
  * [File upload](/docs/recipes/file-upload.md)
  * [Fixtures](/docs/recipes/fixtures.md)
  * [Default api response](/docs/recipes/default-response.md)
  * [Prepare request and process response](/docs/recipes/prepare-process.md)
* [Testing](/docs/testing.md)
* [Contributing](docs/contributing.md)

#### Adapters

  * [Fetch adapter](https://github.com/tuchk4/bivrost-fetch-adapter)
  * [Axios adapter](https://github.com/tuchk4/bivrost-axios-adapter)
  * [Delay adapter](https://github.com/tuchk4/bivrost-delay-adapter)
  * [Local storage adapter](https://github.com/tuchk4/bivrost-local-storage-adapter)
  * [Save blob adapter adapter](https://github.com/tuchk4/bivrost-save-blob-adapter)
