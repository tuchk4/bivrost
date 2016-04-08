import Url from 'url';

const getUniqueBindings = requestTemplate => new Set([
  ...requestTemplate.queryBindings,
  ...requestTemplate.pathBindings]
);

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

const buildPath = (path, paramsMap) => path.replace(/:([\w\d]+)/g, (str, paramName) => {
  if (!paramsMap.has(paramName)) {
    throw new Error(`could not build path ("${path}") - param "${paramName}" does not exist`);
  }

  return paramsMap.get(paramName);
});

// TODO: seems something wrong with this function
const isFormDataSupported = params => (typeof FormData !== 'undefined') && (params instanceof FormData);

const buildUnboundParams = (exceptParamsSet, params) => {
  let keys = null;

  const isArray = Array.isArray(params);
  const isFormData = isFormDataSupported(params);

  let initialValue = isArray ? [] : {};

  if (isFormData) {
    keys = params.entries();
    initialValue = new FormData();
  } else {
    keys = Object.keys(params);
  }

  return keys.filter(it => !exceptParamsSet.has(it))
    .reduce((newParams, key) => {
      if (isFormData) {
        newParams.append(key, params.get(key));
      } else if (isArray) {
        newParams.push(params[key]);
      } else {
        newParams[key] = params[key];
      }

      return newParams;
    }, initialValue);
};

const bodyVerbs = new Set(['POST', 'PUT', 'PATCH']);

const fNot = f => (a) => !f(a);

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
    .map(it => [it, query[it]]);
};

const extractPathBindings = url => {
  return url.pathname.split('/')
    .map(getTemplateBinding)
    .filter(it => it !== null);
};

const extractVerbAndUrl = templateString => {
  const parts = templateString.match(/^([a-z]+)\s(.+)$/i);
  let verb = 'GET';
  let url = templateString;

  if (parts) {
    verb = parts[1].toUpperCase();
    url = parts[2];
  }

  return [verb, url];
};

const getParamsMap = params => {
  let keys = null;

  const isFormData = isFormDataSupported(params);

  if (isFormData) {
    keys = params.entries();
  } else {
    keys = Object.keys(params);
  }

  return keys.reduce((paramsMap, key) => {
    if (isFormData) {
      paramsMap.set(key, params.get(key));
    } else {
      paramsMap.set(key, params[key]);
    }
    return paramsMap;
  }, new Map());
};

const parseRequestTemplate = templateString => {
  const [httpVerb, urlTemplate] = extractVerbAndUrl(templateString);

  const url = Url.parse(urlTemplate, true);
  const queryBindings = extractQueryBindings(url);
  const queryDefaults = extractQueryDefaults(url);
  const pathBindings = extractPathBindings(url);

  return {
    httpVerb,
    queryBindings,
    queryDefaults,
    pathBindings,
    path: url.pathname
  };
};

export default class RequestTemplate {
  constructor(templateString) {
    const { httpVerb, queryBindings, queryDefaults, pathBindings, path } = parseRequestTemplate(templateString);

    this.httpVerb = httpVerb;
    this.queryBindings = queryBindings;
    this.queryDefaults = queryDefaults;
    this.pathBindings = pathBindings;
    this.path = path;

    this.uniqueBindings = getUniqueBindings(this);
  }

  hasBody() {
    return bodyVerbs.has(this.httpVerb);
  }

  apply(params = {}) {
    if (isFormDataSupported(params)) {
      console.info('FormData may not be fully supported. Check https://developer.mozilla.org/en/docs/Web/API/FormData');
    }

    let paramsMap = getParamsMap(params);
    let request = {};

    let query = buildQuery(this.queryBindings, this.queryDefaults, paramsMap);
    let path = buildPath(this.path, paramsMap);

    let body, unboundQuery = {};

    if (this.hasBody()) {
      body = buildUnboundParams(this.uniqueBindings, params);
      request.body = body;
    } else {
      unboundQuery = buildUnboundParams(this.uniqueBindings, params)
    }

    return {
      ...request,
      query: {
        ...query,
        ...unboundQuery
      },
      path,
      verb: this.httpVerb
    };
  }
}
