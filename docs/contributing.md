# Contributing

Project is open for new ideas and features:

* new adapters
* new api functions
* data source features
* feedback is very matter

## Source code

Source code is located in `/packages/${package}/src` directory. Before
publishing to npm code is automatically transpiled using
[babel](https://babeljs.io/) and npm `pre-publish` hook.

## Development

Use `npm link` feature in your projects to get up to date local bivrost code and
`yarn dev` to start watchers for code auto transpiling.

## Tests

[jest](https://facebook.github.io/jest/) - painless javascript unit testing.

* `yarn test` - execute tests + code coverage report
* `yarn test-dev` start file system watchers

## Commands

* `yarn run dev` - start watchers and transpile code with babel
* `yarn run docs:watch` - start local server with
  [gitbook](https://toolchain.gitbook.com/) and generate html docs
