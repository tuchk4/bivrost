const isFunction = func => func && ({}).toString.call(func) === '[object Function]';

const mockDataSource = (ds, mockFn) => {
  const mocks = {};

  for (let stepId of ds.getSteps()) {
    if (isFunction(stepId)) {
      ds.constructor[stepId] = mockFn(ds.constructor[stepId]);
      mocks[stepId] = ds.constructor[stepId];
    } else {
      const stepConfig = ds.constructor[stepId] || {};
      mocks[stepId] = {};

      for (let methodId of Object.keys(stepConfig)) {
        stepConfig[methodId] = mockFn(stepConfig[methodId]);
        mocks[stepId][methodId] = stepConfig[methodId]
      }
    }
  }

  return mocks;
}

export default mockDataSource;
