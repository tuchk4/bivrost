import fetchApiCall from '../src';

describe('fetchApiCall', () => {
  it('should', () => {
    const { api, interceptors } = fetchApiCall({
      protocol: 'http:',
      host: 'httpbin.org',
    });

    const login = api('POST /post');
    const data = { foo: 'bar' };

    return login(data).then(res => {
      expect(res.json).toEqual(data);
    });
  });

  it('should run call with custom headers', () => {
    const { api, interceptors } = fetchApiCall({
      protocol: 'http:',
      host: 'httpbin.org',
    });

    const withCustomHeaders = api('GET /headers');

    return withCustomHeaders(
      {},
      {
        'x-with-custom-header': '123',
      }
    ).then(res => {
      expect(res.headers['X-With-Custom-Header']).toEqual('123');
    });
  });
});
