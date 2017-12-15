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

  if (adapterIntinterceptors.request) {
    axios.interceptors.request.use(adapterIntinterceptors.request);
  }

  const responseInterceptors = [];
  if (adapterIntinterceptors.response) {
    responseInterceptors.push(adapterIntinterceptors.response);
  }

  if (adapterIntinterceptors.error) {
    if (!responseInterceptors.length) {
      responseInterceptors.push(res => res);
    }

    responseInterceptors.push(adapterIntinterceptors.error);
  }

  axios.interceptors.response.use(...responseInterceptors);

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

    return axios({
      ...config,
      url,
      method: requestOptions.method,
    });
  };
}
