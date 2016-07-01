# Api function

*Api* is simple HTTP client wrapper that lets us define REST methods in single line of code.

```js
import axios from 'axios';
import HttpAdapterAxios from 'bivrost/http/adapter/axios';
import Api from 'bivrost/http/api';

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
