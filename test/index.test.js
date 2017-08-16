const fs = require('fs')
const konan = require('../')

describe('main', () => {
  const input = fs.readFileSync('./test/fixture.js', 'utf8')

  test('all', () => {
    expect(konan(input)).toEqual({
      strings: ['foo', 'vue/dist/vue', 'wow', 'baby', './async-module'],
      expressions: []
    })
  })

  test('exclude dynamical import', () => {
    expect(konan(input, { dynamicImport: false })).toEqual({
      strings: ['foo', 'vue/dist/vue', 'wow', 'baby'],
      expressions: []
    })
  })

  test('dynamical require', () => {
    expect(
      konan(`
      require(path.resolve('./'))
      require('bar')
    `)
    ).toEqual({
      strings: ['bar'],
      expressions: ["path.resolve('./')"]
    })
  })

  test('only consider require as function', () => {
    expect(
      konan(`
      require('foo')
      var a = {
        require: 'bar'
      }
    `)
    ).toEqual({
      strings: ['foo'],
      expressions: []
    })
  })

  test('import *', () => {
    expect(konan(`import * as m from 'm';var foo = {import: 'mm'}`)).toEqual({
      strings: ['m'],
      expressions: []
    })
  })

  test('export', () => {
    const input = fs.readFileSync('./test/fixture-export.js', 'utf8')
    expect(konan(input)).toEqual({
      strings: ['./util', './temporary', './persistent'],
      expressions: []
    })
  })
})
