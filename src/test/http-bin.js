import axios from 'axios';
import HttpAdapterAxios from '../http/adapter/axios';
import Api from '../http/api';

const HttpBin = Api.extend({
  base: 'http://httpbin.org',
  adapter: HttpAdapterAxios(axios),
});

export default HttpBin;
