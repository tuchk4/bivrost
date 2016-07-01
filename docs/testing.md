# Store all steps as separated functions

It is easy to test each data source step separately. Do not need to test all together because data sources are already under 
unit tests. You should write test for your code - serialization, request preparation, response processing etc.

```js
export const prepareList = params => { 
  //... 
};

export const processList = list => { 
  //... 
};

class UserDataSource extends DataSource {
  static prepare = {
    list: prepareList
  }
  
  static api = {
    list: api('GET /users/list')
  }
  
  static process = {
    list: processList
  }
}
```

```js
import {prepareList, processList} from './data-source';
jest.unmock('./data-source');

describe('Data source steps', () => {  
  it('should prepare request', () => {
    const params  = {
      // ...
    };
    
    expect(prepareList(params)).toEqual({
      // ...  
    });
  });
  
  it('should process response', () => {
    const responseFixture  = {
      // ...
    };

    expect(processList(responseFixture)).toEqual({
      // ...  
    });
  });
});
```

# Invoke flow testing

Example data source:

```js
import DataSource from 'bivrost/data/source';

class UsersDataSource extends DataSource {
  static prepare = {
    list: (params) => {
       return {
         filters: JSON.stringify(params)        
       }
    }
  };
  
  static api = {
    list: api('GET /users/list')
  };
  
  static process = {
    list: processList
  };
}
```

### Test invoke result

Mock XHR steps and test API calls arguments and invoke result 

```js
import UsersDataSource from './users-data-source';

describe('Data source steps', () => {
  let usersDataSource = null;
  let listApiMock  = null;
  
  beforeEach(() => {
    // mock all xhr steps
    listApiMock = jest.fn(() => {
      return LIST_FIXTURE;
    });
  
    userDataSource.constructor.api = {
      list: listApiMock
    };
  
    usersDataSource = new UsersDataSource();
  });
  
  pit('data source invoke', () => {
    const params = {
      // ...
    };

    return userDataSource.getList(params).then(list => {
      expect(list).toEqual({
        // ...
      });
    
      expect(listApiMock.mock.calls.length).toEqual(1);
      expect(listApiMock.mock.calls[0][0]).toEqual({
        filters: JSON.stringify(params)
      });
    });
  });
});
```

### Export standalone method step function

```js
import exportInvokeStep from 'bivrost/test-utils/export-invoke-step';
import UsersDataSource from './users-data-source';

describe('Data source steps', () => {
  let usersDataSource = null;
  
  beforeEach(() => {
    usersDataSource = new UsersDataSource();
  });
  
  it(() => {
    // "prepare" - step
    // "list" - method
    const listPrepare = exportInvokeStep(userDataSource, 'prepare', 'list');
    
  
    const params = {
      // ...
    };
    
    expect(listPrepare(params)).toEqual({
      // ....
    });
  });
});
```
