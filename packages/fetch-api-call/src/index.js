import regeneratorRuntime from 'regenerator-runtime';
import api from 'bivrost/http/api';
import fetchAdapter from 'bivrost-fetch-adapter';

import createInterceptors from './createInterceptors';

const DEFAULT_MODE = 'cors';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export default params => {
  const interceptors = createInterceptors();
  const headers = params.headers ? parmas.headers : DEFAULT_HEADERS;
  return {
    interceptors,
    api: api({
      adapter: fetchAdapter({
        mode: params.mode ? parmas.mode : DEFAULT_MODE,
        headers,
        interceptors: {
          request: request => interceptors.request(request),
          error: async error => {
            console.log(error);
            // if (res.headers.contentType === 'application/json')
            const json = await error.json();
            return Promise.reject(interceptors.error(json));
          },
          response: async response => {
            const json = await response.json();
            return interceptors.response(json);
          },
        },
      }),
      ...params,
    }),
  };
};
