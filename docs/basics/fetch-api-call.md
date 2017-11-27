# [Fetch API Call](https://github.com/tuchk4/bivrost/tree/master/packages/fetch-api-call)

Awesome fetch api for browser and nodejs with interceptors easy way to declare
api endpoints. Provide very easy way to setup api for different
backends/services.

### [#](#install) Install

```
yarn add fetch-api-call
```

### [#](#api-declaration) Api Declaration

```js
import fetchApiCall from 'fetch-api-call';

const { api } = fetchApiCall({
  protocol: process.env.API_PROTOCOL,
  host: process.env.API_HOST,
});
```

Options:

* _protocol_ - http protocol. Available values - **http:** an **https:**
* _host_ - server hostname
* _headers_ - requests headers. NOTE that headers could be also set with
  interceptors
* _mode_ - more details at -
  https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
* _prefix_ - api url prefix. Useful when there are multiple api versions:
  * _/user_
  * _/v1/user_
  * _/v2/user_

**api** - function to define api methods in single line of code.

```js
const apiCall = api('HTTP_METHOD /api/path/:with/:placeholders');
```

_apiCall(params = {}, headers = {})_ - function takes two optional params:

* _params_ - api params. Also is used for building final api entrypoint. More
  detauls see at
  [Api Url Definition and Placeholders](https://tuchk4.github.io/bivrost/docs/basics/api-function.html#api-definition).
* _headers_ - certain request headers.

Examples:

```js
// user login api
const login = api('POST /login');
login({
  username,
  password,
});

// user logout api
const logout = api('POST /logout');
logout();

// get user api
const getUser = api('GET /user/:id');
getUser({
  id: 1,
});
```

### [#](#interceptors) Interceptors

```js
import fetchApiCall from 'fetch-api-call';

const { api, interceptors } = fetchApiCall({
  protocol: process.env.API_PROTOCOL,
  host: process.env.API_HOST,
});
```

**interceptors** methods:

* _addRequestInterceptor(request)_
* _addResponseInterceptor(response)_
* _addErrorInterceptor(error)_

Each methods return function to remove interceptor.

Iterceptors will be called for all request done with _api_.

```js
// user login api
const login = api('POST /login');
let removeAcessTokenIterceptor = null;

login({}).then(({ acessToken }) => {
  removeAcessTokenIterceptor = iterceptors.addRequestInterceptor(request => {
    request.headers.set('Acess-Token', acessToken);
    return request;
  });
});

// user logout api
const logout = api('POST /logout');
logout().then(() => {
  removeAcessTokenIterceptor();
});

// get user api
const getUser = api('GET /user/:id');
getUser({
  id: 1,
});
```

### [#](#request-headers) Request Headers

This is useful when using `fetch-api-call` on NodeJS. In some cases it is not
possible to use interceptors to set auth headers becasue it will work for all
request. We should specify certain request with certain header.

```js
const getStatistics = api('GET /statistics');
getStatistics(
  {},
  {
    MyCustomHeader: '123zxc',
  }
);
```

### [#](#multiple-api-instances) Multiple Api Instances

Very useful if there is microservices backend architecture.

```js
import fetchApiCall from 'fetch-api-call';

const Auth = fetchApiCall({
  host: process.env.AUTH_API_HOST,
});

const Users = fetchApiCall({
  host: process.env.USERS_API_HOST,
});

const Data = fetchApiCall({
  host: process.env.DATA_API_HOST,
  prefix: 'v2'
});

const login = Auth.api('POST /login').then(({ accessToken }) => {
  Users.interceptors.addRequest(res => {
    request.headers.set('Acess-Token', acessToken);
    return request;
  });

  Data.interceptors.addRequest(res => {
    request.headers.set('Acess-Token', acessToken);
    return request;
  });
});

const loadStatisitcs = Data.api('GET /statisitcs);
loadStatisitcs({
  filter: {
    //...
  }
});
```

### [#](#custom-setup) Custom Setup

```js
import setup from 'fetch-api-call/setup';
import fetchAdapter from 'bivrost-fetch-adapter';

const createApi = setup({
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
  adapter: fetchAdapter,
  interceptors: {
    resposne: res => res,
    request: req => req,
    error: err => err,
  },
});

const api = createApi({
  protocol: process.env.API_PROTOCOL,
  host: process.env.API_HOST,
})

const login = api('POST /login);
```

* _headers_ - default headers
* _mode_ - default mode. More details at -
  https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
* _adapter_ - default HTTP adapter. See more at -
  https://tuchk4.github.io/bivrost/docs/docs/adapters.html
* _interceptors_ - initial interceptors. NOTE that this is NOT DEFAULT
  interceptors.
