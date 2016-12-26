import RequestTemplate from '../src/http/request-template';

describe('Request template', () => {
  let POSTrequest = null;
  let GETrequest = null;

  beforeEach(() => {
    POSTrequest = new RequestTemplate('POST /user/:id');
    GETrequest = new RequestTemplate('GET /user/:id');
  });

  it('hasBody', () => {
    expect(POSTrequest.hasBody()).toEqual(true);
    expect(GETrequest.hasBody()).toEqual(false);
  });

  it('apply POST request', () => {
    const request = POSTrequest.apply({
      id: 1,
      name: 'Thor'
    });

    expect(request).toEqual({
      query: {},
      path: '/user/1',
      method: 'POST',
      body: {
        name: 'Thor'
      }
    });
  });

  it('apply GET request', () => {
    const request = GETrequest.apply({
      id: 1,
      name: 'Thor'
    });

    expect(request).toEqual({
      query: {
        name: 'Thor'
      },
      path: '/user/1',
      method: 'GET'
    });
  });

  it('should throw exception if not enough bound params', () => {
    expect(() => {
      GETrequest.apply({
        name: 'Thor'
      });
    }).toThrow();
  });
});
