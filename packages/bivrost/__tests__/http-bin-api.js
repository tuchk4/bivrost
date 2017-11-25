import axiosAdapter from 'bivrost-axios-adapter';
import api from '../src/http/api';

const httpBinApi = api({
  protocol: 'https:',
  host: 'httpbin.org',
  adapter: axiosAdapter(),
});

export default httpBinApi;
