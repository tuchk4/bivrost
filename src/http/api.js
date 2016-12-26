import ClientRequest from './client-request';

const CLIENT_REQUEST_SETUP_ERROR = 'CLIENT_REQUEST_SETUP_ERROR';

function apiRequestTemplate(template, apiCommonOptions = {}, apiOptions = {}) {
  const clientRequest = new ClientRequest(template, {
    ...apiCommonOptions,
    ...apiOptions
  });

  const apiRequest = function(params) {
    let error = null;

    try {
      var { url, request } = clientRequest.getRequestOptions(params);
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
      return clientRequest.execute(url, request, apiOptions);
    }
  };

  apiRequest.displayName = `API: ${template}`;

  return apiRequest;
}

export default function api(apiCommonOptions = {}) {
  return (template, apiOptions = {}) => apiRequestTemplate(template, apiCommonOptions, apiOptions);
};
