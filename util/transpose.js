/*
{
  a : {
    one: 1,
    two: 2
  }
  b : {
    one: 100,
    two: 200
  }
}


{
  one: {
    a: 1,
    b: 100
  }
  two: {
    a: 2,
    b: 200
  }
}
*/

export default function transpose(obj) {
  return Object.keys(obj)
    .reduce((res, key) => {
      let child = obj[key];
      Object.keys(child)
        .forEach((childKey) => {
          if (!res[childKey]) {
            res[childKey] = {};
          }
          res[childKey][key] = child[childKey];
        });
      return res;
    }, {});
}
