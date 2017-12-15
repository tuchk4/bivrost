import regeneratorRuntime from 'regenerator-runtime';
import api from 'bivrost/http/api';

import createInterceptors from './createInterceptors';

const DEFAULT_MODE = 'cors';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export default ({ adapter, ...defaults }) => ({
  headers,
  mode,
  ...options
}) => {
  const interceptors = createInterceptors(defaults.interceptors);

  return {
    interceptors,
    api: api({
      adapter: adapter({
        mode: mode ? mode : defaults.mode,
        headers: headers ? headers : defaults.headers,
        interceptors: {
          request: request => interceptors.request(request),
          error: async error => {
            throw await interceptors.error(error);
          },
          response: async response => await interceptors.response(response),
        },
      }),
      ...options,
    }),
  };
};
