const fs = require('fs')
const generateUuid = require('./uuid')
const uuid = generateUuid()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

process.stdin.resume()
process.stdin.setEncoding('utf8')
const lines = []
const reader = require('readline').createInterface({
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
console.log(argv)
