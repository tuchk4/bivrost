import delayAdapter from '../src';

jest.useFakeTimers();

describe('Delay adapter', () => {
  const resolveAdapter = jest.fn(() => Promise.resolve());
  const rejectAdapter = jest.fn(() => Promise.reject());

  const options = {
    all: {
      request: 100,
      response: 200,
      error: 300,
    },
    withoutError: {
      request: 100,
      response: 200,
    },
    onlyRequest: {
      request: 100,
    },
  };

  beforeEach(() => {
    setTimeout.mockClear();
  });

  it('resolve delay call', () => {
    const apiOptions = {
      ...options.all,
    };

    const delayApi = delayAdapter(resolveAdapter, apiOptions);

    const p = delayApi().then(() => {
      expect(setTimeout.mock.calls.length).toBe(2);
      expect(setTimeout.mock.calls[1][1]).toBe(apiOptions.response);
    });

    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(apiOptions.request);

    // run request timer
    jest.runOnlyPendingTimers();

    setImmediate(() => {
      // run response timer
      jest.runOnlyPendingTimers();
    });

    return p;
  });

  it('reject delay call', () => {
    const apiOptions = {
      ...options.all,
    };

    const delayApi = delayAdapter(rejectAdapter, apiOptions);

    const p = delayApi().then(() => {
      expect(setTimeout.mock.calls.length).toBe(2);
      expect(setTimeout.mock.calls[1][1]).toBe(apiOptions.error);
    });

    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(apiOptions.request);

    // run request timer
    jest.runAllTimers();

    setImmediate(() => {
      // run response timer
      jest.runAllTimers();
    });

    return p;
  });

  it('reject delay call without error timer', () => {
    const apiOptions = {
      ...options.withoutError,
    };

    const delayApi = delayAdapter(rejectAdapter, apiOptions);

    const p = delayApi().then(() => {
      expect(setTimeout.mock.calls.length).toBe(2);
      expect(setTimeout.mock.calls[1][1]).toBe(apiOptions.response);
    });

    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(apiOptions.request);

    // run request timer
    jest.runOnlyPendingTimers();

    setImmediate(() => {
      // run response timer
      jest.runOnlyPendingTimers();
    });

    return p;
  });

  it('resolve delay call with only request timer', () => {
    const apiOptions = {
      ...options.onlyRequest,
    };

    const delayApi = delayAdapter(rejectAdapter, apiOptions);

    const p = delayApi().then(() => {
      expect(setTimeout.mock.calls.length).toBe(1);
    });

    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(apiOptions.request);

    // run request timer
    jest.runOnlyPendingTimers();

    return p;
  });
});
