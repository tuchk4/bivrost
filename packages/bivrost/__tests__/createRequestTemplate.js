import createRequestTemplate from '../src/http/createRequestTemplate';

describe('Request template', () => {
  let getPOSTrequest = null;
  let getGETrequest = null;

  beforeEach(() => {
    getPOSTrequest = createRequestTemplate('POST /user/:id');
    getGETrequest = createRequestTemplate('GET /user/:id');
  });

  it('apply POST request', () => {
    const request = getPOSTrequest({
      id: 1,
      name: 'Thor',
    });

    expect(request).toEqual({
      query: {},
      path: '/user/1',
      method: 'POST',
      body: {
        name: 'Thor',
      },
    });
  });

  it('apply GET request', () => {
    const request = getGETrequest({
      id: 1,
      name: 'Thor',
    });

    expect(request).toEqual({
      query: {
        name: 'Thor',
      },
      path: '/user/1',
      method: 'GET',
    });
  });

  it('should throw exception if not enough bound params', () => {
    expect(() => {
      getGETrequest({
        name: 'Thor',
      });
    }).toThrow();
  });
});
