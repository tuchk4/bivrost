import axiosAdapter from '../src';

const httpbin = 'http://httpbin.org';

describe('Adapter', () => {
  const requestInterceptor = jest.fn(req => req);
  const responsetInterceptor = jest.fn(res => res);

  const axiosApi = axiosAdapter({
    interceptors: {
      request: requestInterceptor,
      response: responsetInterceptor,
    },
  });

  const query = {
    foo: 'bar',
  };

  it('GET request', () => {
    return axiosApi(`${httpbin}/get`, {
      method: 'GET',
      query: {
        ...query,
      },
    }).then(response => {
      expect(response.data.args).toEqual({
        ...query,
      });

      expect(requestInterceptor.mock.calls.length).toEqual(1);
      expect(responsetInterceptor.mock.calls.length).toEqual(1);
    });
  });
});
