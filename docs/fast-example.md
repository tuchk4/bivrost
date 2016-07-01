# Fast example

## Intall

```js
npm install --save bivrost
npm install --save bivrost-fetch-adapter
```

## Create api function
```js
// github-api.js
import api from 'bivrost/http/api';
import fetchAdapter from 'bivrost-fetch-adapter';

// create Api function that configured for github api.
// all XHR requests will be done via browser fetch function
const githubApi = api({
  protocol: 'https:'
  host: 'api.github.com',
  adapter: fetchAdapter()
});
```

## Create data source

```js
import DataSource from 'bivrost/data/source';
import githubApi from './github-api.js';

class GithubDataSource extends DataSource {
  // configure cache
  static cache = {
    repos: {
      enabled: true,
      ttl: 60000
    }
  };

  // configure api call step
  static api = {
    repos: githubApi('GET /users/:user/repos'),
    repoInfo: githubApi('GET /repos/:user/:repository')
  }
  
  // configure process step
  static process: {
    repoInfo: info => {
      return  {
        ...info,
        loadedWith: 'GithubDataSource'
      }
    }
  }
  
  getUserRepositories(user) {
    // start steps chain. default chain steps: prepare -> api -> process
    return this.invoke('repos', {
      user
    });
  }
  
  getRepositoryInfo(user, repo) {
    return this.invoke('repoInfo', {
      repo,
      user
    });
  }
}
```

## Data source usage

```js
import GithubDataSource from './github-data-source.js';

const githubDataSource = new GithubDataSource();

githubDataSource.getUserRepositories('tuchk4')
    .then(repos => {
      // ...
     })
     .catch(error => {
       // ...
     });
```
