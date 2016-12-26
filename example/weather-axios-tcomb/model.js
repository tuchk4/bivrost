import t from 'tcomb';

const MaybeNum = t.maybe(t.Num);

const TWeatherInfo = t.struct({
    "id": t.Num,
    "main": t.Str,
    "description": t.Str,
    "icon": t.Str
  });
const TForecastItem = t.struct({
  "dt": t.Num,
  "temp": t.struct({
    "day": MaybeNum,
    "min": MaybeNum,
    "max": MaybeNum,
    "night": MaybeNum,
    "eve": MaybeNum,
    "morn": MaybeNum
  }),
  "pressure": MaybeNum,
  "humidity": MaybeNum,
  "weather": t.list(TWeatherInfo),
  "speed": MaybeNum,
  "deg": MaybeNum,
  "clouds": MaybeNum,
  "rain": MaybeNum
});

const TLatLon = t.struct({
  "lon": t.Num,
  "lat": t.Num
});

const TCity = t.struct({
  "id": t.Num,
  "name": t.Str,
  "coord": TLatLon,
  "country": t.Str,
  "population": t.Num
});

export const TWeatherForecast = t.struct({
  cod: t.Str,
  message: t.Num,
  city: TCity,
  cnt: t.Num,
  list: t.list(TForecastItem)
});

export const TWeatherCurrent = t.struct({
  "coord": TLatLon,
  "weather": t.list(TWeatherInfo),
  "sys": t.struct({
    "message": t.Num,
    "country": t.Str,
    "sunrise": t.Num,
    "sunset": t.Num
  }),
  "base": t.Str,

  "main": t.struct({
    "temp": MaybeNum,
    "temp_min": MaybeNum,
    "temp_max": MaybeNum,
    "pressure": MaybeNum,
    "sea_level": MaybeNum,
    "grnd_level": MaybeNum,
    "humidity": MaybeNum
  }),
  "wind": t.Obj,
  "clouds": t.Obj,
  "rain": t.Obj,
  "dt": t.Num,
  "id": t.Num,
  "name": t.Str,
  "cod": t.Num
});
