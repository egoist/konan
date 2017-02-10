const fs = require('fs')
const konan = require('../')

describe('main', () => {
  const input = fs.readFileSync('./__test__/fixture.js', 'utf8')

  test('all', () => {
    expect(konan(input)).toEqual([
      'foo',
      'vue/dist/vue',
      'wow',
      'baby',
      './async-module'
    ])
  })

  test('exclude dynamical import', () => {
    expect(konan(input, {dynamicImport: false})).toEqual([
      'foo',
      'vue/dist/vue',
      'wow',
      'baby'
    ])
  })

  test('ignore dynamical require', () => {
    expect(konan(`
      require(foo)
      require('bar')
    `)).toEqual(['bar'])
  })

  test('only consider require as function', () => {
    expect(konan(`
      require('foo')
      var a = {
        require: 'bar'
      }
    `)).toEqual(['foo'])
  })
})
