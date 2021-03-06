import Url from 'url';

const getUniqueBindings = (queryBindings, pathBindings) =>
  new Set([...queryBindings, ...pathBindings]);

const buildQuery = (queryBindings, queryDefaults, paramsMap) => {
  let query = {};

  for (let def of queryDefaults) {
    query[def.key] = def.value;
  }

  for (let key of queryBindings) {
    if (paramsMap.has(key)) {
      query[key] = paramsMap.get(key);
    }
  }

  return query;
};

const buildPath = (path, paramsMap) =>
  path.replace(/:([\w\d]+)/g, (str, paramName) => {
    if (!paramsMap.has(paramName)) {
      throw new Error(
        `could not build path ("${path}") - param "${paramName}" does not exist`
      );
    }

    return paramsMap.get(paramName);
  });

const buildUnboundParams = (exceptParamsSet, paramsMap) => {
  const newParams = {};

  paramsMap.forEach((value, key) => {
    if (exceptParamsSet.has(key)) {
      return;
    }

    newParams[key] = value;
  });

  return newParams;
};

const fNot = f => a => !f(a);

const getTemplateBinding = str => {
  let matches = str.match(/^:([\w\d]+)$/);
  return matches ? matches[1] : null;
};

const extractQueryBindings = url => {
  return Object.keys(url.query)
    .map(getTemplateBinding)
    .filter(it => it !== null);
};

const extractQueryDefaults = url => {
  return Object.keys(url.query)
    .filter(fNot(getTemplateBinding))
    .map(it => [it, url.query[it]]);
};

const extractPathBindings = url => {
  return url.pathname
    .split('/')
    .map(getTemplateBinding)
    .filter(it => it !== null);
};

const extractMethodAndUrl = templateString => {
  const parts = templateString.match(/^([a-z]+)\s(.+)$/i);
  let method = 'GET';
  let url = templateString;

  if (parts) {
    method = parts[1].toUpperCase();
    url = parts[2];
  }

  return [method, url];
};

const getParamsMap = params => {
  const paramsMap = new Map();
  for (const key of Object.keys(params)) {
    paramsMap.set(key, params[key]);
  }

  return paramsMap;
};

const parseRequestTemplate = templateString => {
  const [httpMethod, urlTemplate] = extractMethodAndUrl(templateString);

  const url = Url.parse(urlTemplate, true);
  const queryBindings = extractQueryBindings(url);
  const queryDefaults = extractQueryDefaults(url);
  const pathBindings = extractPathBindings(url);

  return {
    httpMethod,
    queryBindings,
    queryDefaults,
    pathBindings,
    path: url.pathname,
  };
};

const methodsWithBody = new Set(['POST', 'PUT', 'PATCH']);

export default function getRequestTemplate(template) {
  const {
    httpMethod,
    queryBindings,
    queryDefaults,
    pathBindings,
    path,
  } = parseRequestTemplate(template);

  const uniqueBindings = getUniqueBindings(queryBindings, pathBindings);

  return function getRequest(params = {}) {
    const isIterable = params.forEach instanceof Function;

    let templateParams = null;

    if (isIterable) {
      params.forEach((value, key) => {
        templateParams[key] = value;
      });
    } else {
      templateParams = params;
    }

    let paramsMap = getParamsMap(templateParams);

    let request = {};

    let unboundQuery = {};

    if (methodsWithBody.has(httpMethod)) {
      request.body = !isIterable
        ? buildUnboundParams(uniqueBindings, paramsMap)
        : params;
    } else {
      unboundQuery = !isIterable
        ? buildUnboundParams(uniqueBindings, paramsMap)
        : params;
    }

    return {
      ...request,
      query: {
        ...buildQuery(queryBindings, queryDefaults, paramsMap),
        ...unboundQuery,
      },
      path: buildPath(path, paramsMap),
      method: httpMethod,
    };
  };
}
