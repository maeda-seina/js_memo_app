const fs = require('fs')
const generateUuid = require('./uuid')
const uuid = generateUuid()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const inquirer = require('inquirer')

// Jsonファイルの取り出しなど任せたい
class Json {
  readDir () {
    return fs.readdirSync('./memo/')
  }

  readFile (path) {
    return fs.readFileSync(`./memo/${path}`, 'utf8')
  }

  writeMemo (memo) {
    fs.writeFileSync(`./memo/${uuid}.json`, JSON.stringify({ name: memo }))
  }

  parseMemo (path) {
    return JSON.parse(this.readFile(path))
  }
}

// メモを作成したり、削除したりするのはここで行う。
class Memo {
  constructor () {
    this.jsonObject = new Json()
  }

  createMemo () {
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
      this.jsonObject.writeMemo(memo)
    })
  }

  readMemo () {
    const jsonFiles = this.jsonObject.readDir()
    jsonFiles.forEach(jsonFile => {
      // const memo = JSON.parse(this.jsonObject.readFile(jsonFile))
      const memo = this.jsonObject.parseMemo(jsonFile)
      const memoOneLine = memo.name.split('\n')[0]
      console.log(memoOneLine)
    })
  }
}

class Command {
  constructor () {
    this.memo = new Memo()
  }

  run () {
    if (argv.l) {
      this.memo.readMemo()
    } else {
      this.memo.createMemo()
    }
  }
}
new Command().run()

// const createMemo = () => {
//   process.stdin.resume()
//   process.stdin.setEncoding('utf8')
//   const lines = []
//   const reader = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })
//   reader.on('line', (line) => {
//     lines.push(line)
//   })
//   reader.on('close', () => {
//     const memo = lines.join('\n')
//     fs.writeFileSync(`./memo/${uuid}.json`, JSON.stringify({ name: memo }))
//   })
// }

// const readMemo = () => {
//   const jsonFiles = fs.readdirSync('memo/')
//   jsonFiles.forEach(jsonFile => {
//     const memo = JSON.parse(fs.readFileSync(`./memo/${jsonFile}`))
//     const memoOneLine = memo.name.split('\n')[0]
//     console.log(memoOneLine)
//   })
// }

// rオプション(参照機能)
const createChoices = () => {
  const choices = []
  const jsonFiles = fs.readdirSync('memo/')
  for (const jsonFile of jsonFiles) {
    const memo = JSON.parse(fs.readFileSync(`memo/${jsonFile}`, 'utf8'))
    const memoOneLine = memo.name.split('\n')[0]
    choices.push(memoOneLine)
  }
  return choices
}

const allMemos = () => {
  const memos = []
  const jsonFiles = fs.readdirSync('memo/')
  for (const jsonFile of jsonFiles) {
    const memo = JSON.parse(fs.readFileSync(`memo/${jsonFile}`, 'utf8'))
    memos.push(memo)
  }
  return memos
}

const dependAnswersForRefer = (answers) => {
  const memos = allMemos()
  memos.forEach(memo => {
    const memoOneLine = memo.name.split('\n')[0]
    if (answers === memoOneLine) {
      console.log(memo.name)
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

// dオプション(削除機能)
const createArrayOfMemoWithFileName = () => {
  const memoWithFileName = []
  const jsonFiles = fs.readdirSync('memo/')
  for (const jsonFile of jsonFiles) {
    const memo = fs.readFileSync(`memo/${jsonFile}`, 'utf8')
    memoWithFileName[jsonFile] = JSON.parse(memo.split('\n')[0])
  }
  const formatMemoWithFileName = []
  for (const fileName in memoWithFileName) {
    formatMemoWithFileName.push({ fileName: fileName, memo: memoWithFileName[fileName] })
  }
  console.log(formatMemoWithFileName)
  return formatMemoWithFileName
}

const dependAnswersForDelete = (answers) => {
  const memoWithFileName = createArrayOfMemoWithFileName()
  memoWithFileName.forEach(file => {
    const memoOneLine = file.memo.name.split('\n')[0]
    if (answers === memoOneLine) {
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
      dependAnswersForDelete(answers.memo)
    })
}

// if (argv.l) {
//   readMemo()
// } else if (argv.r) {
//   referMemo()
// } else if (argv.d) {
//   deleteMemo()
// } else {
//   createMemo()
// }
