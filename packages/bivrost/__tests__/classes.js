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
    class DS extends DataSource {
      static api = {
        load_user: httpBinApi('POST /post'),
      };
    }

    const ds = new DS();

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
    class DS extends DataSource {
      static api = {
        load_user: httpBinApi('POST /post'),
      };
    }

    const ds = new DS();

    return ds.invokeLoadUser().then(res => {
      expect(res.data.json).toEqual({});
    });
  });

  it('should pass context', () => {
    const process = jest.fn(props => {
      return {
        ...props,
        fromProcess: 3,
      };
    });

    const prepare = jest.fn(props => {
      return {
        ...props,
        fromPrepare: 2,
      };
    });

    class DS extends DataSource {
      static prepare = {
        load_user: prepare,
      };

      static process = {
        load_user: process,
      };

      static api = {
        load_user: httpBinApi('POST /post'),
      };
    }

    const ds = new DS();

    return ds.invokeLoadUser({ bar: 1 }, { foo: 1 }).then(res => {
      expect(prepare.mock.calls.length).toEqual(1);
      expect(process.mock.calls.length).toEqual(1);

      expect(prepare.mock.calls[0][1]).toEqual({
        foo: 1,
      });

      expect(process.mock.calls[0][1]).toEqual({
        foo: 1,
      });

      expect(process.mock.calls[0][0]).toEqual({
        bar: 1,
        fromPrepare: 2,
      });

      expect(res.fromProcess).toEqual(3);
    });
  });

  it('should done XHR request with correct result', () => {
    let DS = getClass();

    let ds = new DS({
      a: 8889,
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
});
