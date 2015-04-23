export default function deepExtend(source, extensions) {
  let sourceKeys = Object.keys(source);
  let extKeys = Object.keys(extensions);

  var restExtKeys = extKeys.reduce((keys, key) => {
    if (!(key in source)) {
      keys.push(key);
    }
    return keys;
  }, []);

  let allKeys = sourceKeys.concat(restExtKeys);

  return allKeys.reduce((result, key)=>{
    result[key] = Object.assign({}, source[key], extensions[key]);
    return result;
  }, {});


};
