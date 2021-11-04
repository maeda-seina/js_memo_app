const fs = require('fs')
const generateUuid = require('./uuid')
const uuid = generateUuid()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const inquirer = require('inquirer')

// Jsonファイルの操作など任せたい
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

  parseMemo (file) {
    return JSON.parse(file)
  }

  deleteFile (path) {
    return fs.unlink(`memo/${path}`, function (error) {
      if (error) {
        throw error.message
      }
      console.log('選択したメモを削除しました。')
    })
  }
}

// メモの操作など任せたい
class Memo {
  constructor () {
    this.jsonObject = new Json()
  }

  create () {
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

  list () {
    const jsonFiles = this.jsonObject.readDir()
    jsonFiles.forEach(jsonFile => {
      const memo = this.jsonObject.parseMemo(this.jsonObject.readFile(jsonFile))
      const memoOneLine = memo.name.split('\n')[0]
      console.log(memoOneLine)
    })
  }

  createChoice () {
    const choices = []
    const jsonFiles = this.jsonObject.readDir()
    for (const jsonFile of jsonFiles) {
      const memo = this.jsonObject.parseMemo(this.jsonObject.readFile(jsonFile))
      const memoOneLine = memo.name.split('\n')[0]
      choices.push(memoOneLine)
    }
    return choices
  }

  allMemos () {
    const memos = []
    const jsonFiles = this.jsonObject.readDir()
    for (const jsonFile of jsonFiles) {
      const memo = this.jsonObject.parseMemo(this.jsonObject.readFile(jsonFile))
      memos.push(memo)
    }
    return memos
  }

  dependAnswersForRefer (answers) {
    const memos = this.allMemos()
    memos.forEach(memo => {
      const memoOneLine = memo.name.split('\n')[0]
      if (answers === memoOneLine) {
        console.log(memo.name)
      }
    })
  }

  refer () {
    const choices = this.createChoice()
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
        this.dependAnswersForRefer(answers.memo)
      })
  }

  createArrayOfMemoWithFileName () {
    const memoWithFileName = []
    const jsonFiles = this.jsonObject.readDir()
    for (const jsonFile of jsonFiles) {
      const memo = this.jsonObject.readFile(jsonFile)
      memoWithFileName[jsonFile] = this.jsonObject.parseMemo(memo.split('\n')[0])
    }
    const formatMemoWithFileName = []
    for (const fileName in memoWithFileName) {
      formatMemoWithFileName.push({ fileName: fileName, memo: memoWithFileName[fileName] })
    }
    return formatMemoWithFileName
  }

  dependAnswersForDelete (answers) {
    const memoWithFileName = this.createArrayOfMemoWithFileName()
    memoWithFileName.forEach(file => {
      const memoOneLine = file.memo.name.split('\n')[0]
      if (answers === memoOneLine) {
        this.jsonObject.deleteFile(file.fileName)
      }
    })
  }

  delete () {
    const choices = this.createChoice()
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
        this.dependAnswersForDelete(answers.memo)
      })
  }
}

// コマンド操作
class Command {
  constructor () {
    this.memo = new Memo()
  }

  main () {
    if (argv.l) {
      this.memo.list()
    } else if (argv.r) {
      this.memo.refer()
    } else if (argv.d) {
      this.memo.delete()
    } else {
      this.memo.create()
    }
  }
}
new Command().main()
