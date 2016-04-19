import ClientRequest from './client-request';

const CLIENT_REQUEST_SETUP_ERROR = 'CLIENT_REQUEST_SETUP_ERROR';

/**
 * @param template - http path template. 'GET /users' 'POST /user/:id'
 * @param options - additional api options. (headers, adapter)
 * @returns {fn}
 */
function api(template, options = {}) {
  const clientRequest = new ClientRequest(template, options);

  let fn = function(params) {
    let error = null;

    try {
      var {url, request} = clientRequest.getRequestOptions(params);
    } catch (e) {
      error = {
        ok: false,
        message: e.message,
        type: CLIENT_REQUEST_SETUP_ERROR,
        error: e
      }
    }

    if (error) {
      return Promise.reject(error);
    } else {
      return clientRequest.execute(url, request);
    }
  };

  fn.displayName = `API: ${template}`;

  return fn;
}


export default (apiCommonOptions = {}) => {
  return (url, apiOptions = {}) => api(url, {
    // merge options
    ...apiCommonOptions,
    ...apiOptions,
    // merge headers
    headers: {
      ...(apiCommonOptions.headers || {}),
      ...(apiOptions.headers || {})
    }
  });
};
