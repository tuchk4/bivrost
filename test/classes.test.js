import assert from 'assert';
import { log, errorLog } from './util';
import DataSource from '../data/source';
import HttpBin from './http-bin';



class DS_A extends DataSource {
  post(params) {
    return this.resource.post(params);
  }

  get(params) {
    return this.resource.get(params);
  }

  createResource() {
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
  createResource() {
    return {
      api: {
        post: HttpBin('POST /post'),
        get: HttpBin('GET /get')
      },
    }
  }
}

//--

let ds = new DS_C({a:8888});

ds.highLevelMethod().then(log, errorLog);
