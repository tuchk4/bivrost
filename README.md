# [Bivrost](http://frankland.github.io/bivrost/)

Bivrost allows to organize a simple interface to asyncronous APIs.

[![build status](https://img.shields.io/travis/frankland/bivrost/master.svg?style=flat-square)](https://travis-ci.org/frankland/bivrost)
[![npm version](https://img.shields.io/npm/v/bivrost.svg?style=flat-square)](https://www.npmjs.com/package/bivrost)

## Bivrost (data layer for JS applications)

The main idea of Bivrost is grouping several API methods into data-sources.

## Installation

`npm install --save bivrost`
 
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
repositoryList({user: 'tuchk4'})
  .then(repositories => console.log(repositories));
```

Create data source that contain few github api methods(get repositories list and get repository info) and its invoke chain.   

```js
import DataSource from 'bivrost/data/source';
import githubApi from './github-api';
import tcomb from 'tcomb';

class GihtubRepositories extends DataSource {
  // define invoke method chain. Default chain is - ['prepare', 'api', 'process']
  static steps = ['input', 'api', 'immutable'];

  // define "input" step. Step will be skipped for "repos" method because not defined
  static input = {
    repoInfo: params => tcomb.struct({
      user: tcomb.Str,
      repository: tcomb.Str
    })
  };

  // define "api" step
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

Extends github data source and define username. Now all requests will be done for facebook's github group.

```js
const GITHUB_ACCOUNT = 'facebook';

class FacebookRepositories extends GihtubRepositories {
  getRepositories() {
    return super.getRepositoryInfo(GITHUB_ACCOUNT);
  }
  
  getRepositoryInfo(repository) {
    return super.getRepositoryInfo(GITHUB_ACCOUNT, repository);
  }
}
```

## Documentation

* [Basics](docs/basics/README.md)
* [API Reference](docs/api-reference/README.md)
* [Testing](docs/testing.md)
* [Recipes](docs/recipes/README.md)
* [Adapters list](docs/adapters-list/README.md)
* [Api functions](docs/api-functions-list/README.md)
* [Glossary](docs/glossary.md)
* [Contributing](docs/contributing.md)
