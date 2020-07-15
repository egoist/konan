const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

module.exports = function (
  src,
  {
    dynamicImport = true,
    parse = {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'dynamicImport'],
    },
  } = {}
) {
  const modules = { strings: [], expressions: [] }

  let ast

  if (typeof src === 'string') {
    const moduleRe = /\b(require|import|export)\b/

    if (!moduleRe.test(src)) {
      return modules
    }

    ast = parser.parse(src, parse)
  } else {
    ast = src
  }

  traverse(ast, {
    enter(path) {
      if (path.node.type === 'CallExpression') {
        const callee = path.get('callee')
        const isDynamicImport = dynamicImport && callee.isImport()
        if (callee.isIdentifier({ name: 'require' }) || isDynamicImport) {
          const arg = path.node.arguments[0]
          if (arg.type === 'StringLiteral') {
            modules.strings.push(arg.value)
          } else {
            modules.expressions.push(src.slice(arg.start, arg.end))
          }
        }
      } else if (
        path.node.type === 'ImportDeclaration' ||
        path.node.type === 'ExportNamedDeclaration' ||
        path.node.type === 'ExportAllDeclaration'
      ) {
        const { source } = path.node
        if (source && source.value) {
          modules.strings.push(source.value)
        }
      }
    },
  })

  return modules
}
