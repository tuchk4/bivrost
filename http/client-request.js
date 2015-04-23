import RequestTemplate from './request-template';
import PromiseDeduplicator from '../data/promise-deduplicator';

export default class ClientRequest {
  constructor(template, options = {}) {
    this.requestTemplate = new RequestTemplate(template);
    this.options = Object.assign({}, this.getDefaultOptions(), options);
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
        request.query,
      ]);
      return PromiseDeduplicator(dedupKey, promiseCreator);
    } else {
      return promiseCreator();
    }

  }

  getDefaultOptions() {
    return {
      base: '',
      prefix: '',
    }; //TODO!!!
  }
}

function buildUrl(base, prefix, path) {
  return `${ base }${ prefix }${ path }`;
}
