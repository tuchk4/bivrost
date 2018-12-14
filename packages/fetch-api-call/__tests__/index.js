import fetchApiCall from '../src';

describe('fetchApiCall', () => {
  it('should process error', () => {
    const { api, interceptors } = fetchApiCall({
      protocol: 'http:',
      host: 'httpbin.org',
    });

    const badRequest = api('GET /status/:status');
    const thenMock = jest.fn();

    return badRequest({
      status: 402,
    })
      .then(thenMock)
      .catch(e => {
        expect(e).toEqual('Fuck you, pay me!');
      })
      .then(() => {
        expect(thenMock.mock.calls.length).toEqual(0);
      });
  });

  it('should process request options', () => {
    const { api, interceptors } = fetchApiCall({
      protocol: 'http:',
      host: 'httpbin.org',
      request: {
        credentials: 'include',
      },
    });

    const request = api('GET /response-headers');

    return request({
      status: 200,
    }).then(r => {
      console.log(r);
    });
  });

  it('should pass post body', () => {
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

  it('should run call with custom headers 1', () => {
    const { api, interceptors } = fetchApiCall({
      protocol: 'http:',
      host: 'httpbin.org',
    });

    const withCustomHeaders = api('GET /headers');

    return withCustomHeaders(
      {},
      {
        headers: { 'x-with-custom-header': '123' },
      }
    ).then(res => {
      expect(res.headers['X-With-Custom-Header']).toEqual('123');
    });
  });

  it('should run call with custom headers 2', () => {
    const { api, interceptors } = fetchApiCall({
      protocol: 'http:',
      host: 'httpbin.org',
    });

    const withCustomHeaders = api('GET /headers', {
      headers: {
        'x-with-custom-header-2': '345',
      },
    });

    return withCustomHeaders(
      {},
      {
        headers: { 'x-with-custom-header': '123' },
      }
    ).then(res => {
      expect(res.headers['X-With-Custom-Header']).toEqual('123');
      expect(res.headers['X-With-Custom-Header-2']).toEqual('345');
    });
  });
});
