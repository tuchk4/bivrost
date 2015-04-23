export default class Cache {
  constructor({ ttl = 60000 } = {}) {
    this.ttl = ttl;
    this.items = {};
  }

  get(id) {
    var items = this.items;
    if (this.items.hasOwnProperty(id)) {
      var record = this.items[id];
      if (record.isExpired()) {
        this.remove(id);
        return null;
      }
      return record.value;
    }
    return null;
  }

  put(id, value, ttl = this.ttl) {
    this.items[id] = new CacheRecord(value, ttl);
  }

  remove(id) {
    delete this.items[id];
  }

  clear() {
    this.items = {};
  }
}

class CacheRecord {
  constructor(value, ttl) {
    this.value = value;
    this.exp = ttl + Date.now();
  }

  isExpired(now = Date.now()) {
    return now > this.exp;
  }
}
