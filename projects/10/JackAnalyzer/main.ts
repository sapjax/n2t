#!/usr/bin/env node

import fs, { write } from 'fs'
import path from 'path'
import process from 'process'
import Tokenizer from './JackTokenizer'
import CompilationEngine from './CompilationEngine'
import Writer from './Writer'
const inputExt = '.jack'
const outputExt = '.xml'

main()

async function main() {
  console.log(process.argv[2], process.argv)
  const inputPaths = getInputPaths(process.argv[2])

  for (let p of inputPaths) {
    const outputPath = p.replace(inputExt, outputExt)
    const writer = new Writer(outputPath)
    const tokenizer = new Tokenizer(p)
    await tokenizer.ready()

    // await writer.write('<tokens>')
    // while (tokenizer.hasMoreTokens()) {
    //   tokenizer.advance()
    //   if (tokenizer.hasMoreTokens()) {
    //     await writer.writeToken(tokenizer.tokenType(), tokenizer.token())
    //   }
    // }
    // await writer.write('</tokens>')

    const compilationEngine = new CompilationEngine(tokenizer)
    await writer.write(compilationEngine.getOutput())
    await writer.close()
    console.log('JackAnalyzer write Successfully!', outputPath)
  }
}

function getInputPaths(pathArg: string) {
  const fullPath = path.join(process.cwd(), pathArg)

  const stats = fs.statSync(fullPath)

  let filePaths = []
  if (stats.isFile() && path.extname(fullPath) === inputExt) {
    filePaths = [fullPath]
  } else if (stats.isDirectory()) {
    filePaths = getDirFiles(fullPath, inputExt)
    if (!filePaths.length) {
      throw new Error('No jack file found!')
    } else {
    }
  } else {
    throw new Error(`${pathArg} is not a directory or jack file.`)
  }

  return filePaths
}

function getDirFiles(dirPath: string, ext: string) {
  let filePaths: string[] = []

  const dirent = fs.readdirSync(dirPath, { withFileTypes: true })
  dirent.forEach(d => {
    // for different nodejs version
    const fName = d.name || ((<unknown>d) as string)
    const fullPath = path.join(dirPath, fName)
    if (path.extname(fName) === ext) {
      filePaths.push(fullPath)
    }
  })

  return filePaths
}
