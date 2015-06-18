var defaults = {
  responseType: 'text',
  withCredentials: false
};

export default function AdapterAxios(axios, options = {}) {
  var requestOptions = Object.assign({}, defaults, options);

  return function(url, request) {
    var config = Object.assign({}, requestOptions, {
      url: url,
      method: request.verb,
      params: request.query,
      data: request.body,
    });

    return axios(config);
  }
};
