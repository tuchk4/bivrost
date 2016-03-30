export default class DataLink {
  static single = 'single';
  static multiple = 'multiple';

  constructor({kind, foreignKey, resolveTo, dataSource, batchLoader}) {
    this.kind = kind;
    this.foreignKey = foreignKey;
    this.resolveTo = resolveTo;
    this.dataSource = dataSource;
    this.batchLoader = batchLoader;
  }

  resolve(items) {
    const fk = this.foreignKey;
    const foreignKeys = items
      .map(item => item[fk])
      .filter(key => null !== key && undefined !== key);

    return this
      .batchLoader
      .load(foreignKeys)
      .then((items, foreignItems) => {

        // TODO: fill resolved items
        return items;
      });
  }
}
