import { SYMBOLS } from './grammar'

export enum COMMANDS {
  ADD = 'add',
  SUB = 'sub',
  EQ = 'eq',
  LT = 'lt',
  GT = 'gt',
  NEG = 'neg',
  AND = 'and',
  OR = 'or',
  NOT = 'not',
}

export enum SEGMENTS {
  ARG = 'argument',
  LOCAL = 'local',
  THIS = 'this',
  THAT = 'that',
  CONST = 'constant',
  STATIC = 'static',
  TEMP = 'temp',
  POINTER = 'pointer',
}
