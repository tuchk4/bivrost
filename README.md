# Bridge (data layer for JS applications)

Bridge allows to organize a simple interface to asyncronous APIs.

The main idea of bridge is grouping several API methods into data-sources.
Each data-source is ES6 class.

## Installation

## Usage

```JS
import DataSource from 'bridge/data/source';

class People extends DataSource {
  methodProperties() {
    return {
      api: {
        getItem: Api('GET /people/:id'),
        getList: Api('GET /people/'),
        create : Api('POST /people/'),
        update : Api('PUT /people/:id'),
      },
      prepare: {},
      serialize: {},
      unserialize: {},
      process: {},
      cache: {
        getItem: {
          enabled: true
        },
        getList: {
          enabled: true
        }
      }
    };
  }
  properties() {
    cache: {
      ttl: 60000
    }
  }
}

let people = new People();
people.getItem({id: 100})
  .then((person) => people.update(Object.assign({}, person, {name: 'Jack'})))
  .then(()=>console.log('done'));

```
