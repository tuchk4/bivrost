# Contributing

Project is open for new ideas and features. Please follow next rules:

- add tests / docs for new features
- update docs / test if bug fixes
- tests should done without errors

## Add new adapters

## Add new api function

## Source code

Source code is located in `/src/` directory. Before publishing to npm code is automatically transformed using babel and npm `pre-publish` hook.

## Development

Use `npm link` feature in your projects to get up to date local bivrost code and `npm run dev` to start watchers for auto transpiling code.

## Tests

[https://facebook.github.io/jest/](jest) - painless javascript unit testing.

- `npm test` - execute tests + code coverage report
- `npm run test-dev` start file system watchers and execute tests for each file change

## Commands

- `npm run dev` - start FS watchers and transpile ES6 into ES5
- `npm test` - execute tests + code coverage report
- `npm run test-dev` satart FS watchers and execute tests for each file change
- `npm run docs:watch` - start local serve (localhost:4000) and generate html docs
