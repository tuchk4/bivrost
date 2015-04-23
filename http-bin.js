import Api from './http/Api';

const HttpBin = Api.withDefaults({
  base: 'http://httpbin.org'
});

export default HttpBin;
