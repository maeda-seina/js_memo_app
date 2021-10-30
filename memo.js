const fs = require('fs')

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
  fs.writeFileSync('./memo.json', JSON.stringify({ memo: lines[0] }))
})
