import DataSource from '../src/data/source';


describe('Cache', () => {
  it('should be able to work per-class', () => {
    class DS extends DataSource {
      static cache = {
        foo: {
          isGlobal: true,
          enabled: true
        }
      };
    }

    let ds0 = new DS();
    let ds1 = new DS();

    expect(ds0.getCache('foo')).toBe(ds1.getCache('foo'));
  });

  it('should be able to work per-instance', () => {
    class DS extends DataSource {
      static cache = {
        foo: {
          isGlobal: false,
          enabled: true
        }
      };
    }

    let ds0 = new DS();
    let ds1 = new DS();

    expect(ds0.getCache('foo')).not.toBe(ds1.getCache('foo'));
  });
});
