const fs = require('fs')
const konan = require('../')

test('main', () => {
  const input = fs.readFileSync('./__test__/fixture.js', 'utf8')
  expect(konan(input)).toEqual([
    'foo',
    'vue/dist/vue',
    'wow',
    'baby',
    './async-module'
  ])
})
