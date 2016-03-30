const DEFAULTS = {
  responseType: 'text',
  withCredentials: false
};

export default function axiosAdapter(axios, options = {}) {
  let requestOptions = {
    ...DEFAULTS,
    ...options
  };

  return function(url, request) {
    return axios({
      ...requestOptions,
      url: url,
      method: request.verb,
      params: request.query,
      data: request.body
    });
  }
};
