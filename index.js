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

    // console.log(node);

    if (node.specifiers) {
      // console.log('................');
      // console.log(path.node)
      const imported = node.specifiers.map(specifier => specifier.imported || specifier.local);
      if (imported) {
        // console.log(imported);

        const imports = imported.map(indentifier => indentifier && indentifier.name);
        // console.log(imports);

        if (!Reflect.has(modules.imports, node.source.value)) {
          modules.imports[node.source.value] = [];
        }

        modules.imports[node.source.value] = imports;
      }
    }
  }

  let prevNode;
  let prevPath;

  traverse(ast, {
    enter(path) {
      // console.log(path.node);
      // console.log(path.node.type);


      if (path.node.type === 'CallExpression') {
        const callee = path.get('callee')
        const isDynamicImport = dynamicImport && callee.isImport()
        if (callee.isIdentifier({ name: 'require' }) || isDynamicImport) {
          const arg = path.node.arguments[0]
          if (arg.type === 'StringLiteral') {
            modules.strings.push(arg.value);

            // console.log(prevPath.parentPath);
            if (Reflect.has(prevPath.parentPath, 'parentPath') && prevPath.parentPath.parentPath instanceof Object) {
              const variableDeclarator = prevPath.parentPath.parentPath.parent;
              const namedProps = variableDeclarator.id.properties.map(property => property.key.name);
              if (!Reflect.has(modules.imports, arg.value)) {
                modules.imports[arg.value] = [];
              }
              modules.imports[arg.value].push(...namedProps);
              return
            }

            if (Reflect.has(path.node, 'arguments') && path.node.arguments.length > 0 && path.node.arguments[0].type === 'StringLiteral') {
              modules.imports[arg.value] = ['default'];
            }

          } else {
            modules.expressions.push(src.slice(arg.start, arg.end))
          }
          // storeNamedImports(path.node);
        }
      } else if (
        path.node.type === 'ImportDeclaration' ||
        path.node.type === 'ExportNamedDeclaration' ||
        path.node.type === 'ExportAllDeclaration'
        ) {
          // console.log(path.node);

          const { source } = path.node
          if (source && source.value) {
            modules.strings.push(source.value)
            storeNamedImports(path.node);
          }
        }

        prevPath = path
      }
    })

  return modules
}
