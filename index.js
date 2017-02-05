const babylon = require('babylon')

module.exports = function (input) {
  if (typeof input !== 'string') {
    throw new Error('Expected input to be string')
  }

  const {tokens} = babylon.parse(input, {sourceType: 'module', plugins: '*'})

  const modules = []

  tokens.forEach((token, index) => {
    if (token.type.label === 'import') {
      modules.push(findModuleAfterImport(tokens, index))
    }
    if (token.type.label === 'name') {
      if (token.value === 'require') {
        modules.push(findModuleAfterImport(tokens, index))
      }
    }
  })

  return modules
}

function findModuleAfterImport(tokens, indexOfImport) {
  return tokens.slice(indexOfImport).filter(token => {
    return token.type.label === 'string'
  })[0].value
}
