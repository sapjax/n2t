import { TokenType, KEYWORDS, SYMBOLS, IDENTIFIER_REG, KIND } from './grammar'
import Tokenizer from './JackTokenizer'
import SymbolTable from './SymbolTable'
import VMWriter from './VMWriter'
import { COMMANDS, SEGMENTS } from './vmType'

class CompilationEngine {
  #tokenize: Tokenizer
  #symbolTable: SymbolTable
  #vmWriter: VMWriter

  constructor(inputPath: string, outputPath: string) {
    this.#tokenize = new Tokenizer(inputPath)
    this.#symbolTable = new SymbolTable()
    this.#vmWriter = new VMWriter(outputPath)
  }

  async run() {
    await this.#tokenize.ready()
    this.#next()
    await this.compileClass()
    await this.#vmWriter.close()
  }

  #ifType(type: TokenType, tokens?: string[]) {
    const token = this.#tokenize.token()

    if (this.#tokenize.tokenType() !== type) {
      return false
    }
    if (type === TokenType.IDENTIFIER && !IDENTIFIER_REG.test(token)) {
      return false
    }
    if (tokens && !tokens.find(t => t === token)) {
      return false
    }
    return true
  }

  #verify(type: TokenType, tokens?: string[]) {
    let verified = this.#ifType(type, tokens)
    // console.log('verify: ', type, tokens)
    if (!verified) throw new Error(`syntax error: ${type} [${tokens}]`)
  }

  #isPendingNext = false

  #next() {
    if (this.#isPendingNext) {
      this.#isPendingNext = false
      return
    }
    this.#tokenize.advance()
  }

  #getKeyword() {
    return this.#tokenize.keyWord()
  }

  #getIdentifier() {
    return this.#tokenize.identifier()
  }

  #getIntVal() {
    return this.#tokenize.intVal()
  }

  #getStringVal() {
    return this.#tokenize.stringVal()
  }

  #className = ''

  compileClass() {
    // class
    this.#verify(TokenType.KEYWORD, [KEYWORDS.class])

    // Main
    this.#next()
    this.#verify(TokenType.IDENTIFIER)
    this.#className = this.#getIdentifier()

    // {
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])

    let inClassBody = true

    // ('static' | 'field') type varName (',' varName)* ';'
    // ('constructor' | 'function' | 'method')
    while (inClassBody) {
      this.#next()
      const keyWord = this.#tokenize.keyWord()

      if (this.#ifType(TokenType.KEYWORD)) {
        switch (keyWord) {
          case KEYWORDS.static:
          case KEYWORDS.field:
            this.compileClassVarDec()
            break
          case KEYWORDS.constructor:
          case KEYWORDS.function:
          case KEYWORDS.method:
            this.compileSubroutine()
            break
        }
      } else {
        inClassBody = false
      }
    }

    // }
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])
  }

  // static int x,y,z;
  // field Square s;
  compileClassVarDec() {
    this.compileVarDec(true)
  }

  #getType() {
    // Square
    if (this.#ifType(TokenType.IDENTIFIER)) {
      return this.#tokenize.identifier()
    } else {
      // int | char | boolean
      this.#verify(TokenType.KEYWORD, [
        KEYWORDS.int,
        KEYWORDS.char,
        KEYWORDS.boolean,
        KEYWORDS.void,
      ])
      return this.#tokenize.keyWord()
    }
  }

  compileSubroutine() {
    // function
    const keyword = this.#getKeyword()

    this.#symbolTable.startSubroutine()

    // define argument 0 to this
    if (keyword === KEYWORDS.method) {
      this.#symbolTable.define('this', this.#className, KIND.arguments)
    }

    // void
    this.#next()

    // main
    this.#next()
    this.#verify(TokenType.IDENTIFIER)

    const name = this.#getIdentifier()

    // (
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])

    // int a, int b
    this.compileParameterList()

    // )
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])

    // {
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])

    // var int a,b
    // var boolean x,y
    let varLoop = true
    while (varLoop) {
      this.#next()
      const hasVar = this.#ifType(TokenType.KEYWORD, [KEYWORDS.var])
      if (hasVar) {
        this.compileVarDec()
      } else {
        varLoop = false
        this.#isPendingNext = true
      }
    }

    const nLocals = this.#symbolTable.varCount(KIND.local)
    this.#vmWriter.writeFunction(`${this.#className}.${name}`, nLocals)

    // if constructor, alloc memory, and set this
    if (keyword === KEYWORDS.constructor) {
      const nFields = this.#symbolTable.varCount(KIND.field)
      this.#vmWriter.writePush(SEGMENTS.CONST, nFields)
      this.#vmWriter.writeCall('Memory.alloc', 1)
      this.#vmWriter.writePop(SEGMENTS.POINTER, 0)
    }

    // if method, set `this` from arguments 0
    if (keyword === KEYWORDS.method) {
      this.#vmWriter.writePush(SEGMENTS.ARG, 0)
      this.#vmWriter.writePop(SEGMENTS.POINTER, 0)
    }

    this.compileStatements()

    // }
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])
  }

  // int a, int b
  compileParameterList() {
    this.#next()
    // not )
    if (!this.#ifType(TokenType.SYMBOL)) {
      // int
      const type = this.#getType()
      // a
      this.#next()
      this.#verify(TokenType.IDENTIFIER)
      const id = this.#getIdentifier()
      this.#symbolTable.define(id, type, KIND.arguments)

      //, int b, int c
      let loop = true
      while (loop) {
        this.#next()
        // ,
        if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.comma])) {
          // int
          this.#next()
          const type = this.#getType()

          // b
          this.#next()
          this.#verify(TokenType.IDENTIFIER)
          const id = this.#getIdentifier()
          this.#symbolTable.define(id, type, KIND.arguments)
        } else {
          loop = false
        }
      }
    }
  }

  #kindToSegment(kind: KIND): SEGMENTS {
    switch (kind) {
      case KIND.arguments:
        return SEGMENTS.ARG
      case KIND.field:
        return SEGMENTS.THIS
      case KIND.static:
        return SEGMENTS.STATIC
      case KIND.local:
        return SEGMENTS.LOCAL
    }
  }

  #keywordToKind(keyword: KEYWORDS): KIND {
    switch (keyword) {
      case KEYWORDS.static:
        return KIND.static
      case KEYWORDS.field:
        return KIND.field
      case KEYWORDS.var:
        return KIND.local
      default:
        return KIND.arguments
    }
  }

  // var int x,y,z;
  // var Square x,y;
  compileVarDec(isClassVarDec?: boolean) {
    const kind = this.#keywordToKind(this.#getKeyword())

    this.#next()
    const type = this.#getType()

    this.#next()
    this.#verify(TokenType.IDENTIFIER)

    const id = this.#getIdentifier()
    this.#symbolTable.define(id, type, kind)

    // ,y,z
    let loop = true
    while (loop) {
      this.#next()
      if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.comma])) {
        this.#next()
        this.#verify(TokenType.IDENTIFIER)

        const id = this.#getIdentifier()
        this.#symbolTable.define(id, type, kind)
      } else {
        loop = false
      }
    }

    // ;
    this.#verify(TokenType.SYMBOL, [SYMBOLS.semicolon])
  }

  // statement*
  compileStatements() {
    let loop = true
    while (loop) {
      this.#next()
      if (
        this.#ifType(TokenType.KEYWORD, [
          KEYWORDS.let,
          KEYWORDS.if,
          KEYWORDS.while,
          KEYWORDS.do,
          KEYWORDS.return,
        ])
      ) {
        switch (this.#tokenize.keyWord()) {
          case KEYWORDS.let:
            this.compileLet()
            break
          case KEYWORDS.if:
            this.compileIf()
            break
          case KEYWORDS.while:
            this.compileWhile()
            break
          case KEYWORDS.do:
            this.compileDo()
            break
          case KEYWORDS.return:
            this.compileReturn()
            break
        }
      } else {
        loop = false
      }
    }
  }

  // do moveLeft(2+3)
  // do Square.moveLeft(2+3)
  compileDo() {
    // do

    // Square | moveLeft
    this.#next()
    this.#verify(TokenType.IDENTIFIER)
    let objectName = this.#getIdentifier()
    let fnName = ''

    this.#next()

    if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.dot])) {
      // .
      this.#next()
      // moveLeft
      this.#verify(TokenType.IDENTIFIER)
      fnName = this.#getIdentifier()
      this.#next()
    }

    // (
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])

    const kind = this.#symbolTable.kindOf(objectName)
    const index = this.#symbolTable.indexOf(objectName)
    const type = this.#symbolTable.typeOf(objectName)

    if (fnName) {
      // boat.moveLeft(5)
      if (type) {
        this.#vmWriter.writePush(this.#kindToSegment(kind), index)
        const nArgs = this.compileExpressionList()
        this.#vmWriter.writeCall(`${type}.${fnName}`, nArgs + 1)
        // Array.new(5)
      } else {
        const nArgs = this.compileExpressionList()
        this.#vmWriter.writeCall(`${objectName}.${fnName}`, nArgs)
      }
      // moveLeft(5)
    } else {
      this.#vmWriter.writePush(SEGMENTS.POINTER, 0)
      const nArgs = this.compileExpressionList()
      this.#vmWriter.writeCall(`${this.#className}.${objectName}`, nArgs + 1)
    }

    // )
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])

    this.#vmWriter.writePop(SEGMENTS.TEMP, 0)

    // ;
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.semicolon])
  }

  // 'let' varName('[' expression ']')? '=' expression ';'
  compileLet() {
    // let

    // varName
    this.#next()
    this.#verify(TokenType.IDENTIFIER)
    const name = this.#getIdentifier()
    const kind = this.#symbolTable.kindOf(name)
    const index = this.#symbolTable.indexOf(name)

    let leftIsArray = false

    this.#next()
    // [
    if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.lBracket])) {
      leftIsArray = true

      this.compileExpression()

      this.#vmWriter.writePush(this.#kindToSegment(kind), index)
      this.#vmWriter.writeArithmetic(COMMANDS.ADD)

      // ]
      this.#verify(TokenType.SYMBOL, [SYMBOLS.rBracket])
      this.#next()
    }

    // =
    this.#verify(TokenType.SYMBOL, [SYMBOLS.eq])

    this.compileExpression()

    if (leftIsArray) {
      // a[i] = b[j]
      // cache b[j] to temp 0
      this.#vmWriter.writePop(SEGMENTS.TEMP, 0)
      // set that to a[i]
      this.#vmWriter.writePop(SEGMENTS.POINTER, 1)
      // push b[j]
      this.#vmWriter.writePush(SEGMENTS.TEMP, 0)
      // a[i] = b[j]
      this.#vmWriter.writePop(SEGMENTS.THAT, 0)
    } else {
      // sum = expression
      this.#vmWriter.writePop(this.#kindToSegment(kind), index)
    }

    // ;
    this.#verify(TokenType.SYMBOL, [SYMBOLS.semicolon])
  }

  compileReturn() {
    // return
    this.#next()

    if (!this.#ifType(TokenType.SYMBOL, [SYMBOLS.semicolon])) {
      this.#isPendingNext = true
      this.compileExpression()
    } else {
      // for void function
      this.#vmWriter.writePush(SEGMENTS.CONST, 0)
    }

    this.#vmWriter.writeReturn()

    // ;
    this.#verify(TokenType.SYMBOL, [SYMBOLS.semicolon])
  }

  #ifIndex = 0

  // 'if' '(' expression ')' '{' statements '}'
  compileIf() {
    // if

    const index = this.#ifIndex
    const trueLabel = `IF_TRUE${index}`
    const elseLabel = `IF_FALSE${index}`
    const endLabel = `IF_END${index}`
    this.#ifIndex++

    // (
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])

    this.compileExpression()
    // )
    this.#vmWriter.writeArithmetic(COMMANDS.NOT)
    this.#vmWriter.writeIf(elseLabel)
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])

    // {
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])

    this.compileStatements()
    this.#vmWriter.writeGoto(endLabel)

    // }
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])

    // else
    this.#next()
    this.#vmWriter.writeLabel(elseLabel)
    if (this.#ifType(TokenType.KEYWORD, [KEYWORDS.else])) {
      // {
      this.#next()
      this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])

      this.compileStatements()

      // }
      this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])
    } else {
      this.#isPendingNext = true
    }
    this.#vmWriter.writeLabel(endLabel)
  }

  #whileIndex = 0

  // 'while' '(' expression ')' '{' statements '}'
  compileWhile() {
    // while

    // (
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])

    const index = this.#whileIndex
    const expLabel = `WHILE_EXP${index}`
    const endLabel = `WHILE_END${index}`
    this.#whileIndex++

    this.#vmWriter.writeLabel(expLabel)
    this.compileExpression()
    this.#vmWriter.writeArithmetic(COMMANDS.NOT)
    this.#vmWriter.writeIf(endLabel)

    // )
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])

    // {
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])

    this.compileStatements()
    this.#vmWriter.writeGoto(expLabel)
    this.#vmWriter.writeLabel(endLabel)
    // }
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])
  }

  compileExpression() {
    this.compileTerm()

    let loop = true
    while (loop) {
      this.#next()
      if (
        this.#ifType(TokenType.SYMBOL, [
          SYMBOLS.add,
          SYMBOLS.sub,
          SYMBOLS.multiply,
          SYMBOLS.divide,
          SYMBOLS.and,
          SYMBOLS.or,
          SYMBOLS.lt,
          SYMBOLS.gt,
          SYMBOLS.eq,
          SYMBOLS.not,
        ])
      ) {
        const symbol = this.#tokenize.symbol()

        this.compileTerm()

        switch (symbol) {
          case SYMBOLS.add:
            this.#vmWriter.writeArithmetic(COMMANDS.ADD)
            break
          case SYMBOLS.sub:
            this.#vmWriter.writeArithmetic(COMMANDS.SUB)
            break
          case SYMBOLS.and:
            this.#vmWriter.writeArithmetic(COMMANDS.AND)
            break
          case SYMBOLS.or:
            this.#vmWriter.writeArithmetic(COMMANDS.OR)
            break
          case SYMBOLS.lt:
            this.#vmWriter.writeArithmetic(COMMANDS.LT)
            break
          case SYMBOLS.gt:
            this.#vmWriter.writeArithmetic(COMMANDS.GT)
            break
          case SYMBOLS.eq:
            this.#vmWriter.writeArithmetic(COMMANDS.EQ)
            break
          case SYMBOLS.not:
            this.#vmWriter.writeArithmetic(COMMANDS.NOT)
            break
          case SYMBOLS.divide:
            this.#vmWriter.writeCall('Math.divide', 2)
            break
          case SYMBOLS.multiply:
            this.#vmWriter.writeCall('Math.multiply', 2)
            break
        }
      } else {
        loop = false
      }
    }
  }

  compileTerm() {
    this.#next()

    switch (this.#tokenize.tokenType()) {
      case TokenType.INT_CONST:
        const val = Number(this.#getIntVal())
        this.#vmWriter.writePush(SEGMENTS.CONST, val)
        break
      case TokenType.STRING_CONST:
        const str = this.#getStringVal()
        const length = str.length

        this.#vmWriter.writePush(SEGMENTS.CONST, length)
        this.#vmWriter.writeCall('String.new', 1)
        str.split('').forEach(s => {
          this.#vmWriter.writePush(SEGMENTS.CONST, s.codePointAt(0) as number)
          this.#vmWriter.writeCall('String.appendChar', 2)
        })
        break
      case TokenType.KEYWORD:
        if (
          this.#ifType(TokenType.KEYWORD, [
            KEYWORDS.false,
            KEYWORDS.true,
            KEYWORDS.null,
            KEYWORDS.this,
          ])
        ) {
          const keyword = this.#getKeyword()

          switch (keyword) {
            case KEYWORDS.null:
            case KEYWORDS.false:
              this.#vmWriter.writePush(SEGMENTS.CONST, 0)
              break
            case KEYWORDS.true:
              // -1
              this.#vmWriter.writePush(SEGMENTS.CONST, 0)
              this.#vmWriter.writeArithmetic(COMMANDS.NOT)
              break
            case KEYWORDS.this:
              this.#vmWriter.writePush(SEGMENTS.POINTER, 0)
              break
          }
        }
        break
      case TokenType.IDENTIFIER:
        const name = this.#getIdentifier()
        const kind = this.#symbolTable.kindOf(name)
        const index = this.#symbolTable.indexOf(name)
        const type = this.#symbolTable.typeOf(name)

        this.#next()
        // [
        if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.lBracket])) {
          this.compileExpression()

          this.#vmWriter.writePush(this.#kindToSegment(kind), index)
          this.#vmWriter.writeArithmetic(COMMANDS.ADD)
          this.#vmWriter.writePop(SEGMENTS.POINTER, 1)
          this.#vmWriter.writePush(SEGMENTS.THAT, 0)
          // ]
          this.#verify(TokenType.SYMBOL, [SYMBOLS.rBracket])
          this.#next()
        } else if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.dot])) {
          // ball.setX(2+3)
          // .
          this.#next()
          // moveLeft
          this.#verify(TokenType.IDENTIFIER)
          const fnName = this.#getIdentifier()
          this.#next()

          // (
          this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])

          if (type) {
            this.#vmWriter.writePush(this.#kindToSegment(kind), index)
            const nArgs = this.compileExpressionList()
            this.#vmWriter.writeCall(`${type}.${fnName}`, nArgs + 1)
          } else {
            const nArgs = this.compileExpressionList()
            this.#vmWriter.writeCall(`${name}.${fnName}`, nArgs)
          }

          // )
          this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
          this.#next()
        } else if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.lParenthesis])) {
          // (
          this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])

          this.#vmWriter.writePush(SEGMENTS.POINTER, 0)
          const nArgs = this.compileExpressionList()
          this.#vmWriter.writeCall(`${this.#className}.${name}`, nArgs + 1)

          // )
          this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
          this.#next()
        } else {
          this.#vmWriter.writePush(this.#kindToSegment(kind), index)
        }
        this.#isPendingNext = true
        break

      case TokenType.SYMBOL:
        const symbol = this.#tokenize.symbol()
        switch (symbol) {
          case SYMBOLS.lParenthesis:
            // (
            this.compileExpression()
            // )
            this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
            break
          case SYMBOLS.sub:
            // '-'
            this.compileTerm()
            this.#vmWriter.writeArithmetic(COMMANDS.NEG)
            break
          case SYMBOLS.not:
            // '~'
            this.compileTerm()
            this.#vmWriter.writeArithmetic(COMMANDS.NOT)
            break
        }
    }
  }

  // expression (',' expression)*
  compileExpressionList() {
    this.#next()
    this.#isPendingNext = true

    let nArgs = 0

    if (!this.#ifType(TokenType.SYMBOL, [SYMBOLS.rParenthesis])) {
      this.compileExpression()
      nArgs++
      this.#isPendingNext = true
    }

    let loop = true
    while (loop) {
      this.#next()
      if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.comma])) {
        this.compileExpression()
        nArgs++
        this.#isPendingNext = true
      } else {
        loop = false
      }
    }
    return nArgs
  }
}

export default CompilationEngine
