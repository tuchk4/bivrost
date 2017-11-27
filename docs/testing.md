## Mock data source steps and methods

Suggest to use [jest](https://facebook.github.io/jest/) for testing. It is
really painless javascript unit testing library with code coverage and perfects
mocks.

Example data source:

```js
export default class UsersDataSource extends DataSource {
  static steps = ['serialize', 'api'];

  static serialize = {
    loadAll: ({ groupId }) => ({
      g: groupId,
    }),
  };

  static api = {
    loadAll: api('GET /users'),
  };

  loadAll(props) {
    return this.invoke(props);
  }
}
```

Example data source test:

```js
import UsersDataSource from 'data/sources/users';
import mockDataSource from 'bivrost/utils/mock-data-source';

describe('Datasource steps mock', () => {
  let ds = null;

  beforeEach(() => {
    ds = new UsersDataSource();
  });

  it('should mock ds steps', () => {
    const mocks = mockDataSource(ds, step => jest.fn(step));

    ds
      .loadAll({
        groupId: 5,
      })
      .then(() => {
        expect(mocks.serialize.loadAll.mock.calls.length).toEqual(1);
        expect(mocks.serialize.loadAll.mock.calls[0][0]).toEqual({
          groupId: 5,
        });

        expect(mocks.api.loadAll.mock.calls[0][0]).toEqual({
          g: 5,
        });
      });
  });
});
```
