import DataSource from '../src/data/source';


describe('Cache', () => {

  it('default cache', () => {
    class DS1 extends DataSource {
      static defaultCache = {
        isGlobal: true,
        ttl: 1
      };

      static cache = {
        foo: {enabled: true}
      }
    }

    class DS2 extends DS1 {
      static defaultCache = {
        ttl: 10
      };
    }


    let ds2 = new DS2();
    expect(ds2.getCache('foo').ttl).toBe(10);

    let ds1 = new DS1();
    expect(ds1.getCache('foo').ttl).toBe(1);

    expect(ds1.constructor.defaultCache).toEqual({
      ttl: 1,
      isGlobal: true,
    });
    expect(DS1.defaultCache).toEqual({
      ttl: 1,
      isGlobal: true,
    });

    expect(ds2.constructor.defaultCache).toEqual({
      ttl: 10,
    });
    expect(DS2.defaultCache).toEqual({
      ttl: 10,
    });
  });

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
