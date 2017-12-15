export default (defaultInterceptors = {}) => {
  const interceptors = {
    error: new Set(),
    request: new Set(),
    response: new Set(),
  };

  const api = {
    // -----
    request: request =>
      [...interceptors.request].reduce((request, cb) => cb(request), request),

    // -----
    error: error =>
      [...interceptors.error].reduce(
        (error, cb) => error.then(err => cb(err)),
        Promise.resolve(error)
      ),

    // -----
    response: response =>
      [...interceptors.response].reduce((response, cb) => {
        return response.then(res => cb(res));
      }, Promise.resolve(response)),

    // -----
    // -----

    addErrorInterceptor: cb => {
      interceptors.error.add(cb);
      return () => interceptors.error.delete(cb);
    },
    addRequestInterceptor: cb => {
      interceptors.request.add(cb);
      return () => interceptors.request.delete(cb);
    },
    addResponseInterceptor: cb => {
      interceptors.response.add(cb);
      return () => interceptors.response.delete(cb);
    },
  };

  if (defaultInterceptors.request) {
    api.addRequestInterceptor(defaultInterceptors.request);
  }

  if (defaultInterceptors.error) {
    api.addErrorInterceptor(defaultInterceptors.error);
  }

  if (defaultInterceptors.response) {
    api.addResponseInterceptor(defaultInterceptors.response);
  }

  return api;
};
