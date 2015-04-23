function chain(steps, data) {
  return steps.reduce((promise, step) => step ? promise.then(step) : promise, Promise.resolve(data));
}

export default function Method(func, pre=[], post=[]) {
  return p => chain(pre, p).then(func).then(chain.bind(null, post));
}
