jest.unmock('axios');
jest.unmock('bivrost-axios-adapter');
jest.unmock('../src/http/api');

import axios from 'axios';
import axiosAdapter from 'bivrost-axios-adapter';
import api from '../src/http/api';

const HttpBin = api({
  base: 'http://httpbin.org',
  adapter: axiosAdapter(axios)
});

export default HttpBin;
