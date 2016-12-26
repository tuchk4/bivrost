import RequestTemplate from './request-template';
import promiseDeduplicator from '../utils/promise-deduplicator';

const DEFAULT_OPTIONS = {
  protocol: 'http:'
};

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
      ...this.requestTemplate.apply(params)
    };

    const url = buildUrl(this.options.protocol, this.options.host, this.options.prefix, request.path);

    return { url, request };
  }

  execute(url, request, apiOptions) {
    const promiseCreator = () => this.adapter(url, request, apiOptions);

    if (request.method === 'GET') {
      let dedupKey = JSON.stringify([
        request.method,
        url,
        request.query
      ]);

      return promiseDeduplicator(dedupKey, promiseCreator);
    } else {
      return promiseCreator();
    }
  }
}
