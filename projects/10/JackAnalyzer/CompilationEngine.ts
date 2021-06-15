import { TokenType, KEYWORDS, SYMBOLS, IDENTIFIER_REG } from './grammar'
import JackTokenizer from './JackTokenizer'
import { EOL } from 'os'

class CompilationEngine {
  #tokenize: JackTokenizer
  #writeQueue: string[] = []

  constructor(tokenize: JackTokenizer) {
    this.#tokenize = tokenize
    this.#next()
    this.compileClass()
  }

  getOutput() {
    return this.#writeQueue.join(EOL)
  }

  #push(code: string) {
    this.#writeQueue.push(code)
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
    if (!verified) throw new Error(`syntax error: ${type} ${tokens}`)
  }

  #isPendingNext = false
  #next() {
    if (this.#isPendingNext) {
      this.#isPendingNext = false
      return
    }
    this.#tokenize.advance()
  }

  #pushKeyword() {
    this.#push(`<keyword> ${this.#tokenize.keyWord()} </keyword>`)
  }

  #pushIdentifier() {
    this.#push(`<identifier> ${this.#tokenize.identifier()} </identifier>`)
  }

  #pushSymbol() {
    let symbol = this.#tokenize.symbol()
    switch (symbol) {
      case SYMBOLS.lt:
        symbol = '&lt;' as SYMBOLS
        break
      case SYMBOLS.gt:
        symbol = '&gt;' as SYMBOLS
        break
      case SYMBOLS.and:
        symbol = '&amp;' as SYMBOLS
        break
    }
    this.#push(`<symbol> ${symbol} </symbol>`)
  }

  #pushInteger() {
    this.#push(
      `<integerConstant> ${this.#tokenize.intVal()} </integerConstant>`
    )
  }

  #pushString() {
    this.#push(
      `<stringConstant> ${this.#tokenize.stringVal()} </stringConstant>`
    )
  }

  compileClass() {
    // class
    this.#verify(TokenType.KEYWORD, [KEYWORDS.class])
    this.#push(`<class>`)
    this.#pushKeyword()

    // Main
    this.#next()
    this.#verify(TokenType.IDENTIFIER)
    this.#pushIdentifier()

    // {
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])
    this.#pushSymbol()

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
    this.#pushSymbol()
    this.#push(`</class>`)
  }

  // static int x,y,z;
  // field Square s;
  compileClassVarDec() {
    this.compileVarDec(true)
  }

  #compileType() {
    // Square
    if (this.#ifType(TokenType.IDENTIFIER)) {
      this.#pushIdentifier()
    } else {
      // int | char | boolean
      this.#verify(TokenType.KEYWORD, [
        KEYWORDS.int,
        KEYWORDS.char,
        KEYWORDS.boolean,
        KEYWORDS.void,
      ])
      this.#pushKeyword()
    }
  }

  compileSubroutine() {
    this.#push('<subroutineDec>')
    // function
    this.#pushKeyword()

    // void
    this.#next()
    this.#compileType()

    // main
    this.#next()
    this.#verify(TokenType.IDENTIFIER)
    this.#pushIdentifier()

    // (
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])
    this.#pushSymbol()

    // int a, int b
    this.compileParameterList()

    // )
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
    this.#pushSymbol()

    this.#push(`<subroutineBody>`)

    // {
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])
    this.#pushSymbol()

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

    this.compileStatements()

    // }
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])
    this.#pushSymbol()
    this.#push(`</subroutineBody>`)

    this.#push(`</subroutineDec>`)
  }

  // int a, int b
  compileParameterList() {
    this.#push('<parameterList>')
    this.#next()
    // not )
    if (!this.#ifType(TokenType.SYMBOL)) {
      // int
      this.#compileType()
      // a
      this.#next()
      this.#verify(TokenType.IDENTIFIER)
      this.#pushIdentifier()

      //, int b, int c
      let loop = true
      while (loop) {
        this.#next()
        if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.comma])) {
          // ,
          this.#pushSymbol()
          // int
          this.#next()
          this.#compileType()

          // b
          this.#next()
          this.#verify(TokenType.IDENTIFIER)
          this.#pushIdentifier()
        } else {
          loop = false
        }
      }
    }

    this.#push('</parameterList>')
  }

  // var int x,y,z;
  // var Square x,y;
  compileVarDec(isClassVarDec?: boolean) {
    this.#push(isClassVarDec ? '<classVarDec>' : `<varDec>`)
    this.#pushKeyword()

    this.#next()
    this.#compileType()

    this.#next()
    this.#verify(TokenType.IDENTIFIER)
    this.#pushIdentifier()

    // ,y,z
    let loop = true
    while (loop) {
      this.#next()
      if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.comma])) {
        this.#pushSymbol()
        this.#next()
        this.#verify(TokenType.IDENTIFIER)
        this.#pushIdentifier()
      } else {
        loop = false
      }
    }

    // ;
    this.#verify(TokenType.SYMBOL, [SYMBOLS.semicolon])
    this.#pushSymbol()
    this.#push(isClassVarDec ? `</classVarDec>` : `</varDec>`)
  }

  // statement*
  compileStatements() {
    this.#push('<statements>')

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

    this.#push('</statements>')
  }

  // do moveLeft(2+3)
  // do Square.moveLeft(2+3)
  compileDo() {
    // do
    this.#push(`<doStatement>`)
    this.#pushKeyword()

    // Square | moveLeft
    this.#next()
    this.#verify(TokenType.IDENTIFIER)
    this.#pushIdentifier()

    this.#next()

    if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.dot])) {
      // .
      this.#pushSymbol()
      this.#next()
      // moveLeft
      this.#verify(TokenType.IDENTIFIER)
      this.#pushIdentifier()
      this.#next()
    }

    // (
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])
    this.#pushSymbol()

    this.compileExpressionList()

    // )
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
    this.#pushSymbol()

    // ;
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.semicolon])
    this.#pushSymbol()
    this.#push(`</doStatement>`)
  }

  // 'let' varName('[' expression ']')? '=' expression ';'
  compileLet() {
    // let
    this.#push(`<letStatement>`)
    this.#pushKeyword()

    // varName
    this.#next()
    this.#verify(TokenType.IDENTIFIER)
    this.#pushIdentifier()

    this.#next()
    // [
    if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.lBracket])) {
      this.#pushSymbol()

      this.compileExpression()

      // ]
      this.#verify(TokenType.SYMBOL, [SYMBOLS.rBracket])
      this.#pushSymbol()
      this.#next()
    }

    // =
    this.#verify(TokenType.SYMBOL, [SYMBOLS.eq])
    this.#pushSymbol()

    this.compileExpression()

    // ;
    this.#verify(TokenType.SYMBOL, [SYMBOLS.semicolon])
    this.#pushSymbol()
    this.#push(`</letStatement>`)
  }

  compileReturn() {
    // return
    this.#push(`<returnStatement>`)
    this.#pushKeyword()

    this.#next()
    if (!this.#ifType(TokenType.SYMBOL, [SYMBOLS.semicolon])) {
      this.#isPendingNext = true
      this.compileExpression()
    }

    // ;
    this.#verify(TokenType.SYMBOL, [SYMBOLS.semicolon])
    this.#pushSymbol()
    this.#push(`</returnStatement>`)
  }

  // 'if' '(' expression ')' '{' statements '}'
  compileIf() {
    // if
    this.#push(`<ifStatement>`)
    this.#pushKeyword()

    // (
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])
    this.#pushSymbol()

    this.compileExpression()

    // )
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
    this.#pushSymbol()

    // {
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])
    this.#pushSymbol()

    this.compileStatements()

    // }
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])
    this.#pushSymbol()

    // else
    this.#next()
    if (this.#ifType(TokenType.KEYWORD, [KEYWORDS.else])) {
      this.#pushKeyword()
      // {
      this.#next()
      this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])
      this.#pushSymbol()

      this.compileStatements()

      // }
      this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])
      this.#pushSymbol()
    } else {
      this.#isPendingNext = true
    }

    this.#push(`</ifStatement>`)
  }

  // 'while' '(' expression ')' '{' statements '}'
  compileWhile() {

    // while
    this.#push(`<whileStatement>`)
    this.#pushKeyword()

    // (
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])
    this.#pushSymbol()

    this.compileExpression()

    // )
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
    this.#pushSymbol()

    // {
    this.#next()
    this.#verify(TokenType.SYMBOL, [SYMBOLS.lBrace])
    this.#pushSymbol()

    this.compileStatements()

    // }
    this.#verify(TokenType.SYMBOL, [SYMBOLS.rBrace])
    this.#pushSymbol()

    this.#push(`</whileStatement>`)
  }

  compileExpression() {
    this.#push('<expression>')

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
        ])
      ) {
        this.#pushSymbol()
        this.compileTerm()
      } else {
        loop = false
      }
    }

    this.#push('</expression>')
  }

  compileTerm() {
    this.#next()
    this.#push('<term>')
    switch (this.#tokenize.tokenType()) {
      case TokenType.INT_CONST:
        this.#pushInteger()
        break
      case TokenType.STRING_CONST:
        this.#pushString()
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
          this.#pushKeyword()
        }
        break
      case TokenType.IDENTIFIER:
        this.#pushIdentifier()

        this.#next()
        // [
        if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.lBracket])) {
          this.#pushSymbol()

          this.compileExpression()

          // ]
          this.#verify(TokenType.SYMBOL, [SYMBOLS.rBracket])
          this.#pushSymbol()
          this.#next()
        } else if (
          // subroutineCall
          this.#ifType(TokenType.SYMBOL, [SYMBOLS.dot]) ||
          this.#ifType(TokenType.SYMBOL, [SYMBOLS.lParenthesis])
        ) {
          if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.dot])) {
            // .
            this.#pushSymbol()
            this.#next()
            // moveLeft
            this.#verify(TokenType.IDENTIFIER)
            this.#pushIdentifier()
            this.#next()
          }

          // (
          this.#verify(TokenType.SYMBOL, [SYMBOLS.lParenthesis])
          this.#pushSymbol()

          this.compileExpressionList()

          // )
          this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
          this.#pushSymbol()
          this.#next()
        }
        this.#isPendingNext = true
        break

      case TokenType.SYMBOL:
        switch (this.#tokenize.symbol()) {
          case SYMBOLS.lParenthesis:
            // (
            this.#pushSymbol()
            this.compileExpression()
            // )
            this.#verify(TokenType.SYMBOL, [SYMBOLS.rParenthesis])
            this.#pushSymbol()
            break
          case SYMBOLS.sub:
          case SYMBOLS.not:
            // '-' | '~'
            this.#pushSymbol()
            this.compileTerm()
        }
    }

    this.#push('</term>')
  }

  // expression (',' expression)*
  compileExpressionList() {
    this.#push('<expressionList>')

    this.#next()
    this.#isPendingNext = true
    // TODO: update check condition
    if (!this.#ifType(TokenType.SYMBOL, [SYMBOLS.rParenthesis])) {
      this.compileExpression()
      this.#isPendingNext = true
    }

    let loop = true
    while (loop) {
      this.#next()
      if (this.#ifType(TokenType.SYMBOL, [SYMBOLS.comma])) {
        this.#pushSymbol()
        this.compileExpression()
        this.#isPendingNext = true
      } else {
        loop = false
      }
    }

    this.#push('</expressionList>')
  }
}

export default CompilationEngine
