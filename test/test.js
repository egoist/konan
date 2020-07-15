const fs = require('fs')
const konan = require('..')
const { test } = require('uvu')
const assert = require('uvu/assert')

const input = fs.readFileSync('./test/fixture.js', 'utf8')

test('all', () => {
  assert.equal(konan(input), {
    strings: ['foo', 'vue/dist/vue', 'wow', 'baby', './async-module'],
    expressions: [],
  })
})

test('exclude dynamical import', () => {
  assert.equal(konan(input, { dynamicImport: false }), {
    strings: ['foo', 'vue/dist/vue', 'wow', 'baby'],
    expressions: [],
  })
})

test('dynamical require', () => {
  assert.equal(
    konan(`
      require(path.resolve('./'))
      require('bar')
    `),
    {
      strings: ['bar'],
      expressions: ["path.resolve('./')"],
    },
  )
})

test('only consider require as function', () => {
  assert.equal(
    konan(`
      require('foo')
      var a = {
        require: 'bar'
      }
    `),
    {
      strings: ['foo'],
      expressions: [],
    },
  )
})

test('import *', () => {
  assert.equal(konan(`import * as m from 'm';var foo = {import: 'mm'}`), {
    strings: ['m'],
    expressions: [],
  })
})

test('export', () => {
  const input = fs.readFileSync('./test/fixture-export.js', 'utf8')
  assert.equal(konan(input), {
    strings: ['./util', './temporary', './persistent', 'all'],
    expressions: [],
  })
})

test.run()
