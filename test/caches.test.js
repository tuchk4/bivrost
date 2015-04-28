import assert from 'assert';
import DataSource from '../data/source';


describe('Cache', () => {

  it('should be able to work per-class', () => {
    class DS extends DataSource {
      methodProperties() {
        return {
          cache: {
            foo: {
              enabled: true
            }
          }
        };
      }
      properties() {
        return {
          cache: {
            isGlobal: true
          }
        };
      }
    }
    let ds0 = new DS();
    let ds1 = new DS();
    assert.equal(ds0.caches.foo, ds1.caches.foo);
  });

  it('should be able to work per-instance', () => {
    class DS extends DataSource {
      methodProperties() {
        return {
          cache: {
            foo: {
              enabled: true
            }
          }
        };
      }
      properties() {
        return {
          cache: {
            isGlobal: false
          }
        };
      }
    }
    let ds0 = new DS();
    let ds1 = new DS();
    assert.notEqual(ds0.caches.foo, ds1.caches.foo);
  });
});
