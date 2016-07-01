# Export invoke method

### <a id='exportInvokeMethod'></a>[`exportInvokeMethod(dataSource: DataSource, method: string, step: string)`](#exportInvokeMethod)

Export step as standalone function. Mostly used for tests: you could write test for each invoke step separately.

#### Arguments

1. `dataSource` (*DataSource*) - data source instance or class?
2. `method` (*String*) - method to export
3. `step` (*String*) - step to export

#### Returns
(*Function*): The wrapper on data source method step. Its arguments will be passed to step function and return its result.

#### Example

```js
...
```
