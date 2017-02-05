const konan = require('./')

const modules = konan(`
import {foo} from 'foo'
import   ('bar')
`, {dynamicImport: false})

console.log(modules)
