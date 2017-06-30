import axiosAdapter from '../src';

const httpbin = 'http://httpbin.org';

describe('Adapter', () => {
  const axiosApi = axiosAdapter();
  const query = {
    foo: 'bar',
  };

  it('GET request', () => {
    return axiosApi(`${httpbin}/get`, {
      method: 'GET',
      query: {
        ...query,
      },

      // if run test in browser with custom headers - all is OK
      // but with node - will be [Network Error].
      // will investigate this a bit later

      //headers: {
      //  'X-test': 1
      //}
    }).then(response => {
      expect(response.data.args).toEqual({
        ...query,
      });
    });
  });
});
