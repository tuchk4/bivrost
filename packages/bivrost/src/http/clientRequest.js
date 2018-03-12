import createRequestTemplate from './createRequestTemplate';
import promiseDeduplicator from '../utils/promiseDeduplicator';
import api from './api';

const DEFAULT_OPTIONS = {
  protocol: 'http:',
};

const join = (...parts) =>
  parts
    .join('/')
    .replace(/[\/]+/g, '/')
    .replace(/\/\?/g, '?')
    .replace(/\/\#/g, '#')
    .replace(/\:\//g, '://');

const buildUrl = (protocol = 'http:', host, prefix, path) =>
  `${protocol}//${join(host, prefix, path)}`;

export default function clientRequest(template, options = {}) {
  const getRequest = createRequestTemplate(template);

  const adapter = options.adapter;

  function getRequestExecuteFunction(params = {}) {
    const request = getRequest(params);
    const url = buildUrl(
      options.protocol,
      options.host,
      options.prefix,
      request.path
    );

    return function executeRequest(headers = {}) {
      const promiseCreator = () =>
        adapter(url, {
          ...request,
          headers: {
            ...request.headers,
            ...headers,
          },
        });

      if (request.method === 'GET') {
        let dedupKey = JSON.stringify([request.method, url, request.query]);

        return promiseDeduplicator(dedupKey, promiseCreator);
      } else {
        return promiseCreator();
      }
    };
  }

  getRequestExecuteFunction.stringify = params => {
    const request = getRequest(params);
    const url = buildUrl(
      options.protocol,
      options.host,
      options.prefix,
      request.path
    );

    return url;
  };

  return getRequestExecuteFunction;
}
