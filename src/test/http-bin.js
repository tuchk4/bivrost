import axios from 'axios';
import axiosAdapter from 'bivrost-axios-adapter';
import api from '../http/api';

const HttpBin = api({
  base: 'http://httpbin.org',
  adapter: axiosAdapter(axios)
});

export default HttpBin;
