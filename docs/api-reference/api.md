# Api


### <a id='api'></a>[`api(options: object)`](#api)

#### Arguments
1. `options` (*Object*): api configuration. 

```js
{
  protocol,
  host,
  prefix,
  adapter,
  headers
}
```

- host (*String*) <small>required</small> - server host. 
- adapter (*Function*) <small>required</small> - HR adapter. There is list of available adapters. 
- prefix (*prefix*) - api entry point prefix. Useful if there are backend API versions or there is base url at backend
- protocol (*String*): protocol to use. Defaults to: `http:`. Colon in the end [is required](https://nodejs.org/api/url.html).
- headers (*Object*): http headers that will be sent.


#### Returns
(*Function*): The configured [`requestTemplate`](#request-template) function.


## <a id='request-template'></a>[`requestTemplate(template: string, params: object)`](#request-template)

This function is using for configuring http method and final entry point.

#### Arguments

1. `template` (*String*): The request method and url template. Supports placeholder and params binding.
2. `params` (*Object*): Configurable params. (UNDER Q)

#### Simple GET request
```js
const request = requestTemplate('GET /users');
```

#### Placeholders

In this example - final url will be - `/users/1`.

```js
const request = requestTemplate('GET /users/:id');
request({
  id: 1
});
```

#### Bound url params

In this example - only `baz` will be passed at body. Other params will be passed as GET params

```js
const request = requestTemplate('POST /users?foo&bar');
request({
  foo: '...',
  bar: '...',
  baz: '...'
});
```


#### Returns
(*Function*): The [`request`](#request) function.

## <a id='request'></a>[`request(params: object)`](#request)

1. `params` (*Object*) - that will be passed to request. Placeholder keys will be cut. For GET requests - params will processed as query. For POST requests params will be processed as body.
