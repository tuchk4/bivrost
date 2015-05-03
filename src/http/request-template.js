import Url from 'url';

export default class RequestTemplate {
  constructor(templateString) {
    var {
      httpVerb, queryBindings, queryDefaults, pathBindings, path
      } = parseRequestTemplate(templateString);

    this.httpVerb = httpVerb;
    this.queryBindings = queryBindings;
    this.queryDefaults = queryDefaults;
    this.pathBindings = pathBindings;
    this.path = path;

    this.uniqueBindings = getUniqueBindings(this);
  }

  get hasBody() {
    return bodyVerbs.has(this.httpVerb);
  }

  apply(params = {}) {
    var request = {};

    var query = buildQuery(this.queryBindings, this.queryDefaults, params);
    var path = buildPath(this.path, params);
    var body, unboundQuery = {};
    if (this.hasBody) {
      body = buildUnboundParams(this.uniqueBindings, params);
      request.body = body;
    } else {
      unboundQuery = buildUnboundParams(this.uniqueBindings, params)
    }

    request.query = Object.assign({}, query, unboundQuery);
    request.path = path;
    request.verb = this.httpVerb;

    return request;
  }
}

//--------------------------------------------------------------------

var bodyVerbs = new Set(['POST', 'PUT', 'PATCH']);

function buildUnboundParams(exceptParamsSet, params) {
  return Object.keys(params)
    .filter((it) => !exceptParamsSet.has(it))
    .reduce((newParams, key) => {
      newParams[key] = params[key];
      return newParams;
    }, {});
}

function buildPath(path, params) {
  return path.replace(/:([\w\d]+)/g, (str, paramName) => params[paramName]);
}

function buildQuery(queryBindings, queryDefaults, params) {
  var query = {};
  for (let def of queryDefaults) {
    let [key, value] = def;
    query[key] = value;
  }
  for (let key of queryBindings) {
    if (key in params) {
      query[key] = params[key];
    }
  }
  return query;
}

//--------------------------------------------------------------------

function fNot(f) {
  return (a) => !f(a);
}

function getTemplateBinding(str) {
  var matches = str.match(/^:([\w\d]+)$/);
  return matches ? matches[1] : null;
}

function getUniqueBindings(requestTemplate) {
  return new Set(requestTemplate.queryBindings.concat(requestTemplate.pathBindings));
}

function extractQueryBindings(url) {
  var query = url.query;
  return Object.keys(query)
    .map(getTemplateBinding)
    .filter((it) => it !== null);
}

function extractQueryDefaults(url) {
  var query = url.query;
  return Object.keys(query)
    .filter(fNot(getTemplateBinding))
    .map((it) => [it, query[it]]);
}

function extractPathBindings(url) {
  return url.pathname.split('/')
    .map(getTemplateBinding)
    .filter((it) => it !== null);
}

function extractVerbAndUrl(templateString) {
  var parts = templateString.match(/^([a-z]+)\s(.+)$/i);
  var verb = 'GET';
  var url = templateString;
  if (parts) {
    verb = parts[1].toUpperCase();
    url = parts[2];
  }
  return [verb, url];
}

//POST /api/example/:id?foo=bar&:hell
export function parseRequestTemplate(templateString) {
  var [httpVerb, urlTemplate] = extractVerbAndUrl(templateString);

  var url = Url.parse(urlTemplate, true);
  var queryBindings = extractQueryBindings(url);
  var queryDefaults = extractQueryDefaults(url);
  var pathBindings = extractPathBindings(url);

  return {
    httpVerb,
    queryBindings,
    queryDefaults,
    pathBindings,
    path: url.pathname
  };
}
