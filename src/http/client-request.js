import RequestTemplate from './request-template';
import promiseDeduplicator from '../data/promise-deduplicator';

const DEFAULT_OPTIONS = {
  base: '',
  prefix: ''
};

const join = (...parts) => parts.join('/')
  .replace(/[\/]+/g, '/')
  .replace(/\/\?/g, '?')
  .replace(/\/\#/g, '#')
  .replace(/\:\//g, '://');

const buildUrl = (base, prefix, path) => join(base, prefix, path);

export default class ClientRequest {
  constructor(template, options = {}) {
    this.requestTemplate = new RequestTemplate(template);

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    this.http = options.adapter;
  }

  getRequestOptions(params) {
    const request = this.requestTemplate.apply(params);
    const url = buildUrl(this.options.base, this.options.prefix, request.path);

    return {url, request};
  }

  execute(url, request) {
    let promiseCreator = () => this.http(url, request);

    if (request.verb === 'GET') {
      let dedupKey = JSON.stringify([
        request.verb,
        url,
        request.query
      ]);

      return promiseDeduplicator(dedupKey, promiseCreator);
    } else {
      return promiseCreator();
    }
  }
}
