export enum TokenType {
  KEYWORD = 'keyword',
  SYMBOL = 'symbol',
  IDENTIFIER = 'identifier',
  INT_CONST = 'integerConstant',
  STRING_CONST = 'stringConstant',
}

export enum KEYWORDS {
  class = 'class',
  constructor = 'constructor',
  function = 'function',
  method = 'method',
  field = 'field',
  static = 'static',
  var = 'var',
  int = 'int',
  char = 'char',
  boolean = 'boolean',
  void = 'void',
  true = 'true',
  false = 'false',
  null = 'null',
  this = 'this',
  let = 'let',
  do = 'do',
  if = 'if',
  else = 'else',
  while = 'while',
  return = 'return',
}

export enum SYMBOLS {
  lBrace = '{',
  rBrace = '}',
  lParenthesis = '(',
  rParenthesis = ')',
  lBracket = '[',
  rBracket = ']',
  dot = '.',
  comma = ',',
  semicolon = ';',
  add = '+',
  sub = '-',
  multiply = '*',
  divide = '/',
  and = '&',
  or = '|',
  lt = '<',
  gt = '>',
  eq = '=',
  not = '~',
}

export const IDENTIFIER_REG = /^[_a-z][_a-z0-9]*$/i

export const enum KIND {
  field = 'field',
  static = 'static',
  arguments = 'arguments',
  local = 'local',
}
