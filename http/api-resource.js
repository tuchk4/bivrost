import Api from './api';

export default class ApiResource {

  constructor(methodsDict, options) {

    var apiMethodsDict = Object.keys(methodsDict)
      .map((name) => [name, methodsDict[name]])
      .map(([name, requestTemplate]) => [name, createApiMethod(requestTemplate, options)])
      .reduce((function(obj, [name, method]) {
        obj[name] = method;
        return obj
      }), {});
    Object.assign(this, apiMethodsDict);
  }

}


function createApiMethod(requestTemplate, options) {
  return Api(requestTemplate, options);
}
