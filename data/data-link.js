export default class DataLink {

  constructor({kind, foreignKey, resolveTo, dataSource, batchLoader}) {
    this.kind = kind;
    this.foreignKey = foreignKey;
    this.resolveTo = resolveTo;
    this.dataSource = dataSource;
    this.batchLoader = batchLoader;
  }

  resolve(items) {
    var fk = this.foreignKey;
    var foreignKeys = items
      .map((item)=>item[fk])
      .filter((key)=> null !== key && undefined !== key);

    return this
      .batchLoader
      .load(foreignKeys)
      .then(this._fillResolvedItems.bind(this, items));
  }

  _fillResolvedItems(items, foreignItems) {
    console.trace('todo');
    return items;
  }

}


DataLink.single = 'single';
DataLink.multiple = 'multiple';
