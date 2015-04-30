# Bridge (data layer for JS applications)

Bridge allows to organize a simple interface to asyncronous APIs.

The main idea of bridge is grouping several API methods into data-sources.
Each data-source is ES6 class.

## Installation

## Usage

### bridge/api

`Api` is simple HTTP client wrapper that lets us define REST methods in single line of code.

```js
import axios from 'axios';
import HttpAdapterAxios from 'bridge/http/adapter/axios';
import Api from 'bridge/http/api';

//setup Api client
const WeatherApi = Api.extend({
  base: 'http://api.openweathermap.org',
  prefix: '/data/2.5/',
  adapter: HttpAdapterAxios(axios),
});

//define API method
const dailyForecast = WeatherApi('GET /forecast/daily');

//call API method
dailyForecast({q: 'Kiev'})
  .then((response) => console.log(response));

```

### bridge/data/source

`DataSource` lets us define REST resources declaratively.

By default, every method call passes the following steps:

 * **`inputType`** — type-check the input params
 * **`prepare`** — prepare the request (make high-level transformations, e.g., add any kinds of meta-data to the request, etc)
 * **`serialize`** — convert the request to the format understood by the server
 * **`api`** — call the API method
 * **`unserialize`** — convert the server request to the format understood by our application
 * **`process`** — process the request (make high-level transformations)
 * **`outputType`** — type-check the result

Note: type checking plays well with [tcomb](http://gcanti.github.io/tcomb/) runtime type checking library.

In `methodProperties()` we can define any step from this list for any API method.

See [full example](https://github.com/corporateanon/bridge/tree/master/example/weather/index.js)

```js
import DataSource from 'bridge/data/source';

class WeatherDataSource extends DataSource {
  dailyForecast(city) {
    return this.invokeMethod('dailyForecast', {q:city});
  }

  methodProperties() {
    return {
      //API methods (our interface to the external world):
      api: {
        dailyForecast: WeatherApi('GET /forecast/daily')
      },
      //Type checking:
      inputType: {
        dailyForecast: t.struct({q: t.Str}) //input data is checked against tcomb structure
      },
      outputType: {
        dailyForecast: TWeatherForecast //output data is checked against tcomb structure
      },
      //Caching:
      cache: {
        dailyForecast: {
          enabled: true,  //The results of `dailyForecast` method call will be cached
          ttl: 60 * 60 * 1000, //for an hour.
          isGlobal: true, //Share the same cache for all instances of WeatherDataSource. (default - no)
        }
      },
    };
  }
}

```
