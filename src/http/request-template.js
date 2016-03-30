import Url from 'url';


const getUniqueBindings = requestTemplate => new Set([
  ...requestTemplate.queryBindings,
  ...requestTemplate.pathBindings]
);

const buildQuery = (queryBindings, queryDefaults, params) => {
  let query = {};

  for (let def of queryDefaults) {
    query[def.key] = def.value;
  }

  for (let key of queryBindings) {
    if (key in params) {
      query[key] = params[key];
    }
  }

  return query;
};

const buildPath = (path, params) => path.replace(/:([\w\d]+)/g, (str, paramName) => params[paramName]);


const buildUnboundParams = (exceptParamsSet, params) => {
  return Object.keys(params)
    .filter(it => !exceptParamsSet.has(it))
    .reduce((newParams, key) => {
      newParams[key] = params[key];
      return newParams;
    }, {});
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
    let request = {};

    let query = buildQuery(this.queryBindings, this.queryDefaults, params);
    let path = buildPath(this.path, params);

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
