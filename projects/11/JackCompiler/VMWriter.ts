import { WriteStream, createWriteStream } from 'fs'
import { EOL } from 'os'
import { COMMANDS, SEGMENTS } from './vmType'

class CodeWriter {
  #writer: WriteStream
  constructor(outputFile: string) {
    this.#writer = createWriteStream(outputFile, {
      flags: 'w',
    })
  }

  async write(data: string) {
    await this.#writer.write(data + EOL)
  }

  async writePush(segment: SEGMENTS, index: number) {
    await this.write('push' + ' ' + segment + ' ' + index)
  }

  async writePop(segment: SEGMENTS, index: number) {
    await this.write('pop' + ' ' + segment + ' ' + index)
  }

  async writeArithmetic(command: COMMANDS) {
    await this.write(command)
  }

  async writeLabel(label: string) {
    await this.write('label ' + label)
  }

  async writeGoto(label: string) {
    await this.write('goto ' + label)
  }

  async writeIf(label: string) {
    await this.write('if-goto ' + label)
  }

  async writeCall(name: string, nArgs: number) {
    await this.write('call ' + name + ' ' + nArgs)
  }

  async writeFunction(name: string, nLocals: number) {
    await this.write('function ' + name + ' ' + nLocals)
  }

  async writeReturn() {
    await this.write('return')
  }

  async close() {
    return new Promise(resolve => {
      this.#writer.end()
      resolve(null)
    })
  }
}

export default CodeWriter
