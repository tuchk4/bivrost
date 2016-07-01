# Step by step example

## Import all resources

```js
import DataSource from 'bivrost/data/source';
import api from 'bivrost/http/api';
import fetchAdapter from 'bivrost-fetch-adapter';
```

- `DataSource` - base data source class. Contain method for configuration, invoke methods and cache manipulation.
- `api` - configure api requests. Api could be configured manually or imported already configured.
- `fetchAdapter` - adapt api function to used approaches or libraries or enchant another adapters.


## API configuration

```js
import api from 'bivrost/http/api'
import fetchAdapter from 'bivrost-fetch-adapter';

const githubApi = api({
  protocol: 'https:'
  host: 'api.github.com',
  adapter: fetchAdapter()
});
```

Create Api function that configured for github api. All XHR requests will be done via browser fetch function.
This api configuration function could be saved as separated module at `github-api.js` or even push to github and npm.
So if there are any changes in configuration - we should only update version in our projects instead of monkey patching.

## Understanding invoke and steps

```js
dataSource.invoke(method: string, params: object);
```

## Create Data source

```js
import DataSource from 'bivrost/data/source';
import githubApi from './github-api';

class GithubDataSource extends DataSource {
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
}
```

## Execute api methods

```js
import GithubDataSource from './github-data-source';

const githubDataSource = new GithubDataSource();

githubDataSource.getUserRepositories('tuchk4')
    .then(() => {}, () => {});
```
