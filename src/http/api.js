import ClientRequest from './client-request';

const CLIENT_REQUEST_SETUP_ERROR = 'CLIENT_REQUEST_SETUP_ERROR';

function api(template, options = {}) {
  const clientRequest = new ClientRequest(template, options);


  let fn = function(params) {
    let error = null;

    try {
      let {url, request} = clientRequest.getRequestOptions(params);
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

export default defaultOptions => {
  return (url, options = {}) => api(url, {
    ...defaultOptions,
    ...options
  });
};
