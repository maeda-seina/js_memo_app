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
    fs.writeFileSync(`./memo/${uuid}.json`, JSON.stringify({ name: memo }))
  })
}

const readMemo = () => {
  const jsonFile = fs.readdirSync('memo/')
  jsonFile.forEach(file => {
    const memoAllContent = JSON.parse(fs.readFileSync(`./memo/${file}`))
    const displayContent = memoAllContent.name.split('\n')[0]
    console.log(displayContent)
  })
}

const createChoices = () => {
  const choices = []
  const jsonFiles = fs.readdirSync('memo/')
  for (const file of jsonFiles) {
    const contents = JSON.parse(fs.readFileSync(`memo/${file}`, 'utf8'))
    const content = contents.name.split('\n')[0]
    choices.push(content)
  }
  return choices
}

const allMemos = () => {
  const choices = []
  const jsonFiles = fs.readdirSync('memo/')
  for (const file of jsonFiles) {
    const contents = JSON.parse(fs.readFileSync(`memo/${file}`, 'utf8'))
    choices.push(contents)
  }
  return choices
}

const dependAnswersForRefer = (answers) => {
  const allMemo = allMemos()
  allMemo.forEach(file => {
    const oneLine = file.name.split('\n')[0]
    if (answers === oneLine) {
      console.log(file.name)
    }
  })
}

const referMemo = () => {
  const choices = createChoices()
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'memo',
        message: 'Choose a note you want to see:',
        choices: choices
      }
    ])
    .then(answers => {
      dependAnswersForRefer(answers.memo)
    })
}

const createArrayForDelete = () => {
  const fileObject = []
  const files = fs.readdirSync('memo/')
  for (const file of files) {
    const contents = fs.readFileSync(`memo/${file}`, 'utf8')
    fileObject[file] = JSON.parse(contents.split('\n')[0])
  }
  const arrayForDelete = []
  for (const fileName in fileObject) {
    arrayForDelete.push({ fileName: fileName, memo: fileObject[fileName] })
  }
  return arrayForDelete
}

const dependAnswersDelete = (answers) => {
  const arrayForDelete = createArrayForDelete()
  arrayForDelete.forEach(file => {
    if (answers === file.memo.name.split('\n')[0]) {
      fs.unlink(`memo/${file.fileName}`, function (error) {
        if (error) {
          throw error.message
        }
        console.log('選択したメモを削除しました。')
      })
    }
  })
}

const deleteMemo = () => {
  const choices = createChoices()
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'memo',
        message: 'Choose a note you want to delete:',
        choices: choices
      }
    ])
    .then(answers => {
      dependAnswersDelete(answers.memo)
    })
}

if (argv.l) {
  readMemo()
} else if (argv.r) {
  referMemo()
} else if (argv.d) {
  deleteMemo()
} else {
  createMemo()
}
