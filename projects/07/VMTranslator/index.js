#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const process = require('process')
const Parser = require('./parser')
const CodeWriter = require('./codeWriter')
const COMMAND_TYPE = require('./commandType')
const inputExt = '.vm'
const outputExt = '.asm'

main()

async function main() {
  console.log(process.argv[2], process.argv)
  const { inputPaths, outputPath } = getIOPaths(process.argv[2])

  const codeWriter = new CodeWriter(outputPath)

  for (let p of inputPaths) {
    const fileName = path.basename(p, inputExt)
    codeWriter.setFileName(fileName)

    const parser = new Parser(p)
    await parser.ready()
    console.log(`parsing... ${p}`)

    while (parser.hasMoreCommands()) {
      await parser.advance()
      const command = parser.command()
      const commandType = parser.commandType()
      const arg1 = parser.arg1()
      const arg2 = parser.arg2()
      switch (commandType) {
        case COMMAND_TYPE.C_ARITHMETIC:
          codeWriter.writeArithmetic(command)
          break
        case COMMAND_TYPE.C_PUSH:
        case COMMAND_TYPE.C_POP:
          codeWriter.writePushPop(command, arg1, arg2)
          break
        case COMMAND_TYPE.C_LABEL:
          codeWriter.writeLabel(arg1)
          break
        case COMMAND_TYPE.C_GOTO:
          codeWriter.writeGoto(arg1)
          break
        case COMMAND_TYPE.C_IF:
          codeWriter.writeIf(arg1)
          break
        case COMMAND_TYPE.C_FUNCTION:
          codeWriter.writeFunction(arg1, arg2)
          break
        case COMMAND_TYPE.C_CALL:
          codeWriter.writeCall(arg1, arg2)
          break
        case COMMAND_TYPE.C_RETURN:
          codeWriter.writeReturn()
          break
        default:
      }
    }
  }

  await codeWriter.close()
  console.log('VMTranslator write Successfully!', outputPath)
}

function getIOPaths(pathArg) {
  const fullPath = path.join(process.cwd(), pathArg)

  const stats = fs.statSync(fullPath)

  let filePaths = []
  let outputFilePath = ''
  if (stats.isFile() && path.extname(fullPath) === inputExt) {
    filePaths = [fullPath]
    outputFilePath = path.join(
      path.dirname(filePaths[0]),
      path.basename(filePaths[0], inputExt) + outputExt
    )
  } else if (stats.isDirectory()) {
    filePaths = getDirFiles(fullPath, '.vm')
    if (!filePaths.length) {
      throw new Error('No vm file found!')
    } else {
      const pathParts = fullPath.replace(/\/$/, '').split(path.sep)
      const dirName = pathParts[pathParts.length - 1]
      outputFilePath = path.join(fullPath, dirName + outputExt)
    }
  } else {
    throw new Error(`${pathArg} is not a directory or vm file.`)
  }

  return {
    inputPaths: filePaths,
    outputPath: outputFilePath,
  }
}

function getDirFiles(dirPath, ext) {
  let filePaths = []

  const dirent = fs.readdirSync(dirPath, { withFileTypes: true })
  dirent.forEach(d => {
    // for different nodejs version
    const fName = d.name || d
    const fullPath = path.join(dirPath, fName)
    if (path.extname(fName) === ext) {
      filePaths.push(fullPath)
    }
  })

  return filePaths
}
