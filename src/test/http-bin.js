import axios from 'axios';
import axiosAdapter from '../http/adapter/axios';
import api from '../http/api';

const HttpBin = api({
  base: 'http://httpbin.org',
  adapter: axiosAdapter(axios)
});

export default HttpBin;
