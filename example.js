const fs = require('fs')
const konan = require('./')

const file = process.argv[2]
let src

if (file) {
  src = fs.readFileSync(file, 'utf8')
} else {
  src = `
import {
  a,
  b,
  c
} from 'wow'
`
}

const modules = konan(src)

console.log(modules)
