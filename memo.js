const fs = require('fs')
const generateUuid = require('./uuid')
const uuid = generateUuid()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const inquirer = require('inquirer')

class MemoDatabase {
  loadIds () {
    return fs.readdirSync('./db/')
  }

  loadMemo (id) {
    return fs.readFileSync(`./db/${id}`, 'utf8')
  }

  writeMemo (memoContent) {
    fs.writeFileSync(`./db/${uuid}.json`, JSON.stringify({ name: memoContent }))
  }

  parseMemo (id) {
    return JSON.parse(id)
  }

  deleteMemo (id, callback) {
    return fs.unlink(`db/${id}`, callback)
  }

  findMemo (id) {
    return this.parseMemo(this.loadMemo(id))
  }
}

class Memo {
  constructor () {
    this.db = new MemoDatabase()
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
      const memoContent = lines.join('\n')
      this.db.writeMemo(memoContent)
    })
  }

  list () {
    const ids = this.db.loadIds()
    for (const id of ids) {
      const memo = this.db.findMemo(id)
      const memoOneLine = memo.name.split('\n')[0]
      console.log(memoOneLine)
    }
  }

  createChoice () {
    const choices = []
    const ids = this.db.loadIds()
    for (const id of ids) {
      const memo = this.db.findMemo(id)
      const memoOneLine = memo.name.split('\n')[0]
      choices.push(memoOneLine)
    }
    return choices
  }

  allMemos () {
    const memos = []
    const ids = this.db.loadIds()
    for (const id of ids) {
      const memo = this.db.findMemo(id)
      memos.push(memo)
    }
    return memos
  }

  dependAnswersForRefer (answers) {
    const memos = this.allMemos()
    for (const memo of memos) {
      const memoOneLine = memo.name.split('\n')[0]
      if (answers === memoOneLine) {
        console.log(memo.name)
      }
    }
  }

  async refer () {
    const choices = this.createChoice()
    const answers = await inquirer.prompt([{
      type: 'list',
      name: 'memo',
      message: 'Choose a note you want to see:',
      choices: choices
    }])
    this.dependAnswersForRefer(answers.memo)
  }

  createArrayOfMemoWithFileName () {
    const memoWithFileName = []
    const ids = this.db.loadIds()
    for (const id of ids) {
      const memo = this.db.loadMemo(id)
      memoWithFileName[id] = this.db.parseMemo(memo)
    }
    const formatMemoWithFileName = []
    for (const fileName in memoWithFileName) {
      formatMemoWithFileName.push({ fileName: fileName, memo: memoWithFileName[fileName] })
    }
    return formatMemoWithFileName
  }

  dependAnswersForDelete (answers) {
    const memoWithFileName = this.createArrayOfMemoWithFileName()
    for (const file of memoWithFileName) {
      const memoOneLine = file.memo.name.split('\n')[0]
      if (answers === memoOneLine) {
        this.db.deleteMemo(file.fileName, function (error) {
          if (error) {
            throw error.message
          }
          console.log('選択したメモを削除しました。')
        })
      }
    }
  }

  async delete () {
    const choices = this.createChoice()
    const answers = await inquirer.prompt([{
      type: 'list',
      name: 'memo',
      message: 'Choose a note you want to delete:',
      choices: choices
    }])
    this.dependAnswersForDelete(answers.memo)
  }
}

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
