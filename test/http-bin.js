import axios from 'axios';
import HttpAdapterAxios from '../http/adapter/axios';
import Api from '../http/Api';

const HttpBin = Api.extend({
  base: 'http://httpbin.org',
  adapter: HttpAdapterAxios(axios),
});

export default HttpBin;
