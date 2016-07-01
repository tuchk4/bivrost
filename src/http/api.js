import ClientRequest from './client-request';

const CLIENT_REQUEST_SETUP_ERROR = 'CLIENT_REQUEST_SETUP_ERROR';

/**
 * @param template - http path template. 'GET /users' 'POST /user/:id'
 * @param options - additional api options. (headers, adapter)
 * @returns {fn}
 */
function apiRequestTemplate(template, options = {}) {
  const clientRequest = new ClientRequest(template, options);

  let apiRequest = function(params) {
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

  apiRequest.displayName = `API: ${template}`;

  return apiRequest;
}

export default function api(apiCommonOptions = {}) {
  return (template, apiOptions = {}) => apiRequestSetup(template, {
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
