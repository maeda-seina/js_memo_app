import * as fs from 'fs'
import * as readline from 'readline'
import { generateUuid } from './uuid.js'
const uuid = generateUuid()

process.stdin.resume()
process.stdin.setEncoding('utf8')
const lines = []
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
reader.on('line', (line) => {
  lines.push(line)
})
reader.on('close', () => {
  const memo = lines.join('\n')
  fs.writeFileSync(`./${uuid}.json`, JSON.stringify({ memo: memo }))
})
