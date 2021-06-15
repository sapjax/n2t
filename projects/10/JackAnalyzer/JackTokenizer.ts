import fs, { ReadStream } from 'fs'
import { TokenType, KEYWORDS, SYMBOLS, IDENTIFIER_REG } from './grammar'

enum State {
  blank,
  token,
  string,
  comment,
  multiComment,
  commentOrDivision,
}

class JackTokenizer {
  #path: string
  #readable: ReadStream
  #finished = false

  #state = State.blank

  constructor(path: string) {
    this.#path = path
    this.#readable = fs.createReadStream(this.#path, {
      encoding: 'utf8',
    })
  }

  async ready() {
    return new Promise(resolve => {
      this.#readable.on('readable', resolve)
    })
  }

  #readChar() {
    const char = this.#readable.read(1)
    if (char === null) {
      this.#finished = true
    }
    return char
  }

  hasMoreTokens(): boolean {
    return !this.#finished
  }

  advance() {
    return this.#_advance(this.#pendingChars)
  }

  #pendingChars: string[] = []

  #_advance(charQueue: string[]): void {
    const prevChar = charQueue[charQueue.length - 1]
    let char = this.#pendingChars[0] || this.#readChar()
    this.#pendingChars = []

    if (this.#finished) {
      console.log('finished')
      return
    }

    switch (char) {
      case '/':
        // //
        if (this.#state === State.commentOrDivision) {
          this.#state = State.comment
          charQueue = []
        }
        // /
        if (this.#state === State.blank) {
          this.#state = State.commentOrDivision
          charQueue = [char]
        }
        // */
        if (this.#state === State.multiComment) {
          if (prevChar === '*') {
            this.#state = State.blank
            charQueue = []
          }
        }
        break
      case '*':
        // /*
        if (this.#state === State.commentOrDivision) {
          this.#state = State.multiComment
          charQueue = []
          // 2 *
        } else if (
          this.#state !== State.string &&
          this.#state !== State.comment &&
          this.#state !== State.multiComment
        ) {
          this.#state = State.blank
          return this.#match([char])
        } else {
          charQueue.push(char)
        }
        break
      case '"':
        if (this.#state === State.string) {
          this.#state = State.blank
          return this.#match(charQueue, true)
        }
        if (this.#state === State.blank) {
          this.#state = State.string
        }
        break
      // space and tab
      case ' ':
      case '	':
        if (this.#state === State.blank) {
          charQueue = []
        } else if (this.#state === State.token) {
          this.#state = State.blank
          return this.#match(charQueue)
        } else if (this.#state === State.commentOrDivision) {
          this.#state = State.blank
          return this.#match([prevChar])
        } else if (this.#state === State.string) {
          charQueue.push(char)
        }
        break
      case '\r':
        if (this.#state === State.token) {
          this.#state = State.blank
          return this.#match(charQueue)
        }
        break
      case '\n':
        if (
          this.#state !== State.string &&
          this.#state !== State.multiComment
        ) {
          this.#state = State.blank
          charQueue = []
        }
        break
      default:
        if (this.#state === State.token) {
          if (this.#findSymbol(char)) {
            this.#pendingChars = [char]
            this.#state = State.blank
            return this.#match(charQueue)
          }
        } else if (this.#state === State.blank) {
          if (this.#findSymbol(char)) {
            this.#state = State.blank
            return this.#match([char])
          }
        }

        if (this.#state === State.commentOrDivision) {
          this.#state = State.blank
          this.#pendingChars = [char]
          return this.#match([prevChar])
        } else if (this.#state === State.blank) {
          this.#state = State.token
        }

        charQueue.push(char)
    }
    return this.#_advance(charQueue)
  }

  #token = ''

  #match(chars: string[], isString = false): void {
    const token = chars.join('')
    if (isString) {
      this.#tokenType = TokenType.STRING_CONST
    } else if (this.#findSymbol(token)) {
      this.#tokenType = TokenType.SYMBOL
    } else if (token in KEYWORDS) {
      this.#tokenType = TokenType.KEYWORD
    } else if (/^\d+$/.test(token)) {
      this.#tokenType = TokenType.INT_CONST
    } else if (IDENTIFIER_REG.test(token)) {
      this.#tokenType = TokenType.IDENTIFIER
    } else {
      console.error(`syntax error: '${token}'`)
    }

    this.#token = token
  }

  #tokenType: TokenType = TokenType.SYMBOL

  #findSymbol(char: string) {
    return Object.values(SYMBOLS).find(o => o === char)
  }

  token() {
    return this.#token
  }

  tokenType(): TokenType {
    return this.#tokenType
  }

  keyWord(): KEYWORDS {
    return this.#token as KEYWORDS
  }

  symbol(): SYMBOLS {
    return this.#token as SYMBOLS
  }

  identifier(): string {
    return this.#token
  }

  intVal(): string {
    return this.#token
  }

  stringVal(): string {
    return this.#token
  }
}

export default JackTokenizer
