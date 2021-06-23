#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import process from 'process'
import CompilationEngine from './CompilationEngine'
const inputExt = '.jack'
const outputExt = '.vm'

main()

async function main() {
  console.log(process.argv[2], process.argv)
  const inputPaths = getInputPaths(process.argv[2])

  for (let inputPath of inputPaths) {
    const outputPath = inputPath.replace(inputExt, outputExt)
    const compilationEngine = new CompilationEngine(inputPath, outputPath)
    compilationEngine.run()
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
