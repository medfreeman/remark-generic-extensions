# remark-generic-extensions

[![Build Status](https://img.shields.io/travis/medfreeman/remark-generic-extensions.svg?label=build)](https://travis-ci.org/medfreeman/remark-generic-extensions)
[![npm version](https://img.shields.io/npm/v/remark-generic-extensions.svg)](https://www.npmjs.com/package/remark-generic-extensions)
[![dependencies Status](https://img.shields.io/david/medfreeman/remark-generic-extensions.svg)](https://david-dm.org/medfreeman/remark-generic-extensions)
[![devDependencies Status](https://img.shields.io/david/dev/medfreeman/remark-generic-extensions.svg)](https://david-dm.org/medfreeman/remark-generic-extensions?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/medfreeman/remark-generic-extensions.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/medfreeman/remark-generic-extensions/master.svg)](https://coveralls.io/github/medfreeman/remark-generic-extensions?branch=master)

!Extension\[Content\]\(Argument\)\{Properties\} -> :tada: — [commonmark generic directive extension](https://github.com/jgm/CommonMark/wiki/Generic-Directive-Extension-List) for remark

## Purpose

Allow the use of [commonmark generic directive extension](https://github.com/jgm/CommonMark/wiki/Generic-Directive-Extension-List) in markdown,
generating components through [remark-html](https://github.com/wooorm/remark-html) or [remark-react](https://github.com/mapbox/remark-react).

### Examples

`!youtube[C8NAYW-Z54o]`

![youtube cat video embed](https://j.gifs.com/j2zN2v.gif)

OR

`!Icon[add](Add button)`

![react-toolbox icon with tooltip](https://j.gifs.com/xGRwl9.gif)

## Disclaimer

At the moment, this supports only inline extensions, not block extensions.
Feel free to submit a PR to add this feature if you need it before i got the time to implement it.

## Installation

npm:

```bash
npm install remark-generic-extensions
```

yarn:

```bash
yarn add remark-generic-extensions
```

---

## CONTRIBUTING

* ⇄ Pull requests and ★ Stars are always welcome.
* For bugs and feature requests, please create an issue.
* Pull requests must be accompanied by passing automated tests (`$ yarn test`).

## [CHANGELOG](CHANGELOG.md)

## [LICENSE](LICENSE)
