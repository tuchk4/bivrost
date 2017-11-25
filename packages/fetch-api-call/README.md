# Bivrost fetch API Call

Adapter for browser's native fetch function.


```js
import fetchApiCall from 'fetch-api-call';

const { api, interceptors } = fetchApiCall({
  protocol,
  host,
});


const login = api('POST /login');
const logout = api('POST /logout');

const removeInterceptor = interceptors.request.add(() => {})
const removeInterceptor = interceptors.response.add(() => {});
const removeInterceptor = interceptors.error.add(() => {});
```