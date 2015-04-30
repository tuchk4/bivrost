import t from 'tcomb';
import axios from 'axios';
import HttpAdapterAxios from '../../http/adapter/axios';
import Api from '../../http/api';
import DataSource from '../../data/source';
import {TWeatherForecast, TWeatherCurrent} from './model';

//setup Api client
const WeatherApi = Api.extend({
  base: 'http://api.openweathermap.org', //server
  prefix: '/data/2.5/', //path to API root
  adapter: HttpAdapterAxios(axios), //HTTP client adapter
});

class WeatherDataSource extends DataSource {
  dailyForecast(city) {
    return this.invokeMethod('dailyForecast', {q:city});
  }
  current(city) {
    return this.invokeMethod('current', {q:city});
  }

  methodProperties() {
    return {
      //API methods (our interface to the external world):
      api: {
        dailyForecast: WeatherApi('GET /forecast/daily'),
        current      : WeatherApi('GET /weather'),
      },
      //Type checking:
      inputType: {
        dailyForecast: t.struct({q: t.Str}), //input data is checked against tcomb structure
        current      : t.struct({q: t.Str}),
      },
      outputType: {
        dailyForecast: TWeatherForecast, //output data is checked against tcomb structure
        current      : TWeatherCurrent,
      },
      //Caching:
      cache: {
        dailyForecast: {
          enabled : true,  //The results of `dailyForecast` method call will be cached
          ttl     : 60 * 60 * 1000, //for an hour.
          isGlobal: true, //Share the same cache for all instances of WeatherDataSource. (default - no)
        },
        current: {
          enabled : true,
          ttl     : 15 * 60 * 1000,
          isGlobal: true,
        },
      },
    };
  }
}

//create dataSource
var weather = new WeatherDataSource();

//call datasource methods
function printWeatherForecast() {
  return weather.dailyForecast('Kiev')
    .then((forecast) => console.log('WEATHER FORECAST:', forecast))
    .catch((error) => console.error(error));
}


function printCurrentWeather() {
  return weather.current('Kiev')
    .then((current) => console.log('CURRENT WEATHER:', current))
    .catch((error) => console.error(error));
}


printWeatherForecast()
  .then(printCurrentWeather)
  .catch((error) => console.error(error));;
