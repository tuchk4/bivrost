import RequestTemplate from './request-template';
import promiseDeduplicator from '../data/promise-deduplicator';

const DEFAULT_OPTIONS = {
  protocol: 'http:'
};

const DEFAULT_INTERCEPTORS = {};

const join = (...parts) => parts.join('/')
  .replace(/[\/]+/g, '/')
  .replace(/\/\?/g, '?')
  .replace(/\/\#/g, '#')
  .replace(/\:\//g, '://');

const buildUrl = (protocol, host, prefix, path) => `${protocol}//${join(host, prefix, path)}`;

export default class ClientRequest {
  constructor(template, options = {}) {
    this.requestTemplate = new RequestTemplate(template);

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    this.adapter = options.adapter;
  }

  getRequestOptions(params) {
    const request = {
      ...this.requestTemplate.apply(params),
      headers: this.options.headers || {}
    };

    const url = buildUrl(this.options.protocol, this.options.host, this.options.prefix, request.path);

    return {url, request};
  }

  execute(url, request) {
    const interceptors = {
      ...DEFAULT_INTERCEPTORS,
      ...this.options.interceptors
    };

    let promiseCreator = () => this.adapter(url, request, interceptors);

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
