import qs from 'qs';
import 'isomorphic-fetch';

const DEFAULT_ADAPTER_OPTIONS = {
  queryFormat: {
    arrayFormat: 'brackets',
  },
};

const DEFAULT_ADAPTER_INTERCEPTORS = {
  response: response => {
    const headers = response.headers;
    const contentType = headers.get('content-type');

    let action = null;

    if (contentType && contentType.indexOf('application/json') !== -1) {
      action = () => response.json();
    } else {
      action = () => response.text();
    }

    if (response.ok) {
      return action();
    } else {
      return Promise.reject(response);
    }
  },
};

export default function fetchAdapter({ interceptors = {}, ...options } = {}) {
  const adapterOptions = {
    ...DEFAULT_ADAPTER_OPTIONS,
    ...options,
  };

  const adapterIntinterceptors = {
    ...DEFAULT_ADAPTER_INTERCEPTORS,
    ...interceptors,
  };

  return function(url, requestOptions = {}) {
    const config = {
      ...adapterOptions,
      ...requestOptions,
      headers: new Headers({
        ...(adapterOptions.headers || {}),
        ...(requestOptions.headers || {}),
      }),
    };

    if (requestOptions.body) {
      if (requestOptions.body instanceof FormData) {
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

    if (adapterIntinterceptors.request) {
      request = adapterIntinterceptors.request(request);
    }

    return fetch(request).then(
      response => {
        if (response.ok) {
          return adapterIntinterceptors.response
            ? adapterIntinterceptors.response(response)
            : response;
        } else {
          return adapterIntinterceptors.error
            ? adapterIntinterceptors.error(response)
            : Promise.reject(response);
        }
      },
      error => {
        return adapterIntinterceptors.error
          ? adapterIntinterceptors.error(error)
          : Promise.reject(error);
      }
    );
  };
}
