const babylon = require('babylon')

module.exports = function (input, {
  dynamicImport = true
} = {}) {
  if (typeof input !== 'string') {
    throw new Error('Expected input to be string')
  }

  const {tokens} = babylon.parse(input, {sourceType: 'module', plugins: '*'})

  let modules = []

  tokens.forEach((token, index) => {
    if (token.type.label === 'import') {
      modules = modules.concat(findModuleAfterImport(tokens, index, {dynamicImport}))
    }
    if (token.type.label === 'name') {
      if (token.value === 'require') {
        modules = modules.concat(findModuleAfterRequire(tokens, index))
      }
    }
  })

  return modules
}

function findModuleAfterImport(tokens, indexOfImport, {dynamicImport}) {
  const source = tokens.slice(indexOfImport + 1)
  // import('module').then
  const isDynamicImport = source[0].type.label === '('
  // import 'module'
  const isNormalImport = source[0].type.label === 'string'
  // import {named} from 'module'
  // import * as m from 'module'
  // import m from 'module'
  const isNamedImport = ['{', '*', 'name'].indexOf(source[0].type.label) > -1

  if (isDynamicImport) {
    if (dynamicImport === false) {
      return []
    }
    if (source[1].type.label === 'string') {
      return source[1].value
    }
  } else if (isNormalImport) {
    return source[0].value
  } else if (isNamedImport) {
    for (const token of source) {
      if (token.type.label === 'string') {
        return token.value
      }
    }
  }

  return []
}

function findModuleAfterRequire(tokens, indexOfRequire) {
  const source = tokens.slice(indexOfRequire + 1)
  const isRequireFunction = source[0].type.label === '('

  if (isRequireFunction && source[1].type.label === 'string') {
    return source[1].value
  }

  return []
}
