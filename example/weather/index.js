import t from 'tcomb';
import axios from 'axios';
import HttpAdapterAxios from '../../http/adapter/axios';
import Api from '../../http/api';
import DataSource from '../../data/source';
import TWeatherForecast from './model';

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

//create dataSource
var weather = new WeatherDataSource();

//call datasource method
weather.dailyForecast('Kiev')
  .then((forecast) => console.log(forecast))
  .catch((error) => console.error(error));
