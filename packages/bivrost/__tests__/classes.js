import DataSource from '../src/data/source';
import httpBinApi from './http-bin-api';

function getClass() {
  class DS_A extends DataSource {
    static prepare = {
      post: req => ({ foo: req.Foo, bar: req.Bar }),
      get: req => ({ foo: req.Foo, bar: req.Bar }),
    };

    static process = {
      post: res => JSON.parse(res.data.data),
      get: res => res.args,
    };

    static cache = {
      get: {
        enabled: true,
      },
    };

    post(params) {
      return this.invoke('post', params);
    }

    get(params) {
      return this.invoke('get', params);
    }
  }

  class DS_B extends DS_A {
    highLevelMethod() {
      return this.post({
        Foo: this.options.a,
        Bar: 200,
      });
    }
  }

  class DS_C extends DS_B {
    static api = {
      post: httpBinApi('POST /post'),
      get: httpBinApi('GET /get'),
    };
  }

  return DS_C;
}

describe('Classes', () => {
  it('should generate auto invoke methods', () => {
    const ds = new class extends DataSource {
      static api = {
        load_user: httpBinApi('POST /post'),
      };
    }();

    return ds
      .invokeLoadUser({
        foo: 1,
      })
      .then(res => {
        expect(res.data.json).toEqual({
          foo: 1,
        });
      });
  });

  it('should make request with empty obj', () => {
    const ds = new class extends DataSource {
      static api = {
        load_user: httpBinApi('POST /post'),
      };
    }();

    return ds.invokeLoadUser().then(res => {
      expect(res.data.json).toEqual({});
    });
  });

  it('should pass context', () => {
    const processMock = jest.fn(props => ({
      ...props.data.json,
      fromProcess: 3,
    }));

    const prepareMock = jest.fn(props => {
      return {
        ...props,
        fromPrepare: 2,
      };
    });

    const ds = new class extends DataSource {
      static prepare = {
        load_user: prepareMock,
      };

      static process = {
        load_user: processMock,
      };

      static api = {
        load_user: httpBinApi('POST /post'),
      };
    }();

    return ds.invokeLoadUser({ bar: 1 }, { foo: 1 }).then(res => {
      expect(res.fromProcess).toEqual(3);

      expect(prepareMock.mock.calls.length).toEqual(1);
      expect(processMock.mock.calls.length).toEqual(1);

      expect(prepareMock.mock.calls[0][1]).toEqual({
        foo: 1,
      });

      expect(processMock.mock.calls[0][1]).toEqual({
        foo: 1,
      });
    });
  });

  it('should done XHR request with correct result', () => {
    let DS = getClass();

    let ds = new DS({
      options: {
        a: 8889,
      },
    });

    return ds
      .highLevelMethod()
      .catch(e => e)
      .then(res => {
        expect(res).toEqual({
          bar: 200,
          foo: 8889,
        });
      });
  });

  it('should pass headers from context', () => {
    const loadUserMock = jest.fn();

    const ds = new class extends DataSource {
      static api = {
        load_user: loadUserMock,
      };
    }({
      headers: {
        abc: 'zxc',
      },
    });

    return ds
      .invokeLoadUser({
        foo: 1,
      })
      .then(res => {
        expect(loadUserMock.mock.calls[0][0]).toEqual({
          foo: 1,
        });
        expect(loadUserMock.mock.calls[0][1]).toEqual({
          headers: {
            abc: 'zxc',
          },
        });
      });
  });
});
