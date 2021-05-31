const lineReader = require('./line-reader')
const COMMAND_TYPE = require('./commandType')

class Parser {
  constructor(path) {
    this.path = path
  }

  async ready() {
    return new Promise(resolve => {
      lineReader.open(this.path, (err, reader) => {
        if (err) throw err
        this._lineReader = reader
        resolve()
      })
    })
  }

  async _getNextLine() {
    return new Promise(resolve => {
      this._lineReader.nextLine((err, line) => {
        if (err) throw err
        resolve(line)
      })
    })
  }

  /**
   * Are there more commands in the input?
   */
  hasMoreCommands() {
    return this._lineReader.hasNextLine()
  }

  _trimSpace(line) {
    const lienWithoutComment = line.split('//')[0] || ''
    return lienWithoutComment.trim()
  }

  /**
   * Reads the next command from the input and makes it the current
   * command.Should be called only if hasMoreCommands()is true.
   * Initially there is no current command
   */
  async advance() {
    const line = await this._getNextLine()
    const statement = this._trimSpace(line)
    const elements = statement.split(/\s+/)

    switch (elements[0]) {
      case '':
        // if no command, advance to next line
        return await this.advance()
      case 'add':
      case 'sub':
      case 'eq':
      case 'lt':
      case 'gt':
      case 'neg':
      case 'and':
      case 'or':
      case 'not':
        this._currentCommandType = COMMAND_TYPE.C_ARITHMETIC
        break
      case 'push':
        this._currentCommandType = COMMAND_TYPE.C_PUSH
        break
      case 'pop':
        this._currentCommandType = COMMAND_TYPE.C_POP
        break
      case 'label':
        this._currentCommandType = COMMAND_TYPE.C_LABEL
        break
      case 'goto':
        this._currentCommandType = COMMAND_TYPE.C_GOTO
        break
      case 'if-goto':
        this._currentCommandType = COMMAND_TYPE.C_IF
        break
      case 'function':
        this._currentCommandType = COMMAND_TYPE.C_FUNCTION
        break
      case 'call':
        this._currentCommandType = COMMAND_TYPE.C_CALL
        break
      case 'return':
        this._currentCommandType = COMMAND_TYPE.C_RETURN
        break
      default:
    }

    this.elements = elements
  }

  /**
   * Returns the type of the current VM command.
   * C_ARITHMETIC is returned for all the arithmetic commands.
   */
  commandType() {
    return this._currentCommandType
  }

  command() {
    return this.elements[0]
  }

  /**
   * Returns the first argument of the current command. In the case of C_ARITHMETIC,
   * the command itself (add, sub, etc.) is returned.
   * Should not be called if the current command is C_RETURN.
   */
  arg1() {
    if (this.commandType() === COMMAND_TYPE.C_ARITHMETIC) {
      return this.elements[0]
    }
    return this.elements[1]
  }

  /**
   * Returns the second argument of the current command.
   * Should be called only * if the current command is C_PUSH, C_POP, C_FUNCTION, or C_CALL.
   */
  arg2() {
    return this.elements[2]
  }
}

module.exports = Parser
