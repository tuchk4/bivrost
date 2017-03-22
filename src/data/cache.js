class CacheRecord {
  constructor(value, ttl) {
    this.value = value;
    this.exp = ttl + Date.now();
  }

  isExpired(now = Date.now()) {
    return now > this.exp;
  }
}

export default class Cache {
  records = new Map();

  constructor({ ttl = 60000 } = {}) {
    this.ttl = ttl;
  }

  get(id) {
    if (this.has(id)) {
      return this.records.get(id).value;
    }

    return null;
  }

  has(id) {
    let has = false;

    if (this.records.has(id)) {
      const record = this.records.get(id);

      if (record.isExpired()) {
        this.records.delete(id);
        has = false;
      } else {
        has = true;
      }
    }

    return has;
  }

  put(id, value, ttl = this.ttl) {
    const record = new CacheRecord(value, ttl);
    this.records.set(id, record);
  }

  clear(id) {
    if (id) {
      this.records.delete(id);
    } else {
      this.records = new Map();
    }
  }
}
