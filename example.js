const konan = require('./')

const modules = konan(`
import {foo} from 'foo'

import hahah from 'vue/dist/vue'

import {
  a,
  b,
  c
} from 'wow'

const {
  hello
} = require('baby')

import('async-module')

const a = <div>jsx no-mad!</div>
`)

console.log(modules)
