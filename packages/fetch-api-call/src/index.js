import regeneratorRuntime from 'regenerator-runtime';
import fetchAdapter from 'bivrost-fetch-adapter';
import setup from './setup';

function processResponse(response) {
  const headers = response && response.headers;

  if (headers) {
    const contentType = headers.get('content-type');

    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
    } else {
      return response.text();
    }
  }

  return response;
}

export default setup({
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
  adapter: fetchAdapter,
  interceptors: {
    error: async error => await processResponse(error),
    response: async response => await processResponse(response),
  },
});
