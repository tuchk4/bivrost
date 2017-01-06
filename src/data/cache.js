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
    if (this.records.has(id)) {
      const record = this.records.get(id);

      if (record.isExpired()) {
        this.records.delete(id);
        return null;
      }

      return record.value;
    }

    return null;
  }

  has(id) {
    return this.records.has(id);
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
