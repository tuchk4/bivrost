import ClientRequest from './client-request';

const processHttpResponse = httpResponse => httpResponse.data;
const processHttpError = httpErrorResponse => Promise.reject(httpErrorResponse);

function api(template, options = {}) {
  var client = new ClientRequest(template, options);

  var fn = function(params) {
    return client
      .execute(params)
      .then(processHttpResponse, processHttpError);
  };

  fn.displayName = `API: ${template}`;

  return fn;
}

export default defaultOptions => {
  return (url, options = {}) => api(url, {
    ...defaultOptions,
    ...options
  });
};
