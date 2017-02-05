# konan

[![NPM version](https://img.shields.io/npm/v/konan.svg?style=flat)](https://npmjs.com/package/konan) [![NPM downloads](https://img.shields.io/npm/dm/konan.svg?style=flat)](https://npmjs.com/package/konan) [![Build Status](https://img.shields.io/circleci/project/egoist/konan/master.svg?style=flat)](https://circleci.com/gh/egoist/konan) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Install

```bash
yarn add konan
# or hey old school
npm install --save konan
```

## Supported syntax

- `require` call
- `import` ES6 import
- `import()` [Dynamic import](https://github.com/tc39/proposal-dynamic-import)
- You can use `jsx` and `flow` syntax in source content
- Dynamic `require` is ignored

## Usage

```js
const konan = require('konan')

konan(`
import React, {Component} from 'react'
const vue = require('vue/dist/vue')
import('./my-async-module').then()
`)
//=> ['react', 'vue/dist/vue', './my-async-module']
```

## API

### konan(input, [options])

#### input

Type: `string`<br>
Required: `true`

Source content.

#### options

##### dynamicImport

Type: `boolean`<br>
Default: `true`

You can disable detecting dynamic `import()`-ed modules.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**konan** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/konan/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
