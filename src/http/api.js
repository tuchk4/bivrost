import ClientRequest from './client-request';


function Api(template, options = {}) {
  var client = new ClientRequest(template, options);

  var fn = function(params) {
    return client
      .execute(params)
      .then(processHttpResponse, processHttpError);
  };

  fn.displayName = `API: ${template}`;
  return fn;
}

Api.extend = function (defaultOptions) {
  return (url, options) =>
    Api(url, Object.assign({}, defaultOptions || {}, options || {}));
};

export default Api;
function processHttpResponse(httpResponse) {
  return httpResponse.data;
}

function processHttpError(httpErrorResponse) {
  return Promise.reject(httpErrorResponse);
}
