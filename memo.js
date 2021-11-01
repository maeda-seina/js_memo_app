const fs = require('fs')
const generateUuid = require('./uuid')
const uuid = generateUuid()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const inquirer = require('inquirer')

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
  jsonFile.forEach(file => {
    const memoAllContent = JSON.parse(fs.readFileSync(`./memo/${file}`))
    const displayContent = memoAllContent.memo.split('\n')[0]
    console.log(displayContent)
  })
}

const referMemo = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'memo',
        message: 'Choose a note you want to see:',
        choices: [1, 2, 3]
      }
    ])
    .then(answers => {
      console.info('Memo', answers.memo)
    })
}

if (argv.l) {
  readMemo()
} else if (argv.r) {
  referMemo()
} else {
  createMemo()
}
