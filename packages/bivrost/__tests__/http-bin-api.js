import axiosAdapter from 'bivrost-axios-adapter';
import api from '../src/http/api';

const httpBinApi = api({
  protocol: 'https:',
  host: 'httpbin.org',
  adapter: axiosAdapter({
    interceptors: {
      request: request => {
        return request;
      },
      response: response => {
        return response;
      },
    },
  }),
});

export default httpBinApi;
