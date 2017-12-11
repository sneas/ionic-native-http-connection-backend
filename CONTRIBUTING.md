# Contribution guide

Below you can find sufficient information for successful contribution into the project.

## Code style

`ionic-native-http-connection-backend` uses [prettier](https://github.com/prettier/prettier) on git hook to keep code consistent.

To enable git hooks run `npm install` before commiting.

## Commit messages

`ionic-native-http-connection-backend` uses [semantic-release](https://github.com/semantic-release/semantic-release) to release new versions automatically.

To simplify valid commit message creation you can use `npm run commit` instead of `git commit`.

*  Commits of type `fix` will trigger bugfix releases, think `0.0.1`
*  Commits of type `feat` will trigger feature releases, think `0.1.0`
*  Commits with `BREAKING CHANGE` in body or footer will trigger breaking releases, think `1.0.0`

All other commit types will trigger no new release.

## Unit testing

The project follows [test-first](http://www.extremeprogramming.org/rules/testfirst.html) approach. Please apply code changes alongside with unit tests.

Tests run with `npm test` command.
