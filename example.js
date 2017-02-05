const konan = require('./')

const modules = konan(`
import 'lol'
`, {dynamicImport: false})

console.log(modules)
