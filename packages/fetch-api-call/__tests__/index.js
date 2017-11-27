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
