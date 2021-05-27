const fs = require('fs')
const path = require('path')

const COMMANDS = {
  ADD: 'add',
  SUB: 'sub',
  EQ: 'eq',
  LT: 'lt',
  GT: 'gt',
  NEG: 'neg',
  AND: 'and',
  OR: 'or',
  NOT: 'not',
  PUSH: 'push',
  POP: 'pop',
}

const SEGMENTS = {
  ARGUMENT: 'argument',
  LOCAL: 'local',
  THIS: 'this',
  THAT: 'that',
  CONSTANT: 'constant',
  STATIC: 'static',
  TEMP: 'temp',
  POINTER: 'pointer',
}

class CodeWriter {
  constructor(outputFile) {
    this.setFileName(outputFile)
  }

  setFileName(outputFile) {
    this.fileName = path.basename(outputFile, '.vm')
    this.writer = fs.createWriteStream(outputFile, {
      flags: 'w',
    })
  }

  async _write(data) {
    return new Promise(resolve => {
      this.writer.write(data, resolve)
    })
  }

  /**
   * Writes the assembly code that is the translation of the given arithmetic command.
   */
  async writeArithmetic(command) {
    const instructions = this._transArithmetic(command)
    await this._write(instructions.join('\n') + '\n')
  }

  jumpLabelIndex = 0

  _createJumpLabel(jumpInstruction) {
    const trueLabelName = `J_true_${this.jumpLabelIndex}`
    this.jumpLabelIndex++
    return [
      'M=-1',
      `@${trueLabelName}`,
      jumpInstruction,
      '@2',
      'D=A',
      '@SP',
      'A=M-D',
      'M=0',
      `(${trueLabelName})`,
    ]
  }

  _transArithmetic(command) {
    const twoArgPrepare = ['@SP', 'A=M-1', 'D=M', 'A=A-1']
    switch (command) {
      case COMMANDS.ADD:
        return [...twoArgPrepare, 'D=D+M', 'M=D', '@SP', 'M=M-1']
      case COMMANDS.SUB:
        return [...twoArgPrepare, 'D=D-M', 'M=-D', '@SP', 'M=M-1']
      case COMMANDS.EQ:
        return [
          ...twoArgPrepare,
          'D=D-M',
          ...this._createJumpLabel('D;JEQ'),
          '@SP',
          'M=M-1',
        ]
      case COMMANDS.GT:
        return [
          ...twoArgPrepare,
          'D=D-M',
          ...this._createJumpLabel('-D;JGT'),
          '@SP',
          'M=M-1',
        ]
      case COMMANDS.LT:
        return [
          ...twoArgPrepare,
          'D=D-M',
          ...this._createJumpLabel('-D;JLT'),
          '@SP',
          'M=M-1',
        ]
      case COMMANDS.AND:
        return [...twoArgPrepare, 'D=D&M', 'M=D', '@SP', 'M=M-1']
      case COMMANDS.OR:
        return [...twoArgPrepare, 'D=D|M', 'M=D', '@SP', 'M=M-1']
      case COMMANDS.NEG:
        return ['@SP', 'A=M-1', 'D=-M', 'M=D']
      case COMMANDS.NOT:
        return ['@SP', 'A=M-1', 'D=!M', 'M=D']
      default:
        return []
    }
  }

  _pointerIsNumber(pointer) {
    return !isNaN(pointer)
  }

  /**
   * addr = segmentPointer + i
   * *SP = *addr
   * SP++
   */
  _pushSegmentPointer(pointer, index) {
    return [
      // addr = segmentPointer + i
      '@' + index,
      'D=A',
      '@' + pointer,
      this._pointerIsNumber(pointer) ? 'A=D+A' : 'A=D+M',
      // *SP = *addr
      'D=M',
      '@SP',
      'A=M',
      'M=D',

      // SP++
      '@SP',
      'M=M+1',
    ]
  }

  /**
   * addr = segmentPointer + i
   * SP--
   * *addr = *SP
   */
  _popSegmentPointer(pointer, index) {
    return [
      // addr = segmentPointer + i
      '@' + index,
      'D=A',
      '@' + pointer,
      this._pointerIsNumber(pointer) ? 'D=D+A' : 'D=D+M',
      '@addr',
      'M=D',

      // SP--
      '@SP',
      'M=M-1',

      //*SP
      'A=M',
      'D=M',
      // *addr = *SP
      '@addr',
      'A=M',
      'M=D',
    ]
  }

  /**
   * *SP = i
   * SP++
   */
  _pushConstant(i) {
    console.log(i)
    return [
      '@' + i,
      'D=A',
      '@SP',
      'A=M',
      'M=D',
      // SP++
      '@SP',
      'M=M+1',
    ]
  }

  _transPointer(isPush, index) {
    if (isPush) {
      return [
        // *SP = @THIS
        Number(index) === 0 ? '@THIS' : '@THAT',
        'D=M',
        '@SP',
        'A=M',
        'M=D',
        // SP++
        '@SP',
        'M=M+1',
      ]
    } else {
      return [
        // SP--
        '@SP',
        'M=M-1',
        // *THIS = *sp
        //*SP
        'A=M',
        'D=M',
        Number(index) === 0 ? '@THIS' : '@THAT',
        'M=D',
      ]
    }
  }

  _transPushOrPop(command, segment, index) {
    let pointer,
      i = index

    const isPush = command === COMMANDS.PUSH

    switch (segment) {
      case SEGMENTS.CONSTANT:
        return isPush ? this._pushConstant(i) : []
      case SEGMENTS.ARGUMENT:
        pointer = 'ARG'
        break
      case SEGMENTS.LOCAL:
        pointer = 'LCL'
        break
      case SEGMENTS.THIS:
        pointer = 'THIS'
        break
      case SEGMENTS.THAT:
        pointer = 'THAT'
        break
      case SEGMENTS.STATIC:
        pointer = `${this.fileName}.${index}`
        break
      case SEGMENTS.TEMP:
        pointer = '5'
        break
      case SEGMENTS.POINTER:
        return this._transPointer(isPush, index)
      default:
    }
    return isPush
      ? this._pushSegmentPointer(pointer, i)
      : this._popSegmentPointer(pointer, i)
  }

  /**
   * Writes the assembly code that is the translation of the given command,
   * where command is either C_PUSH or C_POP.
   */
  async writePushPop(command, segment, index) {
    const instructions = this._transPushOrPop(command, segment, index)
    await this._write(instructions.join('\n') + '\n')
  }

  close() {
    this.writer.end()
  }
}

module.exports = CodeWriter
