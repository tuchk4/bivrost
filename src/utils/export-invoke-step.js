const isFunction = func => func && ({}).toString.call(func) === '[object Function]';

export default (dataSource, stepId, method) => {
  const step = dataSource.constructor[stepId];

  let stepFunction = null;
  if (isFunction(step)) {
    stepFunction = step;
  } else {
    stepFunction = step[method];
  }

  if (!stepFunction) {
    throw new Error(`There is no "${stepId}" step for "${method}" method`);
  }

  return input => stepFunction(input)
}
