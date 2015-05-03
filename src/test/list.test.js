import 'babel-core/polyfill';
import assert from 'assert';
import DataSourceList from '../data/source/list';

const mockItems = [{
  id: 1,
  text: 'one',
}, {
  id: 2,
  text: 'two',
}];

function MockApiGetList(params) {
  return mockItems;
}

function MockApiGetItem(filters) {
  return mockItems.filter(item => item.id === filters.id)[0];
}


class DS extends DataSourceList {
  properties() {
    return {
      idField: 'id',
    };
  }

  methodProperties() {
    return {
      api: {
        getList: MockApiGetList,
        getItem: MockApiGetItem,
      },
      unserialize: {
        getList: res => res.items
      },
      cache: {
        getList: {
          ttl: 60000
        },
        getItem: {
          ttl: 60000
        }
      }
    }
  }
}


describe('List', () => {
  it('should work', (done) => {
    var ds = new DS();
    ds.getItemById(2)
      .then((res) => {
        assert.deepEqual(res, {
          id:2,
          text: 'two'
        });
      })
      .then(() => done(), done);
  });
});

describe('Cache', () => {
  it('should call api methods only once', (done) => {
      function spy(fn) {
        let sp = function (params) {
          sp.log.push(params);
          return fn(params);
        };
        sp.log = [];
        return sp;
      }
      let spied_MockApiGetItem = spy(MockApiGetItem);

      class DS extends DataSourceList {
        methodProperties() {
          return {
            api: {
              getItem: spied_MockApiGetItem
            }
          };
        }
      }
      var ds = new DS();

      assert.deepEqual(['getList', 'getItem'], Object.keys(ds.caches));

      ds.getItemById(1)
        .then(()=>ds.getItemById(2))
        .then(()=>ds.getItemById(1))
        .then(()=>{
          assert.deepEqual(spied_MockApiGetItem.log, [{
            id: 1
          }, {
            id: 2
          }]);
        })
        .then(() => done(), done);
  });
});

