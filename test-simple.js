import assert from 'assert';
import { log, errorLog } from './util';
import DataSource from './data/source';
import HttpBin from './http-bin';



// function testApi() {
//   function transformRequest(req) {
//     return Promise.resolve({
//       o_O: req.foo
//     });
//   }

//   function transformResponse(res) {
//     return res.json;
//   }

//   let testMe = Method(HttpBin('POST /post'), [ transformRequest ], [ transformResponse ]);

//   log('request...');
//   testMe({
//     foo: 'bar'
//   }).then(log, errorLog);
// }

// let DS_All = DataSource.extend({
//   api: {
//     post: HttpBin('POST /post'),
//     get: HttpBin('GET /get')
//   },
//   call: {
//     highLevelMethod: function () {
//       return this.post({
//         Foo: this.options.a,
//         Bar: 200
//       });
//     }
//   },
//   serialize: {
//     post: req => ({foo: req.Foo, bar: req.Bar}),
//     get:  req => ({foo: req.Foo, bar: req.Bar}),
//   },
//   unserialize: {
//     post: res => res.json,
//     get:  res => res.args
//   },
//   cache: {
//     get: true,
//   }
// });

let DS_A = DataSource.extend({
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
});

let DS_B = DS_A.extend({
  props: {
    highLevelMethod: function () {
      return this.post({Foo: this.options.a, Bar: 200});
    }
  },
});

let DS_C = DS_B.extend({
  api: {
    post: HttpBin('POST /post'),
    get: HttpBin('GET /get')
  },
});



// ds.post({foo: 1, bar: 2}).then(log, errorLog);

var ds = new DS_C({
  a : 100
});
ds.highLevelMethod().then(log, errorLog);
