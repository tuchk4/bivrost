import fileSaver from 'browser-filesaver';

const isFunction = func =>
  func && {}.toString.call(func) === '[object Function]';

export default function saveBlobAdapter(adapter) {
  return (url, params, options) => {
    return adapter(url, params, options).then(response => {
      let filename = options.filename;

      if (isFunction(filename)) {
        filename = filename(url, params, response);
      }

      if (!filename) {
        throw new Error('Bivrost save blob adapter: Empty file name');
      }

      const blob = new Blob([JSON.stringify(response)]);

      fileSaver.saveAs(blob, filename);

      return response;
    });
  };
}
