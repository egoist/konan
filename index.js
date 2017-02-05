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
  const isDynamicImport = source[0].type.label === '('

  if (dynamicImport === false && isDynamicImport) {
    return []
  }

  for (const token of source) {
    if (token.type.label === 'string') {
      return token.value
    }

    if (isDynamicImport && token.type.label === ')') {
      break
    }
  }

  return []
}

function findModuleAfterRequire(tokens, indexOfRequire) {
  const source = tokens.slice(indexOfRequire + 1)

  for (const token of source) {
    if (token.type.label === 'string') {
      return token.value
    }

    if (token.type.label === ')') {
      break
    }
  }

  return []
}
