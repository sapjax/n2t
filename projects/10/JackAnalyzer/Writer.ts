import { WriteStream, createWriteStream } from 'fs'
import { EOL } from 'os'
import { TokenType } from './grammar'

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

  async writeToken(type: TokenType, token: string) {
    if (token === '>') {
      token = '&gt;'
    }
    if (token === '<') {
      token = '&lt;'
    }
    const data = `<${type}> ${token} </${type}>`
    await this.write(data)
  }

  async close() {
    return new Promise(resolve => {
      this.#writer.end()
      resolve(null)
    })
  }
}

export default CodeWriter
