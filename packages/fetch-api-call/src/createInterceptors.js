export default () => {
  const interceptors = {
    error: new Set(),
    request: new Set(),
    response: new Set(),
  };

  return {
    request: request =>
      [...interceptors.request].reduce((request, cb) => cb(request), request),
    error: error =>
      [...interceptors.error].reduce((error, cb) => cb(error), error),
    response: response =>
      [...interceptors.response].reduce(
        (response, cb) => cb(response),
        response
      ),
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
};
