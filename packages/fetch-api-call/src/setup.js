import regeneratorRuntime from 'regenerator-runtime';
import api from 'bivrost/http/api';

import createInterceptors from './createInterceptors';
export default ({ adapter, ...defaults }) => ({
  headers,
  mode,
  // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
  request = {
    ...defaults.request,
    ...request,
  },
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
        ...request,
      }),
      deduplicate: defaults.hasOwnProperty('deduplicate')
        ? defaults.deduplicate
        : true,
      ...options,
    }),
  };
};
