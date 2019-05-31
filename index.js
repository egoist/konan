const babylon = require('babylon')
const traverse = require('babel-traverse').default

module.exports = function(
  src,
  { dynamicImport = true, parse = { sourceType: 'module', plugins: '*' } } = {}
) {
  const modules = { imports: {}, strings: [], expressions: [] }

  let ast

  if (typeof src === 'string') {
    const moduleRe = /\b(require|import|export)\b/

    if (!moduleRe.test(src)) {
      return modules
    }

    ast = babylon.parse(src, parse)
  } else {
    ast = src
  }

  const storeNamedImports = node => {
    if (node.specifiers) {
      const imported = node.specifiers.map(
        specifier => specifier.imported || specifier.local
      )
      if (imported) {
        const imports = imported.map(
          indentifier => indentifier && indentifier.name
        )
        if (!Reflect.has(modules.imports, node.source.value)) {
          modules.imports[node.source.value] = []
        }
        modules.imports[node.source.value] = imports
      }
    }
  }

  const processAncestor = (prevPath, arg) => {
    if (
      Reflect.has(prevPath.parentPath, 'parentPath') &&
      prevPath.parentPath.parentPath instanceof Object
    ) {
      const ancestor = prevPath.parentPath.parentPath.parent

      if (ancestor.type === 'VariableDeclarator') {
        const namedProps = ancestor.id.properties.map(
          property => property.key.name
        )
        if (!Reflect.has(modules.imports, arg.value)) {
          modules.imports[arg.value] = []
        }
        modules.imports[arg.value].push(...namedProps)
        return namedProps
      }

      if (ancestor.type === 'Program' && Reflect.has(prevPath.parent, 'id')) {
        const variableDeclarator = prevPath
        const requireVariableName = variableDeclarator.parent.id.name
        if (!Reflect.has(modules.imports, arg.value)) {
          modules.imports[arg.value] = []
        }
        modules.imports[arg.value].push(requireVariableName)
        return requireVariableName
      }
    }
  }

  let prevPath

  traverse(ast, {
    enter(path) {
      if (path.node.type === 'CallExpression') {
        const callee = path.get('callee')
        const isDynamicImport = dynamicImport && callee.isImport()
        if (callee.isIdentifier({ name: 'require' }) || isDynamicImport) {
          const arg = path.node.arguments[0]
          if (arg.type === 'StringLiteral') {
            modules.strings.push(arg.value)

            const importNames = processAncestor(prevPath, arg)
            if (importNames) {
              return
            }

            if (
              Reflect.has(path.node, 'arguments') &&
              path.node.arguments.length > 0 &&
              path.node.arguments[0].type === 'StringLiteral'
            ) {
              modules.imports[arg.value] = ['default']
            }
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
          storeNamedImports(path.node)
        }
      }

      prevPath = path
    }
  })

  return modules
}
