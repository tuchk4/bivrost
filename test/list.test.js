import assert from 'assert';
import { log, errorLog } from './util';
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
      idField: 'id'
    };
  }

  // methodProperties() {
  //   return {
  //     cache: {
  //       getList: {
  //         ttl: 60000
  //       },
  //       getItem: {
  //         ttl: 60000
  //       }
  //     }
  //   }
  // }

  resourceProperties() {
    return {
      api: {
        getList: MockApiGetList,
        getItem: MockApiGetItem,
      }
    };
  }
}

var ds = new DS();

ds.getItemById(2)
  .then(log, errorLog)
  .then(()=>log(ds));


