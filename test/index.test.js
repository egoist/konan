const fs = require('fs')
const konan = require('../')

describe('main', () => {
  const input = fs.readFileSync('./test/fixture.js', 'utf8')
  const input2 = fs.readFileSync('./test/fixture2.js', 'utf8')
  const readmeExample = fs.readFileSync(
    './test/fixture-readme-example.js',
    'utf8'
  )

  test('all', () => {
    expect(konan(input).strings).toEqual([
      'foo',
      'vue/dist/vue',
      'wow',
      'baby',
      './async-module'
    ])
  })

  test('all named imports', () => {
    expect(konan(input2)).toEqual({
      expressions: [],
      strings: ['baz', 'vue/dist/vue', 'wow', 'baby', './async-module'],
      imports: {
        baz: ['foo', 'bar', 'qux'],
        'vue/dist/vue': ['hahah'],
        wow: ['hello'],
        baby: ['hello2', 'hello3'],
        './async-module': ['default']
      }
    })
  })

  test('exclude dynamical import', () => {
    expect(konan(input, { dynamicImport: false }).strings).toEqual([
      'foo',
      'vue/dist/vue',
      'wow',
      'baby'
    ])
  })

  test('dynamical require', () => {
    expect(
      konan(`
      require(path.resolve('./'))
      require('bar')
    `)
    ).toEqual({
      strings: ['bar'],
      expressions: ["path.resolve('./')"],
      imports: { bar: ['default'] }
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
      expressions: [],
      imports: { foo: ['default'] }
    })
  })

  test('import *', () => {
    expect(konan(`import * as m from 'm';var foo = {import: 'mm'}`)).toEqual({
      strings: ['m'],
      expressions: [],
      imports: { m: ['m'] }
    })
  })

  test('README example', () => {
    expect(konan(readmeExample).imports).toEqual({
      react: ['React', 'Component'],
      'vue/dist/vue': ['vue'],
      'other/bin': ['other'],
      './my-async-module': ['default'],
      './my-async-module2': ['default']
    })
  })

  test('export', () => {
    const input = fs.readFileSync('./test/fixture-export.js', 'utf8')
    expect(konan(input)).toEqual({
      strings: ['./util', './temporary', './persistent', 'all'],
      expressions: [],
      imports: {
        './persistent': [
          'MDCPersistentDrawer',
          'MDCPersistentDrawerFoundation'
        ],
        './temporary': ['MDCTemporaryDrawer', 'MDCTemporaryDrawerFoundation'],
        './util': ['util']
      }
    })
  })
})
