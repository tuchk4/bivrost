import RequestTemplate from './request-template';
import promiseDeduplicator from '../data/promise-deduplicator';


const DEFAULT_OPTIONS = {
  base: '',
  prefix: ''
};

const buildUrl = (base, prefix, path) => `${ base }${ prefix }${ path }`;

export default class ClientRequest {
  constructor(template, options = {}) {
    this.requestTemplate = new RequestTemplate(template);

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    this.http = options.adapter;
  }

  execute(params) {
    var request = this.requestTemplate.apply(params);

    var url = buildUrl(this.options.base, this.options.prefix, request.path);

    var promiseCreator = () => this.http(url, request);

    if (request.verb === 'GET') {
      var dedupKey = JSON.stringify([
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
