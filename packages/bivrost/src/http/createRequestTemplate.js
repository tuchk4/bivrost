import FormData from 'form-data';
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

const buildUnboundParams = (exceptParamsSet, params = {}) => {
  const keys = params.entries ? params.entries() : Object.keys(params);
  const isIterator = !!params.entries;

  const newParams = isIterator ? new FormData() : {};

  for (const pair of keys) {
    const key = isIterator ? pair[0] : pair;

    if (exceptParamsSet.has(key)) {
      continue;
    }

    if (isIterator) {
      newParams.set(pair[0], pair[1]);
    } else {
      newParams[pair] = params[pair];
    }
  }

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
  const isIterator = !!params.entries;
  const keys = isIterator ? params.entries() : Object.keys(params);

  const paramsMap = new Map();
  for (const pair of keys) {
    if (isIterator) {
      paramsMap.set(pair[0], pair[1]);
    } else {
      paramsMap.set(pair, params[pair]);
    }
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

export default function getRequestTempalate(tempalte) {
  const {
    httpMethod,
    queryBindings,
    queryDefaults,
    pathBindings,
    path,
  } = parseRequestTemplate(tempalte);

  const uniqueBindings = getUniqueBindings(queryBindings, pathBindings);

  return function getRequest(params = {}) {
    let paramsMap = getParamsMap(params);
    let request = {};

    let unboundQuery = {};

    if (methodsWithBody.has(httpMethod)) {
      if (params instanceof FormData) {
        request = params;
      } else {
        request.body = buildUnboundParams(uniqueBindings, params);
      }
    } else {
      unboundQuery = buildUnboundParams(uniqueBindings, params);
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
