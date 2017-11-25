import regeneratorRuntime from 'regenerator-runtime';
import api from 'bivrost/http/api';
import fetchAdapter from 'bivrost-fetch-adapter';

import createIterceptors from './createIterceptors';

const DEFAULT_MODE = 'cors';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export default params => {
  const interceptors = createIterceptors();

  return {
    interceptors,
    api: api({
      adapter: fetchAdapter({
        ...params,
        mode: params.mode ? parmas.mode : DEFAULT_MODE,
        mode: params.headers ? parmas.headers : DEFAULT_HEADERS,
        interceptors: {
          request: request => interceptors.request(request),
          error: async error => {
            const json = await error.json();
            return Promise.reject(interceptors.error(json));
          },
          response: async response => {
            const json = await response.json();
            return interceptors.response(json);
          },
        },
      }),
    }),
  };
};
