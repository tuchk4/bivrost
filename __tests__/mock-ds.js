import DataSource from '../src/data/source';
import mockDs from '../src/utils/mock-data-source';

class DS extends DataSource {
  static steps = ['serialize', 'api'];

  static serialize = {
    loadAll: ({ groupId }) => Promise.resolve({
      g: groupId
    })
  };

  static api = {
    loadAll: input => Promise.resolve(input)
  }

  loadAll(props) {
    return this.invoke('loadAll', props);
  }
};

describe('Datasource steps mock', () => {
  let ds = null;

  beforeEach(() => {
    ds = new DS();
  });

  it('should mock ds steps', () => {
    const mocks = mockDs(ds, step => jest.fn(step));

    ds.loadAll({
      groupId: 5
    }).then(() => {

      expect(mocks.serialize.loadAll.mock.calls.length).toEqual(1);
      expect(mocks.serialize.loadAll.mock.calls[0][0]).toEqual({
        groupId: 5
      });

      expect(mocks.api.loadAll.mock.calls[0][0]).toEqual({
        g: 5
      });
    });
  });
});
