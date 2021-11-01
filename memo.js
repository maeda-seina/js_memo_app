const fs = require('fs')
const generateUuid = require('./uuid')
const uuid = generateUuid()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

const createMemo = () => {
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
    fs.writeFileSync(`./memo/${uuid}.json`, JSON.stringify({ memo: memo }))
  })
}

const readMemo = () => {
  const jsonFile = fs.readdirSync('memo/')
  const memoContent = JSON.parse(fs.readFileSync(`./memo/${jsonFile}`))
  const displayContent = memoContent.memo.split('\n')[0]
  console.log(displayContent)
}
if (argv.l) {
  readMemo()
} else {
  createMemo()
}
