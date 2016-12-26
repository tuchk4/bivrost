import t from 'tcomb';
import axios from 'axios';
import axiosAdapter from 'bivrost-axios-adapter';
import api from 'bivrost/http/api';
import DataSource from 'bivrost/data/source';
import {TWeatherForecast, TWeatherCurrent} from './model';

//setup Api client
const weatherApi = api({
  base: 'http://api.openweathermap.org', //server
  prefix: '/data/2.5/', //path to API root
  adapter: axiosAdapter(axios) //HTTP client adapter
});

class WeatherDataSource extends DataSource {
  steps = ['input', 'api', 'output'];

  cache = {
    dailyForecast: {
      enabled: true,  //The results of `dailyForecast` method call will be cached
      ttl: 60 * 60 * 1000, //for an hour.
      isGlobal: true //Share the same cache for all instances of WeatherDataSource. (default - no)
    },
    current: {
      enabled: true,
      ttl: 15 * 60 * 1000,
      isGlobal: true
    }
  };

  input = {
    dailyForecast: t.struct({q: t.Str}), //input data is checked against tcomb structure
    current: t.struct({q: t.Str})
  };

  api = {
    dailyForecast: weatherApi('GET /forecast/daily'),
    current: weatherApi('GET /weather')
  };

  output = {
    dailyForecast: TWeatherForecast, //output data is checked against tcomb structure
    current: TWeatherCurrent
  };

  dailyForecast(city) {
    return this.invoke('dailyForecast', {q: city});
  }

  current(city) {
    return this.invoke('current', {q: city});
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
  .catch(error => console.error(error));
