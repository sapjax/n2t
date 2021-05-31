const fs = require('fs')
const { EOL } = require('os')

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
    this.fileName = 'bootstrap'
    this._currentFunctionName = 'bootstrap'
    this._jumpLabelIndex = 0
    this._fnNameIndexMap = {}
    this._writeQueue = []
    this.writer = fs.createWriteStream(outputFile, {
      flags: 'w',
    })
  }

  setFileName(fileName) {
    this.fileName = fileName[0].toUpperCase() + fileName.slice(1).toLowerCase()
  }

  _write(data) {
    this._writeQueue.push(data + EOL)
  }

  _writeAhead(data) {
    this._writeQueue.unshift(data + EOL)
  }

  async close() {
    const data = this._writeQueue.join(EOL)
    return new Promise(resolve => {
      this.writer.write(data, () => {
        this.writer.end()
        resolve()
      })
    })
  }

  /**
   * Writes the assembly code that is the translation of the given arithmetic command.
   */
  writeArithmetic(command) {
    const instructions = [
      this._addComment(command),
      ...this._transArithmetic(command),
    ]
    this._write(instructions.join(EOL))
  }

  /**
   * Writes the assembly code that is the translation of the given command,
   * where command is either C_PUSH or C_POP.
   */
  writePushPop(command, segment, index) {
    const instructions = [
      this._addComment(`${command}, ${segment} ${index}`),
      ...this._transPushOrPop(command, segment, index),
    ]
    this._write(instructions.join(EOL))
  }

  /**
   * Writes assembly code that effects the VM initialization, also called bootstrap code.
   * This code must be placed at the beginning of the output file.
   */
  writeInit() {
    const instructions = [
      this._addComment('bootstrap'),
      // SP = 256
      '@256',
      'D=A',
      '@SP',
      'M=D',
      ...this._getCallInstructions('Sys.init', 0),
    ]
    this._writeAhead(instructions.join(EOL))
  }

  writeLabel(label) {
    this._write(`(${this._getFullLabel(label)})`)
  }

  writeGoto(label) {
    const instructions = [
      this._addComment(`goto ${label}`),
      `@${this._getFullLabel(label)}`,
      `0;JMP`,
    ]
    this._write(instructions.join(EOL))
  }

  /**
   * Writes assembly code that effects the if-goto command
   */
  writeIf(label) {
    const instructions = [
      // *sp--
      // if *(sp-1) !=0  jump
      this._addComment(`if-goto ${label}`),
      '@SP',
      'M=M-1',
      'A=M',
      'D=M',
      `@${this._getFullLabel(label)}`,
      'D;JNE',
    ]
    this._write(instructions.join(EOL))
  }

  /**
   * function SimpleFunction.test 2
   */
  writeFunction(fnName, localVarLength) {
    console.log('writeFunction', fnName)
    this._currentFunctionName = fnName

    if (fnName === 'Sys.init') {
      console.log('Sys.init')
      this.writeInit()
    }

    let preparedLocals = []

    for (let i = 0; i < localVarLength; i++) {
      preparedLocals = preparedLocals.concat(this._pushConstant(0))
    }

    const instructions = [
      this._addComment(`function ${fnName} ${localVarLength}`),
      `(${this._getFunctionLabel(fnName)})`,
      ...preparedLocals,
    ]
    this._write(instructions.join(EOL))
  }

  _getCallInstructions(fnName, argLength) {
    const retAddrLabel = this._getRetAddrLabel()
    console.log('writeCall', fnName, retAddrLabel)
    this._increaseCallIndex()
    console.log(this._fnNameIndexMap)

    const setSpThenNext = ['D=M', '@SP', 'A=M', 'M=D', '@SP', 'M=M+1']

    const instructions = [
      this._addComment(`call ${fnName} ${argLength}`),
      // *SP = @retAddr
      this._addComment(`push retAddr`),
      '@' + retAddrLabel,
      'D=A',
      '@SP',
      'A=M',
      'M=D',
      '@SP',
      'M=M+1',

      // saved segments
      this._addComment(`save ${this._currentFunctionName} state`),
      this._addComment(`push LCL`),
      '@LCL',
      ...setSpThenNext,
      this._addComment(`push ARG`),
      '@ARG',
      ...setSpThenNext,
      this._addComment(`push THIS`),
      '@THIS',
      ...setSpThenNext,
      this._addComment(`push THAT`),
      '@THAT',
      ...setSpThenNext,

      this._addComment(`rePosition ${this._currentFunctionName} ARG`),
      // *ARG = *SP - 5 - argLength
      '@' + (5 + argLength * 1), // offset
      'D=A',
      '@SP',
      'D=M-D',
      '@ARG',
      'M=D',

      // *LCL = *SP
      this._addComment(`rePosition ${this._currentFunctionName} LCL`),
      '@SP',
      'D=M',
      '@LCL',
      'M=D',

      // goto fnName
      '@' + this._getFunctionLabel(fnName),
      '0;JMP',

      // (returnAddress)
      this._addComment(`return Address: call ${fnName} ${argLength}`),
      '(' + retAddrLabel + ')',
    ]
    return instructions
  }

  writeCall(fnName, argLength) {
    const instructions = this._getCallInstructions(fnName, argLength)
    this._write(instructions.join(EOL))
  }

  writeReturn() {
    const instructions = [
      this._addComment(`write ${this._currentFunctionName} return`),
      '@LCL',
      'D=M',
      '@endFrame',
      'M=D',

      '@5',
      'A=D-A',
      'D=M',
      '@retAddr',
      'M=D',

      // *ARG = pop()
      '// *ARG = pop()',
      '@SP',
      'A=M-1',
      'D=M',
      '@ARG',
      'A=M',
      'M=D',

      // SP = ARG + 1
      '// SP = ARG + 1',
      '@ARG',
      'D=M',
      '@SP',
      'M=D+1',

      // THAT = *(endFrame -1)
      '// THAT = *(endFrame -1)',
      '@endFrame',
      'A=M-1',
      'D=M',
      '@THAT',
      'M=D',

      // THIS = *(endFrame -2)
      '// THIS = *(endFrame -2)',
      '@2',
      'D=A',
      '@endFrame',
      'A=M-D',
      'D=M',
      '@THIS',
      'M=D',

      // ARG = *(endFrame -3)
      '// ARG = *(endFrame -3)',
      '@3',
      'D=A',
      '@endFrame',
      'A=M-D',
      'D=M',
      '@ARG',
      'M=D',

      // LCL = *(endFrame -4)
      '// LCL = *(endFrame -4)',
      '@4',
      'D=A',
      '@endFrame',
      'A=M-D',
      'D=M',
      '@LCL',
      'M=D',

      // do recycle

      // goto retAddr
      '// goto retAddr',
      '@retAddr',
      'A=M',
      '0;JMP',
    ]

    this._write(instructions.join(EOL))
  }

  _addComment(comment) {
    return `// ${comment}`
  }

  _getFunctionLabel(fnName) {
    return `${fnName}`
  }

  _getFullLabel(label) {
    return `${this._currentFunctionName}$${label}`
  }

  // Xxx.foo$ret.i
  _getRetAddrLabel() {
    const fnName = this._currentFunctionName
    const index = this._fnNameIndexMap[fnName] || 0
    return `${fnName}$ret.${index}`
  }

  _increaseCallIndex() {
    this._fnNameIndexMap[this._currentFunctionName] =
      (this._fnNameIndexMap[this._currentFunctionName] || 0) + 1
  }

  _createJumpLabel(jumpInstruction) {
    const trueLabelName = `J_true_${this._jumpLabelIndex}`
    this._jumpLabelIndex++
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

  _pushStatic(index) {
    const symbol = `${this.fileName}.${index}`
    return ['@' + symbol, 'D=M', '@SP', 'A=M', 'M=D', '@SP', 'M=M+1']
  }
  _popStatic(index) {
    const symbol = `${this.fileName}.${index}`
    return ['@SP', 'A=M-1', 'D=M', '@' + symbol, 'M=D', '@SP', 'M=M-1']
  }

  /**
   * *SP = i
   * SP++
   */
  _pushConstant(i) {
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
        return isPush ? this._pushStatic(index) : this._popStatic(index)
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
}

module.exports = CodeWriter
