import axios from 'axios';

const DEFAULT_ADAPTER_OPTIONS = {};

const DEFAULT_ADAPTER_INTERCEPTORS = {};

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
      headers: {
        ...(adapterOptions.headers || {}),
        ...(requestOptions.headers || {}),
      },
    };

    if (requestOptions.body) {
      config.data = requestOptions.body;
    }

    if (requestOptions.query) {
      config.params = requestOptions.query;
    }

    let request = {
      ...config,
      url,
      method: requestOptions.method,
    };

    if (adapterIntinterceptors.request) {
      request = adapterIntinterceptors.request(request);
    }

    return axios(request).then(
      response => {
        return adapterIntinterceptors.response
          ? adapterIntinterceptors.response(response)
          : response;
      },
      error => {
        return adapterIntinterceptors.error
          ? adapterIntinterceptors.error(error)
          : Promise.reject(error);
      }
    );
  };
}
