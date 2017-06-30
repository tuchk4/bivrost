const DEFAULT_OPTIONS = {
  response: 0,
  request: 0,
  error: 0,
};

export default function delayAdapter(adapter, options = {}) {
  const delayOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const delayProxy = (isError, data) => {
    let delay = delayOptions.response;
    if (isError && delayOptions.error) {
      delay = delayOptions.error;
    }

    if (delay) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data);
        }, delay);
      });
    } else {
      return data;
    }
  };

  return function delayApi(...apiArguments) {
    const api = () =>
      adapter(...apiArguments).then(
        delayProxy.bind(null, false),
        delayProxy.bind(null, true)
      );

    if (delayOptions.request) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(api());
        }, delayOptions.request);
      });
    } else {
      return api();
    }
  };
}
