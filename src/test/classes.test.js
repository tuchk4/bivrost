import 'babel-core/polyfill';
import assert from 'assert';
import DataSource from '../data/source';
import HttpBin from './http-bin';


describe('Classes', () => {
  it('should work', (done) => {
    var DS = getClass();
    let ds = new DS({a:8889});
    ds.highLevelMethod()
      .then((res) => {
        assert.deepEqual(res, {
          bar: 200,
          foo: 8889
        });
      })
      .then(() => done(), done);
  });
});

function getClass() {
  class DS_A extends DataSource {
    post(params) {
      return this.invokeMethod('post', params);
    }

    get(params) {
      return this.invokeMethod('get', params);
    }

    methodProperties() {
      return {
        serialize: {
          post: req => ({foo: req.Foo, bar: req.Bar}),
          get:  req => ({foo: req.Foo, bar: req.Bar}),
        },
        unserialize: {
          post: res => res.json,
          get:  res => res.args
        },
        cache: {
          get: true,
        }
      };
    }
  }

  class DS_B extends DS_A {
    highLevelMethod() {
      return this.post({Foo: this.options.a, Bar: 200});
    }
  }

  class DS_C extends DS_B {
    methodProperties() {
      return {
        api: {
          post: HttpBin('POST /post'),
          get: HttpBin('GET /get')
        },
      }
    }
  }

  return DS_C;
}
