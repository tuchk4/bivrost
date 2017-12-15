import fileSaver from 'browser-filesaver';

const isFunction = func =>
  func && {}.toString.call(func) === '[object Function]';

export default function saveBlobAdapter(adapter) {
  return (url, params) => {
    return adapter(url, params).then(response => {
      return getFileName => {
        const filename = getFileName(url, params, response);

        if (!filename) {
          throw new Error('Bivrost save blob adapter: Empty file name');
        }

        const blob = new Blob([JSON.stringify(response)]);

        fileSaver.saveAs(blob, filename);

        return response;
      };
    });
  };
}
