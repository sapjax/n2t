const fs = require('fs')
const path = require('path')
const process = require('process')
const Parser = require('./parser')
const CodeWriter = require('./codeWriter')
const COMMAND_TYPE = require('./commandType')

async function main() {
  const fileName = process.argv[2]
  const filePath = path.join(__dirname, fileName)
  const outFileName = path.basename(filePath, '.vm') + '.asm'
  const outPath = path.join(path.dirname(filePath), outFileName)

  const parser = new Parser(filePath)
  const codeWriter = new CodeWriter(outPath)

  await parser.ready()

  while (parser.hasMoreCommands()) {
    await parser.advance()
    const command = parser.command()
    const commandType = parser.commandType()
    if (commandType === COMMAND_TYPE.C_ARITHMETIC) {
      await codeWriter.writeArithmetic(command)
    } else {
      const segment = parser.arg1()
      const index = parser.arg2()
      await codeWriter.writePushPop(command, segment, index)
    }
  }
  codeWriter.close()
  console.log('VMTranslator Run Successfully!')
}

main()
