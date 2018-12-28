import qs from 'qs';
import 'isomorphic-fetch';

const DEFAULT_ADAPTER_OPTIONS = {
  queryFormat: {
    arrayFormat: 'brackets',
  },
};

const filterNullValues = obj =>
  Object.keys(obj).reduce((map, key) => {
    if (obj[key]) {
      map[key] = obj[key];
    }

    return map;
  }, {});

export default function fetchAdapter({ interceptors = {}, ...options } = {}) {
  const adapterOptions = {
    ...DEFAULT_ADAPTER_OPTIONS,
    ...options,
  };

  return function(url, requestOptions = {}) {
    const config = {
      ...adapterOptions,
      ...requestOptions,
      headers: new Headers(
        filterNullValues({
          ...(adapterOptions.headers || {}),
          ...(requestOptions.headers || {}),
        })
      ),
    };

    if (requestOptions.body) {
      if (requestOptions.body.forEach instanceof Function) {
        config.body = requestOptions.body;
      } else {
        config.body = JSON.stringify(requestOptions.body);
      }
    }

    let queryString = '';
    if (requestOptions.query) {
      queryString = qs.stringify(requestOptions.query, config.queryFormat);
    }

    let request = new Request(`${url}${queryString ? `?${queryString}` : ''}`, {
      method: requestOptions.method,
      ...config,
    });

    if (interceptors.request) {
      request = interceptors.request(request);
    }

    return fetch(request).then(
      response => {
        if (response.ok) {
          return interceptors.response
            ? interceptors.response(response)
            : response;
        } else {
          return interceptors.error
            ? interceptors.error(response)
            : Promise.reject(response);
        }
      },
      error => {
        return interceptors.error
          ? interceptors.error(error)
          : Promise.reject(error);
      }
    );
  };
}
