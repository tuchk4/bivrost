import t from 'tcomb';

const MaybeNum = t.maybe(t.Num);

const TForecastItem = t.struct({
  "dt": t.Num,
  "temp": t.struct({
    "day": MaybeNum,
    "min": MaybeNum,
    "max": MaybeNum,
    "night": MaybeNum,
    "eve": MaybeNum,
    "morn": MaybeNum,
  }),
  "pressure": MaybeNum,
  "humidity": MaybeNum,
  "weather": t.list(t.struct({
    "id": t.Num,
    "main": t.Str,
    "description": t.Str,
    "icon": t.Str,
  })),
  "speed": MaybeNum,
  "deg": MaybeNum,
  "clouds": MaybeNum,
  "rain": MaybeNum,
});

const TLatLon = t.struct({
  "lon": t.Num,
  "lat": t.Num,
});

const TCity = t.struct({
  "id": t.Num,
  "name": t.Str,
  "coord": TLatLon,
  "country": t.Str,
  "population": t.Num,
});

const TWeatherForecast = t.struct({
  cod: t.Str,
  message: t.Num,
  city: TCity,
  cnt: t.Num,
  list: t.list(TForecastItem),
});

export default TWeatherForecast;
